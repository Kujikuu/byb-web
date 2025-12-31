<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class EventApiClient
{
    /**
     * Get a configured HTTP client instance for the events API.
     */
    protected function client(?string $locale = null): PendingRequest
    {
        $baseUrl = rtrim(Config::get('events.api_base_url'), '/');
        // Remove /v1 from baseUrl if it exists, as endpoints will include it
        $baseUrl = preg_replace('/\/v1$/', '', $baseUrl);
        $locale = $locale ?? Config::get('events.default_locale', 'en');

        $client = Http::baseUrl($baseUrl)
            ->acceptJson()
            ->asJson()
            ->withHeaders([
                'Accept-Language' => $locale,
            ])
            ->timeout(10);

        // Add authentication token if available
        $token = $this->getApiToken();
        if ($token) {
            $client->withToken($token);
        }

        return $client;
    }

    /**
     * Get API authentication token.
     * Caches the token to avoid repeated authentication requests.
     */
    protected function getApiToken(): ?string
    {
        $email = Config::get('events.api_email');
        $password = Config::get('events.api_password');

        // If no credentials configured, return null (for development/testing)
        if (! $email || ! $password) {
            return null;
        }

        // Try to get token from cache (cache for 1 hour)
        return Cache::remember('api_auth_token', 3600, function () use ($email, $password) {
            $baseUrl = rtrim(Config::get('events.api_base_url'), '/');

            // Remove /v1 from baseUrl if it exists, as we'll add it in the endpoint
            $baseUrl = preg_replace('/\/v1$/', '', $baseUrl);

            // Build full URL to avoid issues with baseUrl and POST
            $loginUrl = $baseUrl.'/v1/auth/login';

            try {
                $response = Http::acceptJson()
                    ->asJson()
                    ->post($loginUrl, [
                        'email' => $email,
                        'password' => $password,
                        'device_name' => 'eventon-calendar-app',
                    ]);

                if ($response->successful()) {
                    $data = $response->json();

                    return $data['data']['token'] ?? $data['token'] ?? null;
                }

                Log::channel('api')->warning('Failed to authenticate with API', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'endpoint' => $loginUrl,
                ]);

                return null;
            } catch (\Exception $e) {
                Log::channel('api')->error('Error authenticating with API', [
                    'exception' => get_class($e),
                    'message' => $e->getMessage(),
                    'endpoint' => $loginUrl,
                ]);

                return null;
            }
        });
    }

    /**
     * Fetch events from the byb-db API with retry logic and caching.
     *
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function fetchEvents(array $params = [], ?string $locale = null, int $maxRetries = 3): array
    {
        // Build cache key from params and locale
        $cacheKey = $this->getEventsCacheKey($params, $locale);
        $cacheDuration = 900; // 15 minutes

        // Try to get from cache first
        return Cache::remember($cacheKey, $cacheDuration, function () use ($params, $locale, $maxRetries) {
            // Always use 'v1/events' as baseUrl is normalized in client() method
            $endpoint = 'v1/events';

            $attempt = 0;
            $lastException = null;

            while ($attempt < $maxRetries) {
                try {
                    $response = $this->client($locale)->get($endpoint, $params);

                    if ($response->successful()) {
                        $json = $response->json();

                        // Laravel resource collections typically wrap data in a "data" key
                        $rawEvents = Arr::get($json, 'data', $json);

                        return [
                            'events' => $this->normalizeEvents($rawEvents),
                            'meta' => Arr::except($json, ['data']),
                        ];
                    }

                    // Don't retry on client errors (4xx)
                    if ($response->status() >= 400 && $response->status() < 500) {
                        Log::channel('api')->warning('Event API client error', [
                            'status' => $response->status(),
                            'endpoint' => $endpoint,
                            'params' => $params,
                        ]);

                        return [
                            'events' => [],
                            'meta' => [
                                'error' => true,
                                'message' => $response->json('message') ?? 'Failed to load events.',
                                'status' => $response->status(),
                            ],
                        ];
                    }

                    // Retry on server errors (5xx) or network errors
                    $attempt++;
                    if ($attempt < $maxRetries) {
                        sleep(min($attempt, 3)); // Exponential backoff: 1s, 2s, 3s

                        continue;
                    }

                    // Last attempt failed
                    Log::channel('api')->error('Event API request failed after retries', [
                        'status' => $response->status(),
                        'endpoint' => $endpoint,
                        'attempts' => $attempt,
                    ]);

                    return [
                        'events' => [],
                        'meta' => [
                            'error' => true,
                            'message' => $response->json('message') ?? 'Failed to load events after multiple attempts.',
                            'status' => $response->status(),
                        ],
                    ];
                } catch (\Exception $e) {
                    $lastException = $e;
                    $attempt++;

                    // Log network errors
                    Log::channel('api')->warning('Event API network error', [
                        'exception' => get_class($e),
                        'message' => $e->getMessage(),
                        'endpoint' => $endpoint,
                        'attempt' => $attempt,
                    ]);

                    if ($attempt < $maxRetries) {
                        sleep(min($attempt, 3)); // Exponential backoff

                        continue;
                    }
                }
            }

            // All retries exhausted
            Log::channel('api')->error('Event API request failed completely', [
                'endpoint' => $endpoint,
                'attempts' => $attempt,
                'exception' => $lastException?->getMessage(),
            ]);

            return [
                'events' => [],
                'meta' => [
                    'error' => true,
                    'message' => 'Network error: Unable to connect to the events API. Please check your connection and try again.',
                    'status' => 0,
                ],
            ];
        });
    }

    /**
     * Get cache key for events API request.
     *
     * @param  array<string, mixed>  $params
     */
    protected function getEventsCacheKey(array $params, ?string $locale): string
    {
        // Sort params for consistent cache keys
        ksort($params);
        $paramsHash = md5(json_encode($params));
        $localeKey = $locale ?? 'default';

        return "event_api_client:events:{$localeKey}:{$paramsHash}";
    }

    /**
     * Fetch lookups for filters (types, industries, etc.) from the API.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function fetchFilterLookups(?string $locale = null): array
    {
        $client = $this->client($locale);

        $endpoints = [
            'types' => '/event-types',
            'industries' => '/industries',
            'countries' => '/countries',
            'statuses' => '/event-statuses',
            'tags' => '/tags',
        ];

        $results = [];

        // Always use 'v1' prefix as baseUrl is normalized in client() method
        foreach ($endpoints as $key => $endpoint) {
            $fullEndpoint = 'v1'.ltrim($endpoint, '/');
            $response = $client->get($fullEndpoint);

            if ($response->ok()) {
                $json = $response->json();
                $results[$key] = Arr::get($json, 'data', $json);
            } else {
                $results[$key] = [];
            }
        }

        return $results;
    }

    /**
     * Normalize events into a calendar-friendly structure.
     *
     * @param  array<int, array<string, mixed>>  $rawEvents
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeEvents(array $rawEvents): array
    {
        return array_map(function (array $event): array {
            $start = $event['start_datetime'] ?? null;
            $end = $event['end_datetime'] ?? null;

            $assetBase = rtrim(Config::get('events.asset_base_url'), '/');
            $images = $event['images'] ?? [];

            if (! is_array($images)) {
                $images = [$images];
            }

            $normalizedImages = array_map(function ($image) use ($assetBase) {
                // Already a structured image object
                if (is_array($image)) {
                    if (isset($image['url'])) {
                        $image['url'] = $this->normalizeAssetUrl($image['url'], $assetBase);
                    }

                    return $image;
                }

                return $this->normalizeAssetUrl((string) $image, $assetBase);
            }, $images);

            $related = array_map(function (array $related) use ($assetBase) {
                $relatedStart = $related['start_datetime'] ?? null;
                $relatedEnd = $related['end_datetime'] ?? null;

                $images = $related['images'] ?? [];
                if (! is_array($images)) {
                    $images = [$images];
                }

                $normalizedRelatedImages = array_map(function ($image) use ($assetBase) {
                    if (is_array($image)) {
                        if (isset($image['url'])) {
                            $image['url'] = $this->normalizeAssetUrl($image['url'], $assetBase);
                        }

                        return $image;
                    }

                    return $this->normalizeAssetUrl((string) $image, $assetBase);
                }, $images);

                // Normalize related organizer image (if present)
                $relatedOrganizer = $related['organizer'] ?? null;
                if (is_array($relatedOrganizer) && ! empty($relatedOrganizer['image'])) {
                    $relatedOrganizer['image'] = $this->normalizeAssetUrl(
                        (string) $relatedOrganizer['image'],
                        $assetBase
                    );
                }

                return [
                    'id' => $related['id'] ?? null,
                    'title' => $related['title'] ?? '',
                    'description' => $related['description'] ?? '',
                    'startDateTime' => $relatedStart,
                    'endDateTime' => $relatedEnd,
                    'timezone' => $related['timezone'] ?? null,
                    'allDay' => $this->isAllDay($relatedStart, $relatedEnd),
                    'status' => $related['event_status'] ?? null,
                    'type' => $related['event_type'] ?? null,
                    'industry' => $related['industry'] ?? null,
                    'country' => $related['country'] ?? null,
                    'organizer' => $relatedOrganizer,
                    'venue' => $related['venue'] ?? null,
                    'tags' => $related['tags'] ?? [],
                    'googleMapsUrl' => $related['google_maps_url'] ?? null,
                    'images' => $normalizedRelatedImages,
                    'isAccommodationAvailable' => $related['is_accommodation_available'] ?? false,
                    'externalLink' => $related['external_link'] ?? null,
                ];
            }, $event['related_events'] ?? []);

            // Normalize main organizer image (if present)
            $organizer = $event['organizer'] ?? null;
            if (is_array($organizer) && ! empty($organizer['image'])) {
                $organizer['image'] = $this->normalizeAssetUrl(
                    (string) $organizer['image'],
                    $assetBase
                );
            }

            return [
                'id' => $event['id'] ?? null,
                'title' => $event['title'] ?? '',
                'description' => $event['description'] ?? '',
                'startDateTime' => $start,
                'endDateTime' => $end,
                'timezone' => $event['timezone'] ?? null,
                'allDay' => $this->isAllDay($start, $end),
                'status' => $event['event_status'] ?? null,
                'type' => $event['event_type'] ?? null,
                'industry' => $event['industry'] ?? null,
                'country' => $event['country'] ?? null,
                'organizer' => $organizer,
                'venue' => $event['venue'] ?? null,
                'tags' => $event['tags'] ?? [],
                'googleMapsUrl' => $event['google_maps_url'] ?? null,
                'images' => $normalizedImages,
                'isAccommodationAvailable' => $event['is_accommodation_available'] ?? false,
                'externalLink' => $event['external_link'] ?? null,
                'relatedEvents' => $related,
                'industryColor' => $event['industry_color'] ?? null,
            ];
        }, $rawEvents);
    }

    /**
     * Normalize a single asset URL or path to use the configured asset base URL.
     */
    protected function normalizeAssetUrl(string $url, string $assetBase): string
    {
        if ($url === '') {
            return $url;
        }

        // If absolute URL, replace the host with the asset base URL but keep the path
        if (Str::startsWith($url, ['http://', 'https://'])) {
            $path = parse_url($url, PHP_URL_PATH) ?: '';

            return rtrim($assetBase, '/').'/'.ltrim($path, '/');
        }

        // Relative path: just prefix with asset base
        return rtrim($assetBase, '/').'/'.ltrim($url, '/');
    }

    /**
     * Determine whether an event should be treated as all-day.
     */
    protected function isAllDay(?string $start, ?string $end): bool
    {
        if (! $start || ! $end) {
            return false;
        }

        // Simple heuristic: if both times are midnight, treat as all-day
        return str_ends_with($start, 'T00:00:00Z') && str_ends_with($end, 'T23:59:59Z');
    }

    /**
     * Fetch portfolios from the byb-db API with retry logic and caching.
     *
     * @param  array<string, mixed>  $params
     * @return array<int, array<string, mixed>>
     */
    public function fetchPortfolios(array $params = [], ?string $locale = null, int $maxRetries = 3): array
    {
        // Build cache key from params and locale
        $cacheKey = $this->getPortfoliosCacheKey($params, $locale);
        $cacheDuration = 900; // 15 minutes

        // Try to get from cache first
        return Cache::remember($cacheKey, $cacheDuration, function () use ($params, $locale, $maxRetries) {
            // Always use 'v1/portfolios' as baseUrl is normalized in client() method
            $endpoint = 'v1/portfolios';

            $attempt = 0;
            $lastException = null;

            while ($attempt < $maxRetries) {
                try {
                    $response = $this->client($locale)->get($endpoint, $params);

                    if ($response->successful()) {
                        $json = $response->json();

                        // Laravel resource collections wrap data in a "data" key
                        if (isset($json['data']) && is_array($json['data'])) {
                            $rawPortfolios = $json['data'];
                        } elseif (is_array($json) && ! isset($json['data'])) {
                            $rawPortfolios = $json;
                        } else {
                            Log::channel('api')->warning('Portfolio API returned invalid data format', [
                                'json_keys' => is_array($json) ? array_keys($json) : 'not_array',
                                'endpoint' => $endpoint,
                            ]);

                            return [];
                        }

                        if (! is_array($rawPortfolios) || empty($rawPortfolios)) {
                            return [];
                        }

                        // Normalize portfolio images to absolute URLs
                        $assetBase = rtrim(Config::get('events.asset_base_url'), '/');

                        return array_map(function (array $portfolio) use ($assetBase): array {
                            // Normalize images array (new format - preferred)
                            if (isset($portfolio['images']) && is_array($portfolio['images']) && ! empty($portfolio['images'])) {
                                $portfolio['images'] = array_map(function ($image) use ($assetBase) {
                                    if (is_string($image) && ! empty($image) && ! Str::startsWith($image, ['http://', 'https://'])) {
                                        // If path doesn't start with storage/, add it (Filament stores in storage/app/public)
                                        if (! Str::startsWith($image, 'storage/')) {
                                            $image = 'storage/'.ltrim($image, '/');
                                        }

                                        return $this->normalizeAssetUrl($image, $assetBase);
                                    }

                                    return $image;
                                }, array_filter($portfolio['images']));
                            } elseif (isset($portfolio['image']) && is_string($portfolio['image']) && ! empty($portfolio['image'])) {
                                // Fallback: if only single image exists, convert to array format
                                if (! Str::startsWith($portfolio['image'], ['http://', 'https://'])) {
                                    if (! Str::startsWith($portfolio['image'], 'storage/')) {
                                        $portfolio['image'] = 'storage/'.ltrim($portfolio['image'], '/');
                                    }
                                    $portfolio['image'] = $this->normalizeAssetUrl($portfolio['image'], $assetBase);
                                }
                                // Also set images array for consistency
                                $portfolio['images'] = [$portfolio['image']];
                            } else {
                                $portfolio['images'] = [];
                            }

                            // Normalize single image URL for backward compatibility (first image from array)
                            if (! empty($portfolio['images']) && is_array($portfolio['images'])) {
                                $portfolio['image'] = $portfolio['images'][0];
                            } elseif (empty($portfolio['image'])) {
                                $portfolio['image'] = null;
                            }

                            // Normalize industry image if present
                            if (isset($portfolio['industry']['image']) && ! empty($portfolio['industry']['image'])) {
                                if (! Str::startsWith($portfolio['industry']['image'], ['http://', 'https://'])) {
                                    if (! Str::startsWith($portfolio['industry']['image'], 'storage/')) {
                                        $portfolio['industry']['image'] = 'storage/'.ltrim($portfolio['industry']['image'], '/');
                                    }
                                    $portfolio['industry']['image'] = $this->normalizeAssetUrl(
                                        (string) $portfolio['industry']['image'],
                                        $assetBase
                                    );
                                }
                            }

                            return $portfolio;
                        }, $rawPortfolios);
                    }

                    // Don't retry on client errors (4xx)
                    if ($response->status() >= 400 && $response->status() < 500) {
                        Log::channel('api')->warning('Portfolio API client error', [
                            'status' => $response->status(),
                            'endpoint' => $endpoint,
                        ]);

                        return [];
                    }

                    // Retry on server errors (5xx)
                    $attempt++;
                    if ($attempt < $maxRetries) {
                        sleep(min($attempt, 3));

                        continue;
                    }

                    Log::channel('api')->error('Portfolio API request failed after retries', [
                        'status' => $response->status(),
                        'endpoint' => $endpoint,
                        'attempts' => $attempt,
                    ]);

                    return [];
                } catch (\Exception $e) {
                    $lastException = $e;
                    $attempt++;

                    Log::channel('api')->warning('Portfolio API network error', [
                        'exception' => get_class($e),
                        'message' => $e->getMessage(),
                        'endpoint' => $endpoint,
                        'attempt' => $attempt,
                    ]);

                    if ($attempt < $maxRetries) {
                        sleep(min($attempt, 3));

                        continue;
                    }
                }
            }

            // All retries exhausted
            Log::channel('api')->error('Portfolio API request failed completely', [
                'endpoint' => $endpoint,
                'attempts' => $attempt,
                'exception' => $lastException?->getMessage(),
            ]);

            return [];
        });
    }

    /**
     * Get cache key for portfolios API request.
     *
     * @param  array<string, mixed>  $params
     */
    protected function getPortfoliosCacheKey(array $params, ?string $locale): string
    {
        // Sort params for consistent cache keys
        ksort($params);
        $paramsHash = md5(json_encode($params));
        $localeKey = $locale ?? 'default';

        return "event_api_client:portfolios:{$localeKey}:{$paramsHash}";
    }
}

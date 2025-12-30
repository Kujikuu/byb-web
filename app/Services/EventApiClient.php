<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class EventApiClient
{
    /**
    * Get a configured HTTP client instance for the events API.
    *
    * @param  string|null  $locale
    */
    protected function client(?string $locale = null): PendingRequest
    {
        $baseUrl = rtrim(Config::get('events.api_base_url'), '/');
        $locale = $locale ?? Config::get('events.default_locale', 'en');

        return Http::baseUrl($baseUrl)
            ->acceptJson()
            ->asJson()
            ->withHeaders([
                'Accept-Language' => $locale,
            ])
            ->timeout(10);
    }

    /**
    * Fetch events from the byb-db API.
    *
    * @param  array<string, mixed>  $params
    * @param  string|null  $locale
    * @return array<string, mixed>
    */
    public function fetchEvents(array $params = [], ?string $locale = null): array
    {
        // Get baseUrl to check if it already includes /v1
        $baseUrl = rtrim(Config::get('events.api_base_url'), '/');
        // If baseUrl ends with /v1, use 'events', otherwise use 'v1/events'
        $endpoint = str_ends_with($baseUrl, '/v1') ? 'events' : 'v1/events';
        
        $response = $this->client($locale)->get($endpoint, $params);

        if ($response->failed()) {
            return [
                'events' => [],
                'meta' => [
                    'error' => true,
                    'message' => $response->json('message') ?? 'Failed to load events.',
                    'status' => $response->status(),
                ],
            ];
        }

        $json = $response->json();

        // Laravel resource collections typically wrap data in a "data" key
        $rawEvents = Arr::get($json, 'data', $json);

        return [
            'events' => $this->normalizeEvents($rawEvents),
            'meta' => Arr::except($json, ['data']),
        ];
    }

    /**
    * Fetch lookups for filters (types, industries, etc.) from the API.
    *
    * @param  string|null  $locale
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

        // Check if baseUrl already includes /v1
        $baseUrl = rtrim(Config::get('events.api_base_url'), '/');
        $v1Prefix = str_ends_with($baseUrl, '/v1') ? '' : 'v1';
        
        foreach ($endpoints as $key => $endpoint) {
            $fullEndpoint = $v1Prefix ? ($v1Prefix . ltrim($endpoint, '/')) : ltrim($endpoint, '/');
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
     * Fetch portfolios from the byb-db API.
     *
     * @param  array<string, mixed>  $params
     * @param  string|null  $locale
     * @return array<int, array<string, mixed>>
     */
    public function fetchPortfolios(array $params = [], ?string $locale = null): array
    {
        // Get baseUrl to check if it already includes /v1
        $baseUrl = rtrim(Config::get('events.api_base_url'), '/');
        // If baseUrl ends with /v1, use 'portfolios', otherwise use 'v1/portfolios'
        $endpoint = str_ends_with($baseUrl, '/v1') ? 'portfolios' : 'v1/portfolios';
        
        $response = $this->client($locale)->get($endpoint, $params);

        if ($response->failed()) {
            \Log::warning('Portfolio API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return [];
        }

        $json = $response->json();

        // Laravel resource collections wrap data in a "data" key
        // Check if response has 'data' key (from ResourceCollection)
        if (isset($json['data']) && is_array($json['data'])) {
            $rawPortfolios = $json['data'];
        } elseif (is_array($json) && ! isset($json['data'])) {
            // If response is already an array of portfolios (shouldn't happen with ResourceCollection)
            $rawPortfolios = $json;
        } else {
            \Log::warning('Portfolio API returned invalid data format', [
                'json_keys' => is_array($json) ? array_keys($json) : 'not_array',
                'json' => $json,
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
                            $image = 'storage/' . ltrim($image, '/');
                        }
                        return $this->normalizeAssetUrl($image, $assetBase);
                    }
                    return $image;
                }, array_filter($portfolio['images']));
            } elseif (isset($portfolio['image']) && is_string($portfolio['image']) && ! empty($portfolio['image'])) {
                // Fallback: if only single image exists, convert to array format
                if (! Str::startsWith($portfolio['image'], ['http://', 'https://'])) {
                    if (! Str::startsWith($portfolio['image'], 'storage/')) {
                        $portfolio['image'] = 'storage/' . ltrim($portfolio['image'], '/');
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
                        $portfolio['industry']['image'] = 'storage/' . ltrim($portfolio['industry']['image'], '/');
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
}


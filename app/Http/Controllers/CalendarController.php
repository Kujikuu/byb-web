<?php

namespace App\Http\Controllers;

use App\Services\EventApiClient;
use App\Services\LocaleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(Request $request, EventApiClient $client, LocaleService $localeService): Response
    {
        $now = now();

        $month = (int) $request->query('month', $now->month);
        $year = (int) $request->query('year', $now->year);
        $locale = $localeService->resolveFromRequest($request);

        $current = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $startDate = $current->copy()->startOfMonth()->toDateString();
        $endDate = $current->copy()->endOfMonth()->toDateString();

        $filters = $request->only([
            'status',
            'type',
            'industry',
            'country',
            'organizer',
            'venue',
            'tags',
            'search',
        ]);

        $apiParams = array_merge($filters, [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'include' => 'eventStatus,eventType,industry,country,organizer,venue,tags',
            'per_page' => 100,
        ]);

        $eventsPayload = $client->fetchEvents($apiParams, $locale);
        $events = $eventsPayload['events'] ?? [];

        $hasActiveFilters = ! empty(array_filter($filters));

        if ($hasActiveFilters) {
            $optionsParams = [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'include' => 'eventStatus,eventType,industry,country,organizer,venue,tags',
                'per_page' => 100,
            ];

            $optionsPayload = $client->fetchEvents($optionsParams, $locale);
            $allEventsForMonth = $optionsPayload['events'] ?? [];
        } else {
            $allEventsForMonth = $events;
        }

        $filterOptionsForCurrentMonth = [
            'types' => $this->buildFilterOptions($allEventsForMonth, 'type'),
            'industries' => $this->buildFilterOptions($allEventsForMonth, 'industry'),
            'countries' => $this->buildFilterOptions($allEventsForMonth, 'country'),
            'statuses' => $this->buildFilterOptions($allEventsForMonth, 'status'),
            'tags' => $this->buildFilterOptions($allEventsForMonth, 'tags', true),
        ];

        Log::channel('api')->info('Calendar page viewed', [
            'month' => $month,
            'year' => $year,
            'locale' => $locale,
            'event_count' => count($events),
            'has_filters' => $hasActiveFilters,
            'filters' => $filters,
            'ip' => $request->ip(),
        ]);

        return Inertia::render('Calendar/Index', [
            'initialMonth' => $month,
            'initialYear' => $year,
            'events' => $events,
            'filters' => [
                'options' => $filterOptionsForCurrentMonth,
                'active' => $filters,
            ],
            'meta' => $eventsPayload['meta'] ?? [],
            'ui' => [
                'showJumpMonths' => (bool) config('events.show_jump_months', true),
            ],
            'locale' => $locale,
        ]);
    }

    /**
     * Build filter options from events collection.
     *
     * @param  array<int, array<string, mixed>>  $events
     * @return array<int, mixed>
     */
    protected function buildFilterOptions(array $events, string $key, bool $flatten = false): array
    {
        $collection = collect($events)->pluck($key);

        if ($flatten) {
            $collection = $collection->flatten(1);
        }

        return $collection
            ->filter()
            ->unique('id')
            ->values()
            ->all();
    }
}

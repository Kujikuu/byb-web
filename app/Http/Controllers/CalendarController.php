<?php

namespace App\Http\Controllers;

use App\Services\EventApiClient;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(Request $request, EventApiClient $client): Response
    {
        $now = now();

        $month = (int) $request->query('month', $now->month);
        $year = (int) $request->query('year', $now->year);

        // Get locale from request (query param, cookie, header, or default)
        $locale = $request->query('locale')
            ?? $request->cookie('app_language')
            ?? $request->header('Accept-Language')
            ?? 'en';

        // Normalize locale (accept 'ar' or 'en' only)
        $locale = in_array($locale, ['ar', 'en']) ? $locale : 'en';

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

        // Fetch events once with all filters applied
        $apiParams = array_merge($filters, [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'include' => 'eventStatus,eventType,industry,country,organizer,venue,tags',
            'per_page' => 100, // Max allowed by API validation
        ]);

        $eventsPayload = $client->fetchEvents($apiParams, $locale);
        $events = $eventsPayload['events'] ?? [];

        // To build filter options, we need all events for the month (without filters)
        // But we can optimize by reusing the same API call if no filters are active
        $hasActiveFilters = ! empty(array_filter($filters));

        if ($hasActiveFilters) {
            // If filters are active, fetch all events for filter options
            $optionsParams = [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'include' => 'eventStatus,eventType,industry,country,organizer,venue,tags',
                'per_page' => 100,
            ];

            $optionsPayload = $client->fetchEvents($optionsParams, $locale);
            $allEventsForMonth = $optionsPayload['events'] ?? [];
        } else {
            // No filters active, use the same events we already fetched
            $allEventsForMonth = $events;
        }

        // Build filter options from all events in the current month
        $types = collect($allEventsForMonth)
            ->pluck('type')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $industries = collect($allEventsForMonth)
            ->pluck('industry')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $countries = collect($allEventsForMonth)
            ->pluck('country')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $statuses = collect($allEventsForMonth)
            ->pluck('status')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $tags = collect($allEventsForMonth)
            ->pluck('tags')
            ->flatten(1)
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $filterOptionsForCurrentMonth = [
            'types' => $types,
            'industries' => $industries,
            'countries' => $countries,
            'statuses' => $statuses,
            'tags' => $tags,
        ];

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
}

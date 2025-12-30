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

        // Params used for the main event list (respect current filters)
        $apiParams = array_merge($filters, [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'include' => 'eventStatus,eventType,industry,country,organizer,venue,tags',
            'per_page' => 100, // Max allowed by API validation
        ]);

        $eventsPayload = $client->fetchEvents($apiParams, $locale);

        // For filter options, we want all values for the current month,
        // regardless of the currently active filters (except date range).
        $optionsParams = [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'include' => 'eventStatus,eventType,industry,country,organizer,venue,tags',
            'per_page' => 100, // Max allowed by API validation
        ];

        $optionsPayload = $client->fetchEvents($optionsParams, $locale);

        // Normalized events for the current visible month, without filters
        $currentEvents = $optionsPayload['events'] ?? [];

        // Build filter options based only on events in the current month
        $types = collect($currentEvents)
            ->pluck('type')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $industries = collect($currentEvents)
            ->pluck('industry')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $countries = collect($currentEvents)
            ->pluck('country')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        // Statuses and tags can also be limited to current month if desired
        $statuses = collect($currentEvents)
            ->pluck('status')
            ->filter()
            ->unique('id')
            ->values()
            ->all();

        $tags = collect($currentEvents)
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
            'events' => $eventsPayload['events'] ?? [],
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

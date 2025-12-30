<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CalendarControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('events.api_base_url', 'https://byb-db.test/api');
        Config::set('events.asset_base_url', 'https://byb-db.test');
        Config::set('events.show_jump_months', true);
    }

    public function test_renders_calendar_page(): void
    {
        Http::fake([
            'byb-db.test/api/v1/events*' => Http::response([
                'data' => [],
                'meta' => ['current_page' => 1, 'total' => 0],
            ], 200),
        ]);

        $response = $this->get('/calendar');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Calendar/Index')
            ->has('events')
            ->has('filters')
            ->has('meta')
        );
    }

    public function test_passes_events_to_view(): void
    {
        Http::fake([
            'byb-db.test/api/v1/events*' => Http::response([
                'data' => [
                    [
                        'id' => 1,
                        'title' => 'Test Event',
                        'start_datetime' => now()->toIso8601String(),
                    ],
                ],
                'meta' => ['current_page' => 1, 'total' => 1],
            ], 200),
        ]);

        $response = $this->get('/calendar');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('events', 1)
            ->where('events.0.title', 'Test Event')
        );
    }

    public function test_handles_month_and_year_parameters(): void
    {
        Http::fake([
            'byb-db.test/api/v1/events*' => Http::response([
                'data' => [],
                'meta' => ['current_page' => 1, 'total' => 0],
            ], 200),
        ]);

        $response = $this->get('/calendar?month=6&year=2024');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('initialMonth', 6)
            ->where('initialYear', 2024)
        );
    }

    public function test_respects_locale_parameter(): void
    {
        Http::fake([
            'byb-db.test/api/v1/events*' => Http::response([
                'data' => [],
                'meta' => ['current_page' => 1, 'total' => 0],
            ], 200),
        ]);

        $response = $this->get('/calendar?locale=ar');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'ar')
        );
    }

    public function test_builds_filter_options_from_events(): void
    {
        Http::fake([
            'byb-db.test/api/v1/events*' => Http::response([
                'data' => [
                    [
                        'id' => 1,
                        'title' => 'Event 1',
                        'event_type' => ['id' => 1, 'name' => 'Conference'],
                        'industry' => ['id' => 1, 'name' => 'Technology'],
                        'country' => ['id' => 1, 'name' => 'Saudi Arabia'],
                    ],
                ],
                'meta' => ['current_page' => 1, 'total' => 1],
            ], 200),
        ]);

        $response = $this->get('/calendar');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('filters.options.types', 1)
            ->has('filters.options.industries', 1)
            ->has('filters.options.countries', 1)
        );
    }

    public function test_applies_filters_when_provided(): void
    {
        Http::fake([
            'byb-db.test/api/v1/events*' => Http::response([
                'data' => [],
                'meta' => ['current_page' => 1, 'total' => 0],
            ], 200),
        ]);

        $response = $this->get('/calendar?type=conference&industry=technology');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('filters.active.type', 'conference')
            ->where('filters.active.industry', 'technology')
        );
    }
}

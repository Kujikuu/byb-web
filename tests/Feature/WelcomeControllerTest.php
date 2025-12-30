<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WelcomeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('events.api_base_url', 'https://byb-db.test/api');
        Config::set('events.asset_base_url', 'https://byb-db.test');
    }

    public function test_renders_welcome_page(): void
    {
        Http::fake([
            'byb-db.test/api/v1/portfolios*' => Http::response([
                'data' => [],
            ], 200),
        ]);

        $response = $this->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('portfolios')
            ->has('locale')
        );
    }

    public function test_passes_portfolios_to_view(): void
    {
        Http::fake([
            'byb-db.test/api/v1/portfolios*' => Http::response([
                'data' => [
                    [
                        'id' => 1,
                        'title' => 'Test Portfolio',
                        'image' => '/storage/images/portfolio1.jpg',
                    ],
                ],
            ], 200),
        ]);

        $response = $this->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->has('portfolios', 1)
            ->where('portfolios.0.title', 'Test Portfolio')
        );
    }

    public function test_respects_locale_parameter(): void
    {
        Http::fake([
            'byb-db.test/api/v1/portfolios*' => Http::response([
                'data' => [],
            ], 200),
        ]);

        $response = $this->get('/?locale=ar');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'ar')
        );
    }

    public function test_uses_cookie_for_locale_when_query_param_is_missing(): void
    {
        Http::fake([
            'byb-db.test/api/v1/portfolios*' => Http::response([
                'data' => [],
            ], 200),
        ]);

        $response = $this->withCookie('app_language', 'ar')->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'ar')
        );
    }

    public function test_uses_accept_language_header_when_query_and_cookie_are_missing(): void
    {
        Http::fake([
            'byb-db.test/api/v1/portfolios*' => Http::response([
                'data' => [],
            ], 200),
        ]);

        $response = $this->withHeaders(['Accept-Language' => 'ar'])->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'ar')
        );
    }

    public function test_defaults_to_en_locale_when_no_locale_is_provided(): void
    {
        Http::fake([
            'byb-db.test/api/v1/portfolios*' => Http::response([
                'data' => [],
            ], 200),
        ]);

        $response = $this->get('/');

        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
        );
    }
}

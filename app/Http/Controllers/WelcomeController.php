<?php

namespace App\Http\Controllers;

use App\Services\EventApiClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page.
     */
    public function index(Request $request, EventApiClient $client): Response
    {
        // Get locale from request
        $locale = $request->query('locale')
            ?? $request->cookie('app_language')
            ?? $request->header('Accept-Language')
            ?? 'en';

        // Normalize locale (accept 'ar' or 'en' only)
        $locale = in_array($locale, ['ar', 'en']) ? $locale : 'en';

        // Fetch portfolios from byb-db API
        $portfolios = $client->fetchPortfolios([
            'limit' => 3,
            'locale' => $locale,
            'include' => 'industry',
        ], $locale);

        // Log portfolio fetch for monitoring
        \Log::channel('api')->info('Portfolios fetched for welcome page', [
            'count' => count($portfolios),
            'locale' => $locale,
            'ip' => $request->ip(),
        ]);

        return Inertia::render('Welcome', [
            'portfolios' => $portfolios,
            'locale' => $locale,
        ]);
    }
}

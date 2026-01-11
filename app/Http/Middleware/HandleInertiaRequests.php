<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get locale from query param, cookie, header, or default to 'en'
        $locale = $request->query('locale')
            ?? $request->cookie('app_language')
            ?? $request->header('Accept-Language')
            ?? 'en';

        // Normalize locale (accept 'ar' or 'en' only)
        $locale = in_array($locale, ['ar', 'en']) ? $locale : 'en';

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => $locale,
        ];
    }
}

<?php

namespace App\Services;

use Illuminate\Http\Request;

class LocaleService
{
    public const SUPPORTED = ['en', 'ar'];

    public const DEFAULT = 'en';

    /**
     * Resolve locale from request using fallback chain.
     */
    public function resolveFromRequest(Request $request): string
    {
        $locale = $request->query('locale')
            ?? $request->cookie('app_language')
            ?? $request->header('Accept-Language')
            ?? self::DEFAULT;

        return $this->normalize($locale);
    }

    /**
     * Normalize locale to supported values.
     */
    public function normalize(string $locale): string
    {
        return in_array($locale, self::SUPPORTED) ? $locale : self::DEFAULT;
    }

    /**
     * Check if the given locale is supported.
     */
    public function isSupported(?string $locale): bool
    {
        return $locale && in_array($locale, self::SUPPORTED);
    }
}

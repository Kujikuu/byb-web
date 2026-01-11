# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eventon Calendar App is a Laravel 12 + Inertia.js + React application that displays events and portfolios from an external API (byb-db). It features a calendar view, filtering, bilingual support (English/Arabic with RTL), and smooth animations using Lenis and Framer Motion.

## Development Commands

### Backend
- `composer run dev` - Start Laravel server, queue worker, logs, and Vite dev server concurrently
- `php artisan serve` - Start Laravel server only
- `php artisan test` - Run all tests
- `php artisan test tests/Feature/ExampleTest.php` - Run specific test file
- `php artisan test --filter=testName` - Run tests matching a pattern
- `vendor/bin/pint` - Run Laravel Pint code formatter (run before finalizing changes)

### Frontend
- `npm run dev` - Start Vite dev server for hot module replacement
- `npm run build` - Build assets for production

### Setup
- `composer run setup` - Full project setup (composer, env, key, migrate, npm, build)

## Architecture

### Backend (Laravel 12)

**Streamlined Structure:** Laravel 11+ structure with no `app/Http/Middleware.php` files. Middleware and exceptions are registered in `bootstrap/app.php`.

**Key Services:**
- `App\Services\EventApiClient` - Handles all external API communication with caching, retry logic, and authentication token management

**Controllers:**
- `CalendarController` - Main calendar page, fetches events and builds filter options
- `WelcomeController` - Homepage with portfolios
- Profile and Auth controllers (from Laravel Breeze, currently unused)

**Configuration (`config/events.php`):**
- `api_base_url` - External events API base URL
- `asset_base_url` - Base URL for event images
- `api_email` / `api_password` - API authentication credentials

**Logging:** Dedicated `api` log channel for API requests/responses. Use `Log::channel('api')` for API-related logging.

### Frontend (React + Inertia.js)

**Entry Point:** `resources/js/app.jsx`

**Component Hierarchy:**
```
ErrorBoundary (catches and logs errors to backend)
  └─ LenisProvider (smooth scroll via Lenis + Framer Motion integration)
      └─ LanguageProvider (i18n context, RTL/LTR switching)
          └─ Inertia App
```

**Pages:** `resources/js/Pages/` - Inertia page components (Calendar, Welcome, About, Services, Contact, NotFound)

**Layouts:** `resources/js/Layouts/PublicLayout.jsx` - Shared layout wrapper

**Key Integrations:**
- **Lenis + Framer Motion:** Smooth scrolling integrated via Framer Motion's frame system (`autoRaf: false`)
- **i18next:** Bilingual support with `resources/js/locales/en.json` and `ar.json`
- **Phosphor Icons:** Icon library via `phosphor-react`

### Internationalization

**Supported Languages:** English (`en`), Arabic (`ar`)

**Language Storage:** `localStorage` + cookie (`app_language`)

**RTL Support:** Automatically sets `dir="rtl"` on `<html>` when Arabic is selected

**Updating Translations:** Edit JSON files in `resources/js/locales/`

### External API Integration

The app connects to an external events API (byb-db) via `EventApiClient`:

1. **Authentication:** POST to `/v1/auth/login` with email/password, token cached for 1 hour
2. **Events:** GET from `/v1/events` with date filters and includes
3. **Portfolios:** GET from `/v1/portfolios`
4. **Lookups:** Filter options fetched from `/event-types`, `/industries`, `/countries`, `/event-statuses`, `/tags`

**Caching:** 15-minute cache on events and portfolios responses.

**Image Handling:** Relative image paths from API are converted to absolute URLs using `asset_base_url` config.

### Path Aliases

Vite is configured with `@` as alias for `resources/js/`:
```js
import Component from '@/Components/MyComponent';
```

### Testing

Uses PHPUnit (not Pest). Tests in `tests/Feature/` and `tests/Unit/`.

When creating tests for API interactions, consider using HTTP fakes or mocking `EventApiClient`.

### Laravel Boost MCP Server

This project uses Laravel Boost, an MCP server with specialized tools:
- `search-docs` - Search Laravel ecosystem documentation (use before making changes)
- `list-artisan-commands` - List available Artisan commands
- `tinker` - Execute PHP code for debugging
- `database-query` - Query database directly
- `browser-logs` - Read browser console logs
- `get-absolute-url` - Generate correct URLs for the Herd-served app

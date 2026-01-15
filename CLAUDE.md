# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eventon Calendar App is a Laravel 12 + Inertia.js v2 + React 18 application that displays events and portfolios from an external API (byb-db). It features a calendar view, filtering, bilingual support (English/Arabic with RTL), and smooth animations using Lenis and Framer Motion.

## Development Commands

### Backend
- `composer run dev` - Start Laravel server, queue worker, logs, and Vite dev server concurrently
- `php artisan serve` - Start Laravel server only
- `php artisan test` - Run all tests
- `php artisan test tests/Feature/ExampleTest.php` - Run specific test file
- `php artisan test --filter=testName` - Run tests matching a pattern
- `vendor/bin/pint` - Run Laravel Pint code formatter (run before finalizing changes)
- `php artisan make:test --phpunit` - Create a new PHPUnit test
- `php artisan make:class` - Create a generic PHP class

### Frontend
- `npm run dev` - Start Vite dev server for hot module replacement
- `npm run build` - Build assets for production

### Setup
- `composer run setup` - Full project setup (composer, env, key, migrate, npm, build)

## Code Style & Conventions

### PHP (from Laravel Boost rules)
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) {}`
- Always use explicit return type declarations for methods and functions
- Use curly braces for all control structures, even single-line
- Prefer PHPDoc blocks over inline comments
- Use `config('events.api_base_url')` instead of `env()` outside config files
- Always use Eloquent relationships and proper eager loading to avoid N+1 queries
- Create Form Request classes for validation rather than inline validation in controllers

### Testing
- Uses PHPUnit (not Pest) - always pass `--phpunit` to `make:test`
- Write tests that cover happy paths, failure paths, and edge cases
- Run minimal tests before finalizing changes with `php artisan test --filter=testName`

### Frontend
- Use Tailwind CSS utility classes (v3 in this project)
- Use `gap` utilities for spacing in lists, not margins
- For navigation, use `router.visit()` or Inertia's `<Link>` component
- Use `useForm` helper or `<Form>` component from Inertia v2 for forms

## Architecture

### Backend (Laravel 12)

**Streamlined Structure:** Laravel 11+ structure with no `app/Http/Middleware.php` files. Middleware and exceptions are registered in `bootstrap/app.php`.

**Key Services:**
- `App\Services\EventApiClient` - Handles all external API communication with caching, retry logic, and authentication token management
- `App\Services\LocaleService` - Handles locale resolution from requests (query param, cookie, Accept-Language header)

**Controllers:**
- `CalendarController` - Main calendar page, fetches events and builds filter options
- `WelcomeController` - Homepage with portfolios
- `ContactController` - Contact form with email notifications
- Profile and Auth controllers (from Laravel Breeze, currently unused)

**Configuration (`config/events.php`):**
- `api_base_url` - External events API base URL
- `asset_base_url` - Base URL for event images
- `api_email` / `api_password` - API authentication credentials

**Logging:** Dedicated `api` log channel for API requests/responses. Use `Log::channel('api')` for API-related logging.

### Frontend (React + Inertia.js v2)

**Entry Point:** `resources/js/app.jsx`

**Component Hierarchy:**
```
ErrorBoundary (catches and logs errors to backend at /api/v1/errors)
  └─ LenisProvider (smooth scroll via Lenis + Framer Motion integration, autoRaf: false)
      └─ LanguageProvider (i18n context, RTL/LTR switching via useLanguage hook)
          └─ Inertia App
```

**Pages:** `resources/js/Pages/` - Inertia page components (Calendar/Index, Welcome, About, Services, Contact, NotFound)

**Layouts:** `resources/js/Layouts/PublicLayout.jsx` - Shared layout wrapper

**Key Integrations:**
- **Lenis + Framer Motion:** Smooth scrolling integrated via Framer Motion's frame system (`autoRaf: false`)
- **i18next:** Bilingual support with `resources/js/locales/en.json` and `ar.json`
- **Phosphor Icons:** Icon library via `phosphor-react`
- **YARL:** Yet Another React Lightbox for image galleries

### Internationalization

**Supported Languages:** English (`en`), Arabic (`ar`) - defined in `LocaleService::SUPPORTED`

**Language Storage:** `localStorage` (`app_language`) + cookie (`app_language`)

**RTL Support:** Automatically sets `dir="rtl"` on `<html>` when Arabic is selected via `LanguageContext.jsx`

**Updating Translations:** Edit JSON files in `resources/js/locales/`

**Locale Resolution:** `LocaleService` checks: query param → cookie → Accept-Language header → default 'en'

### External API Integration

The app connects to an external events API (byb-db) via `EventApiClient`:

1. **Authentication:** POST to `/v1/auth/login` with email/password, token cached for 1 hour
2. **Events:** GET from `/v1/events` with date filters and includes
3. **Portfolios:** GET from `/v1/portfolios`
4. **Lookups:** Filter options fetched from `/event-types`, `/industries`, `/countries`, `/event-statuses`, `/tags`

**Caching:** 15-minute cache (900 seconds) on events and portfolios responses via Cache facade.

**Image Handling:** Relative image paths from API are converted to absolute URLs using `asset_base_url` config. Paths automatically get `storage/` prefix if missing.

### Contact Form

The contact form (`ContactController`) sends two emails:
1. Admin notification to `config('contact.admin_email')`
2. Confirmation email to the sender

Uses Laravel Mail classes: `ContactAdminNotification` and `ContactSenderConfirmation`.

### Path Aliases

Vite is configured with `@` as alias for `resources/js/`:
```js
import Component from '@/Components/MyComponent';
```

### Environment Variables

Key `.env` variables for the external API:
- `EVENT_API_BASE_URL` - Base URL of the API (without /v1)
- `EVENT_ASSET_BASE_URL` - Base URL for images
- `EVENT_API_LOCALE` - Default locale (en/ar)
- `EVENT_SHOW_JUMP_MONTHS` - Show jump months UI (true/false)
- `EVENT_API_EMAIL` / `EVENT_API_PASSWORD` - API authentication
- `CONTACT_ADMIN_EMAIL` - Contact form recipient

## Laravel Boost MCP Server

This project uses Laravel Boost, an MCP server with specialized tools. Use `search-docs` before making changes to get version-specific documentation.

Available tools:
- `search-docs` - Search Laravel ecosystem documentation (use before making changes)
- `list-artisan-commands` - List available Artisan commands
- `tinker` - Execute PHP code for debugging
- `database-query` - Query database directly
- `browser-logs` - Read browser console logs
- `get-absolute-url` - Generate correct URLs for the Herd-served app

The application is served by Laravel Herd at `https://byb-web.test` (use `get-absolute-url` tool to confirm).

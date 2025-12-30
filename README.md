# EventOn Calendar App

A modern, responsive event calendar application built with Laravel, Inertia.js, and React. This frontend application provides an intuitive interface for browsing and filtering events from the BYB Database API.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Development](#development)
- [API Integration](#api-integration)
- [Features Overview](#features-overview)

## Features

- **Interactive Calendar** - Month and year view with event visualization
- **Advanced Filtering** - Filter by type, industry, country, tags, dates, and more
- **Search Functionality** - Full-text search across events
- **Multi-language Support** - English and Arabic (RTL support)
- **Responsive Design** - Mobile-first, works on all devices
- **Event Details** - Rich event detail cards with images, maps, and related events
- **Portfolio Showcase** - Display portfolio items on the homepage
- **Smooth Animations** - Framer Motion for smooth transitions
- **Image Lightbox** - View event images in a lightbox gallery

## Tech Stack

### Backend
- **PHP** 8.2+
- **Laravel** 12.0
- **Inertia.js** 2.0 (Server-side routing)
- **Laravel Sanctum** 4.0 (API authentication)

### Frontend
- **React** 18.2
- **Inertia.js React** 2.0
- **Tailwind CSS** 4.0
- **Framer Motion** 12.23 (Animations)
- **React i18next** 16.5 (Internationalization)
- **Phosphor Icons** 1.4
- **Yet Another React Lightbox** 3.28 (Image gallery)
- **Lenis** 1.3 (Smooth scrolling)
- **Vite** 7.0 (Build tool)

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18.x and npm
- MySQL 8.0+ / PostgreSQL 13+ / SQLite 3.35+
- Laravel Herd (recommended) or PHP built-in server
- Access to BYB Database API (byb-db application)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eventon-calendar-app
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the environment example file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 5. Configure Environment Variables

Edit `.env` file with your configuration:

```env
APP_NAME="EventOn Calendar"
APP_ENV=local
APP_DEBUG=true
APP_URL=https://eventon-calendar-app.test

# Database (if needed for user management)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eventon_calendar
DB_USERNAME=root
DB_PASSWORD=

# BYB Database API Configuration
EVENT_API_BASE_URL=https://byb-db.test/api
EVENT_ASSET_BASE_URL=https://byb-db.test
EVENT_API_LOCALE=en
EVENT_SHOW_JUMP_MONTHS=true

# API Authentication (if required)
EVENT_API_EMAIL=your-api-email@example.com
EVENT_API_PASSWORD=your-api-password
```

### 6. Database Setup (Optional)

If you need user management or authentication:

```bash
php artisan migrate
```

### 7. Build Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

## Configuration

### API Configuration

The application connects to the BYB Database API. Configure the connection in `.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `EVENT_API_BASE_URL` | Base URL of the API (without /v1) | `https://byb-db.test/api` |
| `EVENT_ASSET_BASE_URL` | Base URL for assets (images) | `https://byb-db.test` |
| `EVENT_API_LOCALE` | Default locale | `en` or `ar` |
| `EVENT_SHOW_JUMP_MONTHS` | Show jump months UI | `true` or `false` |
| `EVENT_API_EMAIL` | API authentication email | `user@example.com` |
| `EVENT_API_PASSWORD` | API authentication password | `password` |

### Language Configuration

The application supports English and Arabic. Language files are located in:
- `resources/js/locales/en.json`
- `resources/js/locales/ar.json`

To add a new language:
1. Create a new JSON file in `resources/js/locales/`
2. Update `resources/js/i18n.js` to include the new language
3. Add language switcher option in the UI

## Running the Application

### Using Laravel Herd (Recommended)

If using Laravel Herd, the application is automatically available at:
```
https://eventon-calendar-app.test
```

### Using PHP Built-in Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### Development Mode

Run the development server with Vite:

```bash
composer run dev
```

This runs:
- PHP development server
- Queue worker (if needed)
- Pail (log viewer)
- Vite dev server with hot reload

Or run individually:

```bash
# Terminal 1: PHP server
php artisan serve

# Terminal 2: Vite dev server (with hot reload)
npm run dev
```

### Production Build

Build assets for production:

```bash
npm run build
```

## Project Structure

```
eventon-calendar-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # Application controllers
│   │   ├── Middleware/         # Middleware
│   │   └── Requests/          # Form request validation
│   ├── Models/                # Eloquent models
│   ├── Providers/             # Service providers
│   └── Services/              # Business logic (EventApiClient)
├── config/
│   └── events.php             # Events API configuration
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── resources/
│   ├── css/                   # Global styles
│   ├── js/
│   │   ├── Components/        # React components
│   │   │   ├── calendar/      # Calendar components
│   │   │   └── welcome/       # Homepage components
│   │   ├── Contexts/          # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── Layouts/           # Layout components
│   │   ├── locales/           # Translation files
│   │   ├── Pages/             # Inertia page components
│   │   └── utils/             # Utility functions
│   └── views/
│       └── app.blade.php       # Main Inertia entry point
├── routes/
│   ├── web.php                # Web routes
│   └── auth.php               # Authentication routes (if used)
└── public/                     # Public assets
```

### Key Directories

- **React Components** - `resources/js/Components/`
- **Pages** - `resources/js/Pages/`
- **Layouts** - `resources/js/Layouts/`
- **Services** - `app/Services/EventApiClient.php`
- **Hooks** - `resources/js/hooks/`
- **Utils** - `resources/js/utils/`

## Development

### Component Structure

Components are organized by feature:

- **Calendar Components** - Event calendar, filters, event details
- **Welcome Components** - Homepage sections (hero, services, portfolio, etc.)
- **Shared Components** - Reusable UI components (buttons, inputs, modals, etc.)

### Creating New Components

Create a new React component:

```jsx
// resources/js/Components/YourComponent.jsx
import { useState } from 'react';

export default function YourComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### Using Inertia Pages

Create a new Inertia page:

```jsx
// resources/js/Pages/YourPage.jsx
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function YourPage({ data }) {
  return (
    <PublicLayout>
      <Head title="Your Page" />
      <div>
        {/* Page content */}
      </div>
    </PublicLayout>
  );
}
```

Add route in `routes/web.php`:

```php
Route::get('/your-page', function () {
    return Inertia::render('YourPage', [
        'data' => 'your data',
    ]);
})->name('your.page');
```

### Styling

The project uses Tailwind CSS 4.0. Styles are defined using Tailwind utility classes.

Global styles: `resources/css/app.css`

### Internationalization

Use translations in components:

```jsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
}
```

Add translations to locale files:
- `resources/js/locales/en.json`
- `resources/js/locales/ar.json`

## API Integration

### EventApiClient

The application uses `EventApiClient` service to communicate with the BYB Database API.

**Location:** `app/Services/EventApiClient.php`

**Key Methods:**

- `fetchEvents(params, locale)` - Fetch events with filters
- `fetchFilterLookups(locale)` - Fetch filter options (types, industries, etc.)
- `fetchPortfolios(params, locale)` - Fetch portfolio items

**Usage in Controller:**

```php
use App\Services\EventApiClient;

public function index(Request $request, EventApiClient $client)
{
    $events = $client->fetchEvents([
        'type' => 'conference',
        'upcoming' => true,
        'per_page' => 20,
    ], 'en');

    return Inertia::render('Calendar/Index', [
        'events' => $events['events'],
        'meta' => $events['meta'],
    ]);
}
```

### API Authentication

If the API requires authentication, configure credentials in `.env`:

```env
EVENT_API_EMAIL=your-email@example.com
EVENT_API_PASSWORD=your-password
```

The `EventApiClient` will automatically authenticate when needed.

## Features Overview

### Calendar View

- **Month Navigation** - Navigate between months and years
- **Event Display** - Events shown on their respective dates
- **Event Details** - Click events to view detailed information
- **Filtering** - Filter events by multiple criteria
- **Search** - Search events by title, description, tags

### Event Filters

Available filters:
- **Event Type** - Conference, workshop, meetup, etc.
- **Industry** - Technology, healthcare, finance, etc.
- **Country** - Filter by country
- **Tags** - Filter by event tags
- **Date Range** - Filter by start/end dates
- **Upcoming Only** - Show only future events

### Event Details

Each event displays:
- Title and description
- Start and end dates/times
- Venue information with Google Maps link
- Organizer details
- Event images (lightbox gallery)
- Related events
- Tags and categories
- External links

### Homepage Features

- **Hero Section** - Welcome message and call-to-action
- **Services Section** - Overview of available services
- **Statistics** - Key statistics about events
- **Portfolio** - Showcase of portfolio items
- **Working Process** - How the platform works

### Multi-language Support

- **Language Switcher** - Toggle between English and Arabic
- **RTL Support** - Automatic right-to-left layout for Arabic
- **Persistent Language** - Language preference saved in localStorage
- **API Locale** - API requests include locale parameter

## Customization

### Changing Colors

Update Tailwind configuration or use CSS variables in `resources/css/app.css`.

### Adding New Pages

1. Create page component in `resources/js/Pages/`
2. Add route in `routes/web.php`
3. Update navigation if needed

### Modifying Calendar

Calendar components are in `resources/js/Components/calendar/`:
- `EventCalendar.jsx` - Main calendar component
- `CalendarHeader.jsx` - Month/year navigation
- `FilterBar.jsx` - Filter controls
- `EventDetailCard.jsx` - Event details modal

### Styling Components

Use Tailwind utility classes or create custom CSS in `resources/css/app.css`.

## Troubleshooting

### Common Issues

1. **API Connection Errors:**
   - Verify `EVENT_API_BASE_URL` in `.env`
   - Check API is running and accessible
   - Verify API authentication credentials

2. **Assets Not Loading:**
   ```bash
   npm run build
   # or for development:
   npm run dev
   ```

3. **Hot Reload Not Working:**
   - Ensure Vite dev server is running
   - Check browser console for errors
   - Clear browser cache

4. **Translation Not Working:**
   - Verify locale files exist in `resources/js/locales/`
   - Check `i18n.js` configuration
   - Ensure language is set correctly

5. **Build Errors:**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Testing

### Running Tests

```bash
php artisan test
```

### Frontend Testing

For frontend testing, consider using:
- Jest
- React Testing Library
- Playwright (for E2E testing)

## Production Deployment

### Build for Production

1. Set environment to production:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Build assets:
   ```bash
   npm run build
   ```

3. Optimize Laravel:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Environment Variables

Ensure all required environment variables are set:
- `APP_URL` - Production URL
- `EVENT_API_BASE_URL` - Production API URL
- `EVENT_ASSET_BASE_URL` - Production asset URL
- Database credentials
- API authentication credentials

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For API integration help, refer to the BYB Database API documentation:
- API endpoints and usage
- Authentication setup
- Error handling

For issues or questions, please contact the development team.

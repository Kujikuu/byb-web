<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Events API Base URL
    |--------------------------------------------------------------------------
    |
    | Base URL for the byb-db events API. This should include the /api prefix
    | but NOT /v1 (it will be added automatically). No trailing slash, e.g.:
    |
    |   https://byb-db.test/api
    |   http://localhost:8000/api
    |
    */
    'api_base_url' => env('EVENT_API_BASE_URL', 'https://byb-db.test/api'),

    /*
    |--------------------------------------------------------------------------
    | Default locale for event data
    |--------------------------------------------------------------------------
    */
    'default_locale' => env('EVENT_API_LOCALE', 'en'),

    /*
    |--------------------------------------------------------------------------
    | Asset base URL for event images
    |--------------------------------------------------------------------------
    |
    | Used to turn relative image paths (e.g. "images/events/foo.jpg") coming
    | from the byb-db API into absolute URLs. Set this to the public base URL
    | of the byb-db app, WITHOUT a trailing slash, e.g.:
    |
    |   https://byb-db.test
    |   http://localhost:8000
    |
    */
    'asset_base_url' => env('EVENT_ASSET_BASE_URL', 'http://localhost:8000'),

    /*
    |--------------------------------------------------------------------------
    | UI: Show "Jump Months" controls
    |--------------------------------------------------------------------------
    |
    | This allows you to turn the jump-months UI on or off from the
    | environment file of the calendar app.
    |
    */
    'show_jump_months' => env('EVENT_SHOW_JUMP_MONTHS', true),

    /*
    |--------------------------------------------------------------------------
    | API Authentication
    |--------------------------------------------------------------------------
    |
    | Credentials for authenticating with the byb-db API.
    | These should be stored securely in .env file.
    |
    */
    'api_email' => env('EVENT_API_EMAIL'),
    'api_password' => env('EVENT_API_PASSWORD'),
];

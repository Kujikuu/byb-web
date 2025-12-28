import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set up interceptor to add locale to all axios requests (used by Inertia)
axios.interceptors.request.use((config) => {
    const locale = localStorage.getItem('app_language') || 'en';
    if (locale && ['en', 'ar'].includes(locale)) {
        // Add locale to query params for GET requests
        if (config.method === 'get' && config.params) {
            config.params.locale = locale;
        } else if (config.method === 'get') {
            config.params = { locale };
        }
        // Add locale to headers for all requests
        config.headers['Accept-Language'] = locale;
    }
    return config;
});

/**
 * Browser Error Tracker
 * 
 * Captures unhandled errors and promise rejections from the browser
 * and sends them to the backend API for logging.
 */

// Get API base URL from environment or use current origin
// VITE_API_BASE_URL should be set to the byb-db API base URL (e.g., https://byb-db.test/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
const ERROR_ENDPOINT = `${API_BASE_URL}/api/v1/errors`;

/**
 * Track an error to the backend
 */
async function trackError(error, errorInfo = {}) {
    try {
        const errorData = {
            message: error.message || 'Unknown error',
            stack: error.stack || '',
            url: window.location.href,
            user_agent: navigator.userAgent,
            error_type: error.name || 'Error',
            timestamp: new Date().toISOString(),
            ...errorInfo,
        };

        // Include component stack if available
        if (errorInfo.componentStack) {
            errorData.stack = `${error.stack}\n\nComponent Stack:\n${errorInfo.componentStack}`;
        }

        await fetch(ERROR_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(errorData),
        });
    } catch (logError) {
        // Silently fail - don't break the app if error logging fails
        console.error('Failed to log error to backend:', logError);
    }
}

/**
 * Initialize browser error tracking
 */
export function initializeErrorTracking() {
    // Track unhandled JavaScript errors
    window.addEventListener('error', (event) => {
        const error = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
        };

        trackError(event.error || new Error(event.message), {
            file: event.filename,
            line: event.lineno,
            column: event.colno,
            error_type: 'UnhandledError',
        });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason instanceof Error 
            ? event.reason 
            : new Error(String(event.reason));

        trackError(error, {
            error_type: 'UnhandledPromiseRejection',
            reason: event.reason,
        });
    });

    // Track console errors (optional - can be noisy)
    if (import.meta.env.PROD) {
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Call original console.error
            originalConsoleError.apply(console, args);

            // Track if it looks like an error
            const errorArg = args.find(arg => arg instanceof Error);
            if (errorArg) {
                trackError(errorArg, {
                    error_type: 'ConsoleError',
                });
            }
        };
    }
}

export default {
    initializeErrorTracking,
    trackError,
};

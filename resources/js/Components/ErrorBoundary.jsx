import React from 'react';
import { router } from '@inertiajs/react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Log error to backend
        this.logErrorToBackend(error, errorInfo);
    }

    logErrorToBackend = async (error, errorInfo) => {
        try {
            // Get API base URL from environment or use current origin
            // VITE_API_BASE_URL should be set to the byb-db API base URL (e.g., https://byb-db.test/api)
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
            const errorEndpoint = `${apiBaseUrl}/api/v1/errors`;

            // Generate or retrieve request ID for correlation with backend logs
            const requestId = crypto.randomUUID ? crypto.randomUUID() : this.generateRequestId();

            const errorData = {
                message: error.message || 'Unknown error',
                stack: error.stack || '',
                url: window.location.href,
                user_agent: navigator.userAgent,
                error_type: error.name || 'Error',
                timestamp: new Date().toISOString(),
                severity: 'error',
                request_id: requestId,
            };

            // Include component stack if available
            if (errorInfo.componentStack) {
                errorData.stack = `${error.stack}\n\nComponent Stack:\n${errorInfo.componentStack}`;
            }

            // Try to get user context from page props (Inertia)
            try {
                const pageData = window.page?.props;
                if (pageData?.auth?.user) {
                    errorData.user_id = pageData.auth.user.id;
                    errorData.user_email = pageData.auth.user.email;
                }
            } catch {
                // User context not available, continue without it
            }

            await fetch(errorEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Request-ID': requestId,
                },
                body: JSON.stringify(errorData),
            });
        } catch (logError) {
            // Silently fail - don't break the app if error logging fails
            console.error('Failed to log error to backend:', logError);
        }
    };

    generateRequestId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            We're sorry, but something unexpected happened. Our team has been notified.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-4 p-3 bg-gray-100 rounded text-sm text-gray-800 overflow-auto max-h-40">
                                <strong>Error:</strong> {this.state.error.message}
                                {this.state.error.stack && (
                                    <pre className="mt-2 text-xs whitespace-pre-wrap">
                                        {this.state.error.stack}
                                    </pre>
                                )}
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={this.resetError}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.visit('/')}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

import React from 'react';
import { Warning } from 'phosphor-react';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Log error details
        this.setState({
            error,
            errorInfo,
        });

        // You can also log the error to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Optionally reload the page
        if (this.props.resetOnError) {
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.handleReset);
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-50 rounded-full mb-4">
                            <Warning className="w-6 h-6 text-red-600" weight="fill" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 text-center mb-2">
                            {this.props.title || this.props.t('errors.somethingWentWrong', 'Something went wrong')}
                        </h2>
                        <p className="text-slate-500 text-center mb-6 text-sm">
                            {this.props.message ||
                                this.props.t('errors.unexpectedError', 'We encountered an unexpected error. Please try refreshing the page.')}
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-4 p-3 bg-slate-100 rounded text-sm">
                                <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                                    {this.props.t('errors.errorDetails', 'Error Details (Development Only)')}
                                </summary>
                                <pre className="text-xs text-slate-600 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                            >
                                {this.props.t('errors.tryAgain', 'Try Again')}
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="flex-1 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {this.props.t('errors.goHome', 'Go Home')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);

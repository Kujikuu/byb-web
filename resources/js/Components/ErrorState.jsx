import React from 'react';
import { Warning, ArrowClockwise } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

export default function ErrorState({
    title,
    message,
    onRetry,
    className = '',
}) {
    const { t } = useTranslation();

    const defaultTitle = t('errors.somethingWentWrong', 'Something went wrong');
    const defaultMessage = t('errors.errorLoadingData', 'We encountered an error while loading the data. Please try again.');
    const tryAgainText = t('errors.tryAgain', 'Try Again');

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                <Warning className="w-8 h-8 text-red-600" weight="fill" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">
                {title || defaultTitle}
            </h3>
            <p className="text-slate-500 text-center mb-6 max-w-md text-sm">
                {message || defaultMessage}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                    <ArrowClockwise className="w-4 h-4" />
                    {tryAgainText}
                </button>
            )}
        </div>
    );
}

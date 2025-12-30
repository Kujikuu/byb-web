import React from 'react';
import { MagnifyingGlass, CalendarBlank, FolderOpen } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

export default function EmptyState({
    icon: Icon = MagnifyingGlass,
    title,
    message,
    action,
    className = '',
}) {
    const { t } = useTranslation();

    const defaultTitle = t('common.noDataFound', 'No data found');
    const defaultMessage = t('common.noResults', 'No results found');

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Icon className="w-8 h-8 text-slate-400" weight="regular" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">
                {title || defaultTitle}
            </h3>
            <p className="text-slate-500 text-center mb-6 max-w-md text-sm">
                {message || defaultMessage}
            </p>
            {action && action}
        </div>
    );
}

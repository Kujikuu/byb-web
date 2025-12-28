import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function FilterBar({
    showSearch = false,
    search,
    onSearchChange,
} = {}) {
    const { t } = useTranslation();
    const { url, props } = usePage();
    const { filters } = props;

    const applyFilter = (key, value) => {
        const searchParams = new URLSearchParams(
            url.split('?')[1] ?? '',
        );

        if (value) {
            searchParams.set(key, value);
        } else {
            searchParams.delete(key);
        }

        const data = Object.fromEntries(searchParams.entries());
        // Ensure locale is included from localStorage
        const locale = localStorage.getItem('app_language') || 'en';
        const dataWithLocale = { ...data, locale };

        router.get(route('calendar.index'), dataWithLocale, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const renderSelect = (
        name,
        label,
        options,
        valueKey = 'slug',
        labelKey = 'name',
    ) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                {label}
            </label>
            <select
                className="rounded-full border border-brand-border bg-brand-surface py-1.5 text-xs text-slate-700 focus:border-brand-primary focus:ring-brand-primary/60"
                value={filters?.active?.[name] ?? ''}
                onChange={(e) => applyFilter(name, e.target.value)}
            >
                <option value="">{t('common.all')}</option>
                {options?.map((opt) => (
                    <option key={opt.id ?? opt[valueKey]} value={opt[valueKey]}>
                        {opt[labelKey] ?? opt[valueKey]}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="border-b border-brand-border bg-brand-bg px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {renderSelect(
                        'type',
                        t('common.type'),
                        filters?.options?.types,
                        'slug',
                        'name',
                    )}
                    {renderSelect(
                        'industry',
                        t('common.industry'),
                        filters?.options?.industries,
                        'slug',
                        'name',
                    )}
                    {renderSelect(
                        'country',
                        t('common.country'),
                        filters?.options?.countries,
                        'code',
                        'name',
                    )}
                    {/* {renderSelect(
                        'status',
                        'Status',
                        filters?.options?.statuses,
                        'slug',
                        'name',
                    )}
                    {renderSelect(
                        'tags',
                        'Tag',
                        filters?.options?.tags,
                        'slug',
                        'name',
                    )} */}
                </div>
                {showSearch && (
                    <div className="flex items-center gap-2">
                        <input
                            type="search"
                            placeholder={t('calendar.searchPlaceholder')}
                            className="w-full rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-xs text-slate-700 focus:border-brand-primary focus:ring-brand-primary/60 sm:w-60"
                            value={search ?? ''}
                            onChange={(e) =>
                                onSearchChange && onSearchChange(e.target.value)
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}


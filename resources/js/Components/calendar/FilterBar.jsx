import { router, usePage } from '@inertiajs/react';

export default function FilterBar({
    showSearch = false,
    search,
    onSearchChange,
} = {}) {
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

        router.get(route('calendar.index'), data, {
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
                className="rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-xs text-slate-700 focus:border-brand-primary focus:ring-brand-primary/60"
                value={filters?.active?.[name] ?? ''}
                onChange={(e) => applyFilter(name, e.target.value)}
            >
                <option value="">All</option>
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
                        'Type',
                        filters?.options?.types,
                        'slug',
                        'name',
                    )}
                    {renderSelect(
                        'industry',
                        'Industry',
                        filters?.options?.industries,
                        'slug',
                        'name',
                    )}
                    {renderSelect(
                        'country',
                        'Country',
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
                            placeholder="Search events..."
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


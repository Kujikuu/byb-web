import { router } from '@inertiajs/react';
import { useState } from 'react';
import { CaretLeft, CaretRight, CalendarBlank } from 'phosphor-react';

const monthLabels = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
];

export default function CalendarHeader({
    currentMonth,
    currentYear,
    showJumpMonths = true,
}) {
    const [showJump, setShowJump] = useState(false);
    const goToMonth = (month, year) => {
        const searchParams = new URLSearchParams(
            window.location.search ?? '',
        );

        searchParams.set('month', String(month));
        searchParams.set('year', String(year));

        const data = Object.fromEntries(searchParams.entries());

        router.get(route('calendar.index'), data, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePrev = () => {
        let month = currentMonth - 1;
        let year = currentYear;
        if (month < 1) {
            month = 12;
            year -= 1;
        }
        goToMonth(month, year);
    };

    const handleNext = () => {
        let month = currentMonth + 1;
        let year = currentYear;
        if (month > 12) {
            month = 1;
            year += 1;
        }
        goToMonth(month, year);
    };

    const handleToday = () => {
        const today = new Date();
        goToMonth(today.getMonth() + 1, today.getFullYear());
    };

    const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString(
        undefined,
        { month: 'long' },
    );

    const jumpYears = Array.from(
        { length: 5 },
        (_, index) => currentYear - 2 + index,
    );

    return (
        <div className="border-b border-brand-border bg-brand-surface px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                    <div className="text-2xl font-bold uppercase tracking-tight text-slate-900">
                        {monthName.toUpperCase()}, {currentYear}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-[0.16em] text-brand-muted">
                        Events calendar
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleToday}
                        className="btn-outline hidden gap-1 sm:inline-flex"
                    >
                        <CalendarBlank className="h-3.5 w-3.5" weight="duotone" />
                        <span>Current Month</span>
                    </button>

                    {/* Month navigation pill */}
                    <div className="inline-flex items-center rounded-full border border-brand-border bg-brand-surface p-0.5">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-brand-primary-soft"
                            aria-label="Previous month"
                        >
                            <CaretLeft className="h-4 w-4" weight="bold" />
                        </button>
                        <div className="h-5 w-px bg-brand-border/80" />
                        <button
                            type="button"
                            onClick={handleNext}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-brand-primary-soft"
                            aria-label="Next month"
                        >
                            <CaretRight className="h-4 w-4" weight="bold" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleToday}
                        className="btn-primary inline-flex gap-1 sm:hidden"
                    >
                        <CalendarBlank className="h-3.5 w-3.5" weight="bold" />
                        <span>Today</span>
                    </button>
                </div>
            </div>

            {/* Jump months */}
            {showJumpMonths && (
                <div className="mt-3 space-y-2">
                    <button
                        type="button"
                        onClick={() => setShowJump((prev) => !prev)}
                        className="inline-flex items-center rounded-full bg-brand-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-brand-primary-dark"
                        aria-expanded={showJump}
                    >
                        <span className="mr-1">Jump Months</span>
                        <span
                            className={`transition-transform ${showJump ? 'rotate-90' : ''
                                }`}
                        >
                            ›
                        </span>
                    </button>

                    {showJump && (
                        <div className="space-y-2 rounded-2xl bg-brand-bg px-3 py-3">
                            <div className="flex flex-wrap gap-1">
                                {monthLabels.map((label, index) => {
                                    const month = index + 1;
                                    const isActive = month === currentMonth;

                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() =>
                                                goToMonth(month, currentYear)
                                            }
                                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${isActive
                                                ? 'bg-brand-primary text-white'
                                                : 'bg-brand-primary-soft text-brand-primary hover:bg-brand-primary/10'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {jumpYears.map((year) => {
                                    const isActive = year === currentYear;

                                    return (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() =>
                                                goToMonth(currentMonth, year)
                                            }
                                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${isActive
                                                ? 'bg-brand-primary text-white'
                                                : 'bg-brand-primary-soft text-brand-primary hover:bg-brand-primary/10'
                                                }`}
                                        >
                                            {year}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


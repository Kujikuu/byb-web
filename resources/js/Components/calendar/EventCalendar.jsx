import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPin, MagnifyingGlass } from 'phosphor-react';
import CalendarHeader from './CalendarHeader';
import FilterBar from './FilterBar';
import EventDetailCard from './EventDetailCard';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthGrid(month, year, events) {
    const firstOfMonth = new Date(year, month - 1, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = 0; i < startWeekday; i++) {
        const date = new Date(year, month - 1, 1 - (startWeekday - i));
        days.push({ date, isCurrentMonth: false, events: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        days.push({ date, isCurrentMonth: true, events: [] });
    }

    while (days.length < 35) {
        const last = days[days.length - 1].date;
        const date = new Date(
            last.getFullYear(),
            last.getMonth(),
            last.getDate() + 1,
        );
        days.push({ date, isCurrentMonth: false, events: [] });
    }

    const byDayKey = (date) =>
        date.toISOString().slice(0, 10);

    const eventInstances = events.map((event) => {
        const start = event.startDateTime
            ? new Date(event.startDateTime)
            : null;
        const end = event.endDateTime
            ? new Date(event.endDateTime)
            : start;

        if (!start || !end) return null;

        const instances = [];
        const cursor = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate(),
        );
        const endDate = new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
        );

        while (cursor <= endDate) {
            instances.push({
                dateKey: byDayKey(cursor),
                event,
            });
            cursor.setDate(cursor.getDate() + 1);
        }

        return instances;
    });

    const flatInstances = eventInstances
        .filter(Boolean)
        .flat();

    const eventsByDay = flatInstances.reduce((acc, inst) => {
        acc[inst.dateKey] = acc[inst.dateKey] || [];
        acc[inst.dateKey].push(inst.event);
        return acc;
    }, {});

    return days.map((day) => {
        const key = byDayKey(day.date);
        return {
            ...day,
            events: eventsByDay[key] || [],
        };
    });
}

export default function EventCalendar({
    initialMonth,
    initialYear,
    events,
    filters,
    initialSearch = '',
    showJumpMonths = true,
}) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [hoveredEventId, setHoveredEventId] = useState(null);
    const [search, setSearch] = useState(initialSearch ?? '');
    const [isFirstRender, setIsFirstRender] = useState(true);

    // Keep local search state in sync if the server sends a new value
    useEffect(() => {
        setSearch(initialSearch ?? '');
    }, [initialSearch]);

    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    // Debounced search that updates only the `search` param and preserves other query params
    useEffect(() => {
        if (isFirstRender) return;

        const handle = setTimeout(() => {
            const searchParams = new URLSearchParams(
                window.location.search ?? '',
            );

            if (search && search.trim().length > 0) {
                searchParams.set('search', search.trim());
            } else {
                searchParams.delete('search');
            }

            const data = Object.fromEntries(searchParams.entries());

            router.get(route('calendar.index'), data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: [
                    'events',
                    'filters',
                    'meta',
                    'initialMonth',
                    'initialYear',
                ],
            });
        }, 400);

        return () => clearTimeout(handle);
    }, [search, isFirstRender]);

    const grid = useMemo(
        () => buildMonthGrid(initialMonth, initialYear, events),
        [initialMonth, initialYear, events],
    );

    const todayKey = new Date().toISOString().slice(0, 10);

    const renderDayCell = (day, index) => {
        const dateKey = day.date.toISOString().slice(0, 10);
        const isToday = dateKey === todayKey;
        const maxVisible = 3;
        const visibleEvents = day.events.slice(0, maxVisible);
        const extraCount = day.events.length - visibleEvents.length;

        return (
            <div
                key={dateKey + index}
                className={`relative flex flex-col border border-brand-border/60 bg-brand-surface p-1.5 text-xs ${day.isCurrentMonth
                    ? ''
                    : 'bg-brand-bg text-brand-muted'
                    }`}
            >
                <div className="mb-1 flex items-center justify-between">
                    <div
                        className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${isToday
                            ? 'bg-brand-primary text-white'
                            : 'text-slate-600'
                            }`}
                    >
                        {day.date.getDate()}
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                    {visibleEvents.map((event) => (
                        <button
                            key={event.id + dateKey}
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className="inline-flex w-full items-center rounded-full bg-brand-primary-soft px-2 py-0.5 text-left text-[11px] font-medium text-brand-primary hover:bg-brand-primary/10"
                        >
                            <span className="mr-1 h-2 w-1 rounded-full bg-brand-primary" />
                            <span className="truncate">
                                {event.title}
                            </span>
                        </button>
                    ))}
                    {extraCount > 0 && (
                        <div className="mt-0.5 text-[11px] font-medium text-brand-muted">
                            +{extraCount} more
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMonthView = () => (
        <div className="flex flex-col">
            <div className="grid grid-cols-7 border-b border-brand-border/60 bg-brand-bg text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                {weekdayLabels.map((label) => (
                    <div
                        key={label}
                        className="px-2 py-2 text-center"
                    >
                        {label}
                    </div>
                ))}
            </div>
            <div className="grid min-h-[420px] grid-cols-7 bg-brand-bg">
                {grid.map((day, idx) => renderDayCell(day, idx))}
            </div>
        </div>
    );

    const renderListView = () => {
        // De-duplicate events by ID and only show them once
        const uniqueEventsMap = new Map();
        events.forEach((event) => {
            if (!event || !event.startDateTime) return;
            if (!uniqueEventsMap.has(event.id)) {
                uniqueEventsMap.set(event.id, event);
            }
        });

        const listEvents = Array.from(uniqueEventsMap.values())
            .map((event) => {
                const start = new Date(event.startDateTime);
                const end = event.endDateTime
                    ? new Date(event.endDateTime)
                    : null;

                return { event, start, end };
            })
            .filter(({ start }) => {
                if (!start) return false;

                // Only show events whose start date is in the current visible month
                return (
                    start.getMonth() === initialMonth - 1 &&
                    start.getFullYear() === initialYear
                );
            })
            .sort((a, b) => a.start - b.start);

        if (!listEvents.length) {
            return (
                <div className="p-6 text-sm text-brand-muted">
                    No events found for this month.
                </div>
            );
        }

        return (
            <div className="divide-y divide-brand-border">
                {listEvents.map(({ event, start, end }) => {
                    const startDay = start.getDate();
                    const endDay = end ? end.getDate() : null;
                    const monthLabel = start
                        .toLocaleDateString(undefined, {
                            month: 'short',
                        })
                        .toUpperCase();

                    return (
                        <motion.button
                            key={event.id}
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className="flex w-full items-stretch gap-4 px-4 py-4 text-left sm:px-6"
                            transition={{
                                duration: 0.18,
                                ease: [0.22, 0.61, 0.36, 1],
                            }}
                            onHoverStart={() => setHoveredEventId(event.id)}
                            onHoverEnd={() => setHoveredEventId(null)}
                        >
                            {/* Date block */}
                            <div className="flex w-28 flex-shrink-0 items-center">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        backgroundColor:
                                            event.industryColor ||
                                            event.industry?.color ||
                                            'var(--color-brand-primary)',
                                    }}
                                    animate={{
                                        width:
                                            hoveredEventId === event.id
                                                ? 8
                                                : 4,
                                    }}
                                    transition={{
                                        duration: 0.18,
                                        ease: [0.22, 0.61, 0.36, 1],
                                    }}
                                />
                                <div className="ml-3 flex flex-col items-center justify-center text-slate-900">
                                    <div className="flex items-baseline text-xl font-bold leading-none sm:text-2xl">
                                        <span>{startDay}</span>
                                        {endDay !== null &&
                                            endDay !== startDay && (
                                                <>
                                                    <span className="mx-0.5 text-sm font-semibold">
                                                        –
                                                    </span>
                                                    <span>{endDay}</span>
                                                </>
                                            )}
                                    </div>
                                    <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                                        {monthLabel}
                                    </div>
                                </div>
                            </div>

                            {/* Content block */}
                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 sm:text-base">
                                        {event.title}
                                    </h3>
                                    {event.type && (
                                        <span className="tag-pill">
                                            {event.type.name}
                                        </span>
                                    )}
                                </div>

                                {(event.industry || event.tags?.length > 0) && (
                                    <div className="mt-1 text-[11px] text-brand-muted">
                                        <span className="font-semibold">
                                            Industry
                                        </span>{' '}
                                        <span className="text-slate-700">
                                            {event.industry?.name}
                                            {event.tags?.length > 0 && (
                                                <>
                                                    {event.industry?.name
                                                        ? ', '
                                                        : ''}
                                                    {event.tags
                                                        .map(
                                                            (t) =>
                                                                t.name ??
                                                                t.slug,
                                                        )
                                                        .join(', ')}
                                                </>
                                            )}
                                        </span>
                                    </div>
                                )}

                                {event.venue && (
                                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                                        <MapPin className="h-3.5 w-3.5 text-brand-muted" />
                                        <span>
                                            {event.venue.name}
                                            {event.country?.name && (
                                                <>
                                                    {', '}
                                                    {event.country.name}
                                                </>
                                            )}
                                        </span>
                                    </div>
                                )}

                                {event.organizer && (
                                    <div className="mt-1 text-[11px] text-brand-muted">
                                        <span className="font-semibold">
                                            Event Organized By
                                        </span>{' '}
                                        <span className="text-slate-700">
                                            {event.organizer.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="relative overflow-hidden card-surface bg-brand-bg">
            <CalendarHeader
                currentMonth={initialMonth}
                currentYear={initialYear}
                showJumpMonths={showJumpMonths}
            />
            <FilterBar />
            <div className="border-b border-brand-border bg-gradient-to-r from-brand-bg to-brand-bg px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs font-medium uppercase tracking-[0.16em] text-brand-muted sm:hidden">
                        Search & filters
                    </div>
                    <div className="flex w-full">
                        <div className="relative w-full">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-brand-muted">
                                <MagnifyingGlass className="h-4 w-4" weight="bold" />
                            </span>
                            <input
                                type="search"
                                placeholder="Search events by title, industry, tag..."
                                className="w-full rounded-full border border-brand-border bg-brand-surface py-3 pl-9 pr-3 text-xs text-slate-700 outline-none ring-0 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-b from-brand-bg to-brand-bg">
                {renderListView()}
            </div>
            <EventDetailCard
                event={
                    selectedEvent && {
                        ...selectedEvent,
                        onSelectRelated: (related) =>
                            setSelectedEvent(related),
                    }
                }
                onClose={() => setSelectedEvent(null)}
            />
        </div>
    );
}


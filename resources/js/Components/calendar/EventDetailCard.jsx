import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Clock,
    LinkSimple,
    ListBullets,
    MapPin,
    UserCircle,
    EnvelopeSimple,
    CalendarPlus,
    GoogleLogo,
    Bed,
} from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function EventDetailCard({ event, onClose }) {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [showOrganizerDetails, setShowOrganizerDetails] = useState(false);

    const truncate = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trimEnd() + '…';
    };

    // Prevent background scrolling while the event details modal is open
    useEffect(() => {
        if (!event) {
            return;
        }

        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previous;
        };
    }, [event]);

    if (!event) return null;

    const start = event.startDateTime
        ? new Date(event.startDateTime)
        : null;
    const end = event.endDateTime ? new Date(event.endDateTime) : null;

    const startDay = start ? start.getDate() : null;
    const endDay = end ? end.getDate() : null;
    const monthLabel = start
        ? start.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' }).toUpperCase()
        : null;

    const formatDate = (date) =>
        date?.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const formatTime = (date) =>
        date?.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

    const heroImage =
        Array.isArray(event.images) && event.images.length > 0
            ? event.images[0]
            : null;

    const formatStay22Date = (value) => {
        if (!value) return null;

        // If the backend sends an ISO string like "2025-12-23T09:00:00Z"
        // or "2025-12-23 09:00:00", Stay22 only needs the date part.
        if (typeof value === 'string') {
            const datePart = value.slice(0, 10);
            // Basic YYYY-MM-DD validation
            if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
                return datePart;
            }
        }

        // Fallback: try to parse as Date and format to YYYY-MM-DD
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return null;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            '0',
        )}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const buildStay22Src = () => {
        if (!event?.isAccommodationAvailable) return null;

        const aid =
            (typeof import.meta !== 'undefined' &&
                (import.meta.env.VITE_STAY22_AID ||
                    import.meta.env.VITE_STAY22_AFFILIATE_ID)) ||
            '';

        const checkin = formatStay22Date(event.startDateTime);
        const checkout =
            formatStay22Date(event.endDateTime) ||
            (checkin
                ? formatStay22Date(
                    new Date(
                        new Date(event.startDateTime).getTime() +
                        24 * 60 * 60 * 1000,
                    ),
                )
                : null);

        const params = new URLSearchParams();

        if (aid) params.set('aid', aid);

        // Explicit check-in/check-out dates for Stay22
        if (checkin) {
            params.set('checkin', checkin);
        }
        if (checkout) {
            params.set('checkout', checkout);
        }

        if (event.venue?.latitude && event.venue?.longitude) {
            params.set('lat', String(event.venue.latitude));
            params.set('lng', String(event.venue.longitude));
        }

        if (event.venue?.name) {
            params.set('venue', event.venue.name);
        }

        params.set('hidebrandlogo', 'true');

        return `https://www.stay22.com/embed/gm?${params.toString()}`;
    };

    const toUtcString = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(
            2,
            '0',
        )}${String(d.getUTCDate()).padStart(2, '0')}T${String(
            d.getUTCHours(),
        ).padStart(2, '0')}${String(d.getUTCMinutes()).padStart(
            2,
            '0',
        )}${String(d.getUTCSeconds()).padStart(2, '0')}Z`;
    };

    const buildGoogleCalendarUrl = () => {
        if (!event?.startDateTime) return '#';

        const startUtc = toUtcString(event.startDateTime);
        const endUtc = toUtcString(event.endDateTime || event.startDateTime);

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title || 'Event',
            details:
                (event.description
                    ? truncate(
                        event.description.replace(/<[^>]+>/g, ''),
                        400,
                    ) + '\n\n'
                    : '') +
                (event.externalLink ? `More info: ${event.externalLink}` : ''),
            location:
                event.venue?.name && event.country?.name
                    ? `${event.venue.name}, ${event.country.name}`
                    : event.venue?.name || '',
            dates: `${startUtc}/${endUtc}`,
        });

        return `https://www.google.com/calendar/render?${params.toString()}`;
    };

    const downloadIcs = () => {
        if (!event?.startDateTime) return;

        const startUtc = toUtcString(event.startDateTime);
        const endUtc = toUtcString(event.endDateTime || event.startDateTime);

        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//BYB Events//Calendar//EN',
            'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            `UID:${event.id || Date.now()}@byb.events`,
            startUtc ? `DTSTART:${startUtc}` : null,
            endUtc ? `DTEND:${endUtc}` : null,
            `SUMMARY:${(event.title || '').replace(/\n/g, ' ')}`,
            event.description
                ? `DESCRIPTION:${truncate(
                    event.description.replace(/<[^>]+>/g, ''),
                    800,
                ).replace(/\n/g, ' ')}`
                : null,
            event.venue?.name
                ? `LOCATION:${event.venue.name}${event.country?.name ? `, ${event.country.name}` : ''
                }`
                : null,
            event.externalLink ? `URL:${event.externalLink}` : null,
            'END:VEVENT',
            'END:VCALENDAR',
        ].filter(Boolean);

        const blob = new Blob([lines.join('\r\n')], {
            type: 'text/calendar;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(event.title || 'event')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-2 py-6 sm:px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-brand-bg shadow-2xl"
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-brand-border bg-brand-surface px-6 py-4 sm:px-8">
                        <div className="flex min-w-0 items-start gap-4">
                            {/* Date block */}
                            <div className="flex items-center">
                                <div className="h-full w-1 rounded-full bg-brand-primary" />
                                <div className="ms-3 flex flex-col items-center justify-center text-slate-900">
                                    <div className="flex items-baseline text-xl font-black leading-none sm:text-2xl">
                                        {startDay !== null && (
                                            <span>{startDay}</span>
                                        )}
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
                                    <div className="mt-0.5 text-[10px] uppercase tracking-wide text-brand-muted">
                                        {start &&
                                            start.getFullYear() ===
                                            end?.getFullYear() &&
                                            start.getFullYear()}
                                    </div>
                                </div>
                            </div>

                            {/* Title + meta */}
                            <div className="space-y-1 min-w-0">
                                <h2
                                    className="text-2xl font-bold uppercase tracking-tight text-slate-900 sm:text-xl"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {event.title}
                                </h2>
                                <div className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">
                                    <span>{event.type?.name ?? t('common.type')}</span>
                                </div>

                                {(event.industry || event.tags?.length > 0) && (
                                    <div className="text-[11px] text-brand-muted">
                                        <span className="font-semibold">
                                            {t('common.industry')}
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
                                                                t.name ?? t.slug,
                                                        )
                                                        .join(', ')}
                                                </>
                                            )}
                                        </span>
                                    </div>
                                )}

                                {event.venue && (
                                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                                        <MapPin
                                            className="h-3.5 w-3.5 text-slate-400"
                                            weight="fill"
                                        />
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
                                    <div className="text-[11px] text-slate-500">
                                        <span className="font-semibold">
                                            {t('common.eventOrganizedBy')}
                                        </span>{' '}
                                        <span className="text-slate-700">
                                            {event.organizer.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="ms-4 flex-shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-4 overflow-y-auto px-4 pb-5 pt-3 text-sm text-slate-700 sm:px-6">
                        {/* Hero image */}
                        {heroImage && (
                            <div className="overflow-hidden rounded-2xl bg-slate-200">
                                <img
                                    src={heroImage.url ?? heroImage}
                                    alt={heroImage.alt ?? event.title}
                                    className="h-64 w-full object-cover object-top sm:h-80"
                                />
                            </div>
                        )}

                        {/* Event details text */}
                        {event.description && (
                            <div className="rounded-2xl bg-brand-surface px-4 py-3 ring-1 ring-brand-border/70">
                                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                    <ListBullets
                                        className="h-4 w-4 text-slate-400"
                                        weight="fill"
                                    />
                                    <span>{t('common.eventDetails')}</span>
                                </div>
                                <div
                                    className="prose prose-sm mt-1 max-w-none text-slate-800 prose-headings:text-slate-900 prose-a:text-brand-primary hover:prose-a:text-brand-primary-dark prose-strong:text-slate-900 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-brand-muted"
                                    dangerouslySetInnerHTML={{
                                        __html: event.description,
                                    }}
                                />
                            </div>
                        )}

                        {/* Time & Location row */}
                        {(start || end || event.venue) && (
                            <div className="grid gap-3 rounded-2xl bg-white p-4 text-sm text-slate-800 ring-1 ring-slate-100 sm:grid-cols-2">
                                <div>
                                    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                        <Clock
                                            className="h-4 w-4 text-slate-400"
                                            weight="fill"
                                        />
                                        <span>{t('common.time')}</span>
                                    </div>
                                    <div className="mt-1 text-sm text-slate-800">
                                        {start && (
                                            <span>
                                                {formatDate(start)}{' '}
                                                {formatTime(start)}
                                            </span>
                                        )}
                                        {end && (
                                            <>
                                                {' '}
                                                –{' '}
                                                <span>
                                                    {formatDate(end)}{' '}
                                                    {formatTime(end)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {event.venue && (
                                    <div>
                                        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            <MapPin
                                                className="h-4 w-4 text-slate-400"
                                                weight="fill"
                                            />
                                            <span>{t('common.location')}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-slate-800">
                                            {event.venue.name}
                                            {event.country?.name && (
                                                <>
                                                    {', '}
                                                    {event.country.name}
                                                </>
                                            )}
                                        </div>
                                        {event.googleMapsUrl && (
                                            <a
                                                href={event.googleMapsUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 inline-flex text-xs font-semibold text-brand-primary hover:text-brand-primary-dark"
                                            >
                                                {t('common.viewOnGoogleMaps')}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Accommodation (Stay22) */}
                        {event.isAccommodationAvailable && (
                            <div className="rounded-2xl bg-brand-surface px-4 py-3 ring-1 ring-brand-border/70">
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <Bed
                                            className="h-4 w-4 text-brand-muted"
                                            weight="fill"
                                        />
                                        <span>{t('common.nearbyStays')}</span>
                                    </div>
                                </div>
                                <div className="mt-2 overflow-hidden rounded-2xl border border-brand-border bg-brand-bg">
                                    <iframe
                                        title="Nearby accommodations"
                                        src={buildStay22Src() || 'about:blank'}
                                        width="100%"
                                        height="380"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="block"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Organizer block */}
                        {event.organizer && (
                            <section
                                className="rounded-2xl bg-brand-surface px-4 py-3 ring-1 ring-brand-border/70"
                                aria-label="Event organizer"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                    {/* Organizer image / avatar */}
                                    {event.organizer.image ||
                                        event.organizer.logo_url ||
                                        event.organizer.logo ? (
                                        <div className="mb-1 h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-brand-bg sm:mb-0">
                                            <img
                                                src={
                                                    event.organizer.image ??
                                                    event.organizer.logo_url ??
                                                    event.organizer.logo
                                                }
                                                alt={event.organizer.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-bg sm:mb-0">
                                            <UserCircle
                                                className="h-7 w-7 text-brand-muted"
                                                weight="fill"
                                            />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                                                {t('common.organizer')}
                                            </div>
                                            <div className="mt-0.5 text-sm font-semibold text-slate-900">
                                                {event.organizer.name}
                                            </div>
                                        </div>

                                        {event.organizer.description && (
                                            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-700">
                                                {truncate(
                                                    event.organizer.description,
                                                    180,
                                                )}
                                            </p>
                                        )}

                                        {(event.organizer.website_url ||
                                            event.organizer.email ||
                                            event.organizer.phone) && (
                                                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                                                    {event.organizer.website_url && (
                                                        <a
                                                            href={
                                                                event.organizer
                                                                    .website_url
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center rounded-button bg-brand-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-brand-primary-dark hover:text-white"
                                                        >
                                                            <LinkSimple className="me-1.5 h-3 w-3" weight="fill" />
                                                            {t('common.website')}
                                                        </a>
                                                    )}
                                                    {event.organizer.email && (
                                                        <a
                                                            href={`mailto:${event.organizer.email}`}
                                                            className="inline-flex items-center rounded-button border border-brand-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-brand-primary-soft"
                                                        >
                                                            <EnvelopeSimple className="me-1.5 h-3.5 w-3.5 text-brand-muted" weight="fill" />
                                                            <span className="max-w-[180px] truncate sm:max-w-xs">
                                                                {event.organizer.email}
                                                            </span>
                                                        </a>
                                                    )}
                                                    {event.organizer.phone && (
                                                        <a
                                                            href={`tel:${event.organizer.phone}`}
                                                            className="inline-flex items-center rounded-button border border-brand-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-brand-primary-soft"
                                                        >
                                                            <span className="truncate">
                                                                {t('common.phone')}: {event.organizer.phone}
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Tags */}
                        {event.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {event.tags.map((tag) => (
                                    <span
                                        key={tag.id ?? tag.slug}
                                        className="tag-pill"
                                    >
                                        #{tag.name ?? tag.slug}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Related events */}
                        {event.relatedEvents &&
                            event.relatedEvents.length > 0 && (
                                <div className="mt-2 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {t('common.relatedEvents')}
                                        </div>
                                        {event.relatedEvents.length > 3 && (
                                            <div className="text-[11px] text-slate-400">
                                                {t('common.showing')} 3 {t('common.of')} {event.relatedEvents.length}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-3">
                                        {event.relatedEvents.slice(0, 3).map((related) => {
                                            const relatedStart = related.startDateTime
                                                ? new Date(related.startDateTime)
                                                : null;

                                            const relatedHero =
                                                Array.isArray(related.images) &&
                                                    related.images.length > 0
                                                    ? related.images[0]
                                                    : null;

                                            const relatedHeroUrl =
                                                (relatedHero &&
                                                    (relatedHero.url ?? relatedHero)) ||
                                                `https://placehold.co/600x400?text=Image+Not+Available`;

                                            return (
                                                <button
                                                    key={related.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (typeof event.onSelectRelated === 'function') {
                                                            event.onSelectRelated(related);
                                                        }
                                                    }}
                                                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 text-start text-xs text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50"
                                                >
                                                    {relatedHeroUrl && (
                                                        <div className="h-20 w-full flex-shrink-0 overflow-hidden bg-slate-200">
                                                            <img
                                                                src={relatedHeroUrl}
                                                                alt={related.title}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex min-w-0 flex-1 flex-col px-2.5 py-2">
                                                        <div className="mb-1 flex items-start justify-between gap-2">
                                                            <span className="line-clamp-2 font-semibold text-slate-900">
                                                                {related.title}
                                                            </span>
                                                            {related.type && (
                                                                <span className="whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                                                                    {related.type.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {relatedStart && (
                                                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                                <span className="truncate">
                                                                    {relatedStart.toLocaleDateString(
                                                                        language === 'ar' ? 'ar-SA' : 'en-US',
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                        },
                                                                    )}{' '}
                                                                    {relatedStart.toLocaleTimeString(
                                                                        language === 'ar' ? 'ar-SA' : 'en-US',
                                                                        {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {related.venue && (
                                                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                                <span className="truncate">
                                                                    {related.venue.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        {/* Actions: external link + calendar buttons */}
                        {(event.externalLink ||
                            event.startDateTime) && (
                                <div className="flex flex-col gap-2 border-t border-brand-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
                                    {event.externalLink && (
                                        <a
                                            href={event.externalLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-primary px-4 py-1.5 text-xs"
                                        >
                                            <LinkSimple
                                                className="me-1.5 h-4 w-4"
                                                weight="fill"
                                            />
                                            <span>{t('common.learnMore')}</span>
                                        </a>
                                    )}

                                    {event.startDateTime && (
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={downloadIcs}
                                                className="inline-flex items-center justify-center rounded-button border border-brand-border bg-brand-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700 hover:bg-brand-primary-soft"
                                            >
                                                <CalendarPlus className="me-1.5 h-4 w-4 text-brand-muted" weight="fill" />
                                                {t('common.addToCalendar')}
                                            </button>
                                            <a
                                                href={buildGoogleCalendarUrl()}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn-outline px-3 py-1.5 text-[11px]"
                                            >
                                                <GoogleLogo className="me-1.5 h-4 w-4" weight="fill" />
                                                {t('common.addToGoogleCalendar')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Organizer detail popup */}
                    <AnimatePresence>
                        {showOrganizerDetails && event.organizer && (
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="w-full max-w-lg rounded-3xl bg-brand-surface shadow-xl ring-1 ring-brand-border"
                                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 18, scale: 0.96 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: [0.22, 0.61, 0.36, 1],
                                    }}
                                >
                                    <div className="flex items-start justify-between border-b border-brand-border px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <UserCircle
                                                className="h-8 w-8 text-brand-muted"
                                                weight="fill"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                                    {t('common.organizer')}
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-slate-900">
                                                    {event.organizer.name}
                                                </div>
                                                {event.organizer.website_url && (
                                                    <a
                                                        href={
                                                            event.organizer
                                                                .website_url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-0.5 inline-flex text-xs font-semibold text-brand-primary hover:text-brand-primary-dark"
                                                    >
                                                        {t('common.visitWebsite')}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowOrganizerDetails(false)
                                            }
                                            className="ms-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg text-brand-muted hover:bg-brand-primary-soft"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-4 px-5 py-4 text-sm text-slate-700">
                                        {event.organizer.description && (
                                            <p className="leading-relaxed">
                                                {event.organizer.description}
                                            </p>
                                        )}
                                        {(event.organizer.email ||
                                            event.organizer.phone ||
                                            event.organizer.address) && (
                                                <div className="space-y-1 text-sm text-slate-700">
                                                    {event.organizer.email && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-semibold">
                                                                {t('common.email')}:
                                                            </span>
                                                            <a
                                                                href={`mailto:${event.organizer.email}`}
                                                                className="inline-flex items-center text-brand-primary hover:text-brand-primary-dark"
                                                            >
                                                                <EnvelopeSimple className="me-1 h-3.5 w-3.5" weight="fill" />
                                                                <span>{event.organizer.email}</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                    {event.organizer.phone && (
                                                        <div>
                                                            <span className="font-semibold">
                                                                {t('common.phone')}:
                                                            </span>{' '}
                                                            {event.organizer.phone}
                                                        </div>
                                                    )}
                                                    {event.organizer.address && (
                                                        <div>
                                                            <span className="font-semibold">
                                                                {t('common.address')}:
                                                            </span>{' '}
                                                            {event.organizer.address}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}


import { formatStay22Date, toUtcString } from './dateUtils';

/**
 * Calendar integration utilities
 */

export const buildStay22Src = (event) => {
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

export const buildGoogleCalendarUrl = (event, truncate) => {
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

export const downloadIcs = (event, truncate) => {
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

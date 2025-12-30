/**
 * Date formatting utilities
 */

export const formatDate = (date, language = 'en') => {
    if (!date) return null;
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatTime = (date, language = 'en') => {
    if (!date) return null;
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatStay22Date = (value) => {
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

export const toUtcString = (date) => {
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

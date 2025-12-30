import { useMemo } from 'react';

/**
 * Hook to process and memoize event data
 */
export const useEventData = (event, language) => {
    return useMemo(() => {
        if (!event) {
            return {
                start: null,
                end: null,
                startDay: null,
                endDay: null,
                monthLabel: null,
                heroImage: null,
            };
        }

        const startDate = event.startDateTime
            ? new Date(event.startDateTime)
            : null;
        const endDate = event.endDateTime ? new Date(event.endDateTime) : null;

        return {
            start: startDate,
            end: endDate,
            startDay: startDate ? startDate.getDate() : null,
            endDay: endDate ? endDate.getDate() : null,
            monthLabel: startDate
                ? startDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' }).toUpperCase()
                : null,
            heroImage:
                Array.isArray(event.images) && event.images.length > 0
                    ? event.images[0]
                    : null,
        };
    }, [event, language]);
};

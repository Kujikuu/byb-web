/**
 * String manipulation utilities
 */

export const truncate = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
};

import { useEffect } from 'react';

/**
 * Hook to prevent background scrolling when modal is open
 */
export const useScrollLock = (isLocked) => {
    useEffect(() => {
        if (!isLocked) {
            return;
        }

        // Save current scroll position and styles
        const scrollY = window.scrollY;
        const previousOverflow = document.body.style.overflow;
        const previousPosition = document.body.style.position;
        const previousTop = document.body.style.top;
        const previousWidth = document.body.style.width;

        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            // Restore previous styles
            document.body.style.overflow = previousOverflow;
            document.body.style.position = previousPosition;
            document.body.style.top = previousTop;
            document.body.style.width = previousWidth;
            // Restore scroll position
            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
};

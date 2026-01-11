import { useState, useEffect, useRef } from 'react';

/**
 * Parse numeric value from formatted string (e.g., "500+", "98%", "10+")
 */
const parseNumber = (value) => {
    if (typeof value === 'number') {
        return value;
    }
    const match = String(value).match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
};

/**
 * Extract suffix from formatted string (e.g., "+", "%")
 */
const getSuffix = (value) => {
    if (typeof value === 'number') {
        return '';
    }
    return String(value).replace(/\d+(?:\.\d+)?/, '');
};

/**
 * Ease-out cubic function for smooth animation deceleration
 */
const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
};

/**
 * Custom hook for animated counting numbers
 * @param {string|number} target - Target value to count to (e.g., "500+", "98%", 100)
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 * @param {boolean} startOnView - Whether to start animation when element enters viewport (default: true)
 * @returns {[string, React.RefObject]} - [formatted display value, ref for intersection observer]
 */
export const useCountUp = (target, duration = 2000, startOnView = true) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);

    const targetNumber = parseNumber(target);
    const suffix = getSuffix(target);

    useEffect(() => {
        if (!startOnView) {
            setHasStarted(true);
            return;
        }

        if (hasStarted) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setHasStarted(true);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
            observer.disconnect();
        };
    }, [startOnView, hasStarted]);

    useEffect(() => {
        if (!hasStarted || targetNumber === 0) {
            return;
        }

        // Reset count and start time when animation begins
        setCount(0);
        startTimeRef.current = null;

        const animate = (currentTime) => {
            if (!startTimeRef.current) {
                startTimeRef.current = currentTime;
            }

            const elapsed = currentTime - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const currentCount = Math.floor(easedProgress * targetNumber);

            setCount(currentCount);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setCount(targetNumber);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [hasStarted, targetNumber, duration]);

    const formattedValue = `${count}${suffix}`;

    return [formattedValue, elementRef];
};

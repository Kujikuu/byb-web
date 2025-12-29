/**
 * Main Application Entry Point
 * 
 * This file initializes the Inertia.js React application and sets up
 * smooth scrolling with Lenis integrated with Framer Motion.
 * 
 * Key integrations:
 * - Lenis: Provides smooth scrolling functionality
 * - Framer Motion: Handles animations and page transitions
 * - Inertia.js: Manages SPA navigation without full page reloads
 */

import '../css/app.css';
import './bootstrap';
import './i18n';

// Import Lenis CSS for proper smooth scroll behavior
// This ensures correct height calculations and smooth scrolling
import 'lenis/dist/lenis.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './Contexts/LanguageContext';

// Import Lenis React components and hooks
// ReactLenis: Wrapper component that initializes Lenis smooth scroll
// useLenis: Hook to access Lenis instance in components
import { ReactLenis } from 'lenis/react';

// Import Framer Motion frame utilities
// frame: Framer Motion's animation frame system
// cancelFrame: Cleanup function to remove frame callbacks
// This allows Lenis to run on the same animation loop as Framer Motion
import { cancelFrame, frame } from 'framer-motion';

// React hooks for managing component lifecycle
import { useEffect, useRef } from 'react';

// Import Inertia router to handle page transitions
// We'll use this to scroll to top when navigating between pages
import { router } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * LenisProvider Component
 * 
 * Wraps the application with Lenis smooth scroll functionality.
 * Integrates Lenis with Framer Motion's animation frame system for optimal performance.
 * 
 * Why this approach?
 * - By using Framer Motion's frame system, both libraries run on the same
 *   animation loop, preventing sync issues and ensuring smooth performance
 * - Setting autoRaf: false disables Lenis's internal RAF loop, allowing
 *   Framer Motion to control the timing
 * - The lenisRef gives us access to the Lenis instance for programmatic control
 */
function LenisProvider({ children }) {
    // Create a ref to access the Lenis instance
    // This ref will be populated by ReactLenis component
    const lenisRef = useRef(null);

    /**
     * useEffect Hook: Frame Integration
     * 
     * Sets up the integration between Lenis and Framer Motion's frame system.
     * 
     * How it works:
     * 1. Define an update function that receives frame data (including timestamp)
     * 2. Call lenis.raf(time) to update Lenis scroll position on each frame
     * 3. Register the update function with Framer Motion's frame system
     * 4. Clean up by canceling the frame callback on unmount
     * 
     * Why frame.update(update, true)?
     * - The second parameter (true) means "immediate" - run on the next frame
     * - This ensures Lenis updates are synchronized with Framer Motion animations
     */
    useEffect(() => {
        /**
         * Update function called on every animation frame
         * @param {Object} data - Frame data from Framer Motion
         * @param {number} data.timestamp - Current frame timestamp in milliseconds
         */
        function update(data) {
            const time = data.timestamp;
            // Call Lenis's RAF method with the timestamp
            // This updates Lenis's internal scroll calculations
            // The optional chaining (?.) safely handles cases where lenis isn't ready yet
            lenisRef.current?.lenis?.raf(time);
        }

        // Register the update function with Framer Motion's frame system
        // This ensures Lenis runs on the same animation loop as Framer Motion
        frame.update(update, true);

        // Cleanup: Remove the frame callback when component unmounts
        // This prevents memory leaks and ensures proper cleanup
        return () => cancelFrame(update);
    }, []);

    /**
     * useEffect Hook: Inertia Page Transitions
     * 
     * Handles scrolling to top when navigating between pages in Inertia.js.
     * 
     * Why scroll to top on page change?
     * - When users navigate to a new page, they expect to start at the top
     * - This provides a better UX, especially on mobile devices
     * - Prevents confusion about scroll position when content changes
     * 
     * How it works:
     * 1. Listen to Inertia's 'navigate' event (fires when page changes)
     * 2. When navigation starts, scroll to top using Lenis's smooth scroll
     * 3. Clean up the event listener on unmount
     */
    useEffect(() => {
        /**
         * Handle Inertia navigation events
         * Scrolls to top when a new page is loaded
         */
        const handleNavigate = () => {
            // Scroll to top smoothly when navigating to a new page
            // Using Lenis's scrollTo method ensures smooth animation
            // The second parameter { immediate: false } ensures smooth scroll animation
            lenisRef.current?.lenis?.scrollTo(0, {
                immediate: false, // Use smooth scroll animation
            });
        };

        // Listen to Inertia's navigate event
        // This fires when a page navigation starts
        router.on('navigate', handleNavigate);

        // Cleanup: Remove event listener on unmount
        return () => {
            router.off('navigate', handleNavigate);
        };
    }, []);

    return (
        /**
         * ReactLenis Component
         * 
         * Props:
         * - root: Enables Lenis on the root element (entire page)
         * - options: Lenis configuration
         *   - autoRaf: false - Disable internal RAF loop (we use Framer Motion's instead)
         *   - smoothWheel: true - Enable smooth mouse wheel scrolling (default)
         *   - duration: 1.2 - Scroll animation duration in seconds
         * - ref: Reference to access Lenis instance programmatically
         */
        <ReactLenis
            root
            options={{
                autoRaf: false, // Use Framer Motion's frame system instead
                smoothWheel: true, // Enable smooth mouse wheel scrolling
                duration: 1.2, // Scroll animation duration
            }}
            ref={lenisRef}
        >
            {children}
        </ReactLenis>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        /**
         * Component Hierarchy:
         * 
         * LenisProvider (outermost)
         *   └─ Provides smooth scroll functionality
         *   └─ Integrates with Framer Motion's frame system
         * 
         * LanguageProvider
         *   └─ Provides i18n context for translations
         * 
         * App (Inertia component)
         *   └─ The actual page content
         * 
         * Why this order?
         * - LenisProvider must wrap everything to enable smooth scrolling on the entire app
         * - LanguageProvider needs to be inside LenisProvider to have access to scroll context
         * - App is the actual content that will be scrolled
         */
        root.render(
            <LenisProvider>
                <LanguageProvider>
                    <App {...props} />
                </LanguageProvider>
            </LenisProvider>
        );
    },
    progress: {
        color: '#0057ff',
    },
});

import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Rubik"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    primary: '#0057FF',
                    'primary-dark': '#003FCC',
                    'primary-soft': '#E5EEFF',
                    navy: '#020617',
                    bg: '#F5F7FB',
                    surface: '#FFFFFF',
                    border: '#E2E8F0',
                    muted: '#64748B',
                    accent: '#F97316',
                },
            },
            boxShadow: {
                card: '0 18px 45px rgba(15, 23, 42, 0.08)',
                elevated: '0 24px 60px rgba(15, 23, 42, 0.12)',
            },
            borderRadius: {
                card: '1.75rem',
                button: '9999px',
            },
        },
    },

    plugins: [forms],
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
    const stored = localStorage.getItem('app_language');
    if (stored && ['en', 'ar'].includes(stored)) {
        return stored;
    }
    
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'ar'].includes(browserLang)) {
        return browserLang;
    }
    
    return 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations,
            },
            ar: {
                translation: arTranslations,
            },
        },
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        react: {
            useSuspense: false,
        },
    });

// Sync i18next language with localStorage changes
window.addEventListener('storage', (e) => {
    if (e.key === 'app_language' && e.newValue && ['en', 'ar'].includes(e.newValue)) {
        i18n.changeLanguage(e.newValue);
    }
});

export default i18n;

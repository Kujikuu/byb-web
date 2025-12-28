import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'ar'];

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        // Try to get from localStorage first
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
            return stored;
        }
        
        // Try to detect from browser
        const browserLang = navigator.language.split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(browserLang)) {
            return browserLang;
        }
        
        return DEFAULT_LANGUAGE;
    });

    useEffect(() => {
        // Persist to localStorage whenever language changes
        localStorage.setItem(STORAGE_KEY, language);
        
        // Also set cookie for server-side access
        document.cookie = `app_language=${language}; path=/; max-age=31536000; SameSite=Lax`;
        
        // Update i18next language
        i18n.changeLanguage(language);
        
        // Update HTML dir attribute for RTL support
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
    }, [language]);


    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
    };

    const setLanguageDirect = (lang) => {
        if (SUPPORTED_LANGUAGES.includes(lang)) {
            setLanguage(lang);
        }
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage: setLanguageDirect,
                toggleLanguage,
                isRTL: language === 'ar',
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}

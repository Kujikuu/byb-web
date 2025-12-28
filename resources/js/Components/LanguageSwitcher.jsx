import { useLanguage } from '@/Contexts/LanguageContext';
import { router } from '@inertiajs/react';
import { Globe } from 'phosphor-react';

export default function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage();

    const handleLanguageChange = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        toggleLanguage();
        
        // Update localStorage immediately
        localStorage.setItem('app_language', newLang);
        
        // Reload the current page with the new locale
        const currentUrl = new URL(window.location.href);
        const currentParams = Object.fromEntries(currentUrl.searchParams.entries());
        
        // If we're on the calendar page, reload with locale
        if (route().current('calendar.index')) {
            router.get(route('calendar.index'), { 
                locale: newLang, 
                ...currentParams 
            }, {
                preserveState: false, // Don't preserve state to force fresh data
                preserveScroll: true,
                only: ['events', 'filters', 'meta', 'initialMonth', 'initialYear', 'locale'],
            });
        } else {
            // For other pages, reload with locale param
            router.reload({
                data: { locale: newLang },
                preserveState: false,
                preserveScroll: true,
            });
        }
    };

    return (
        <button
            onClick={handleLanguageChange}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-wide"
            aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
        >
            <Globe size={18} weight="bold" />
            <span>{language === 'en' ? 'AR' : 'EN'}</span>
        </button>
    );
}

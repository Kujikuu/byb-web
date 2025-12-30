import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import EventCalendar from '@/Components/calendar/EventCalendar';
import PageHeader from '@/Components/PageHeader';
import AnimatedSection from '@/Components/AnimatedSection';
import ErrorState from '@/Components/ErrorState';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/Contexts/LanguageContext';
import { useEffect } from 'react';

export default function Index({
    initialMonth,
    initialYear,
    events,
    filters,
    ui,
    locale,
    meta,
}) {
    const { t } = useTranslation();
    const { setLanguage } = useLanguage();

    // Sync locale from server with LanguageContext
    useEffect(() => {
        if (locale && ['en', 'ar'].includes(locale)) {
            setLanguage(locale);
            localStorage.setItem('app_language', locale);
        }
    }, [locale, setLanguage]);

    // Check for API errors
    const hasError = meta?.error === true;
    const errorMessage = meta?.message || t('calendar.errorLoadingEvents', 'Failed to load events. Please try again.');

    const handleRetry = () => {
        window.location.reload();
    };
    
    return (
        <PublicLayout>
            <Head title={t('calendar.title')} />

            <PageHeader
                title={t('calendar.pageTitle')}
                subtitle={t('calendar.subtitle')}
                description={t('calendar.description')}
            />

            <AnimatedSection className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasError ? (
                        <ErrorState
                            title={t('calendar.errorTitle', 'Error Loading Events')}
                            message={errorMessage}
                            onRetry={handleRetry}
                        />
                    ) : (
                        <EventCalendar
                            initialMonth={initialMonth}
                            initialYear={initialYear}
                            events={events || []}
                            filters={filters}
                            initialSearch={filters?.active?.search ?? ''}
                            showJumpMonths={ui?.showJumpMonths ?? true}
                        />
                    )}
                </div>
            </AnimatedSection>
        </PublicLayout>
    );
}

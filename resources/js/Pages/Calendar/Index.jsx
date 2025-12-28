import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import EventCalendar from '@/Components/calendar/EventCalendar';
import PageHeader from '@/Components/PageHeader';
import AnimatedSection from '@/Components/AnimatedSection';

export default function Index({
    initialMonth,
    initialYear,
    events,
    filters,
    ui,
}) {
    return (
        <PublicLayout>
            <Head title="Events Calendar" />

            <PageHeader
                title="Exhibitions Calendar"
                subtitle="Stay Informed"
                description="Discover and explore upcoming events across Saudi Arabia and Egypt. Filter by industry, country, or keyword to find what matters to you."
            />

            <AnimatedSection className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <EventCalendar
                        initialMonth={initialMonth}
                        initialYear={initialYear}
                        events={events}
                        filters={filters}
                        initialSearch={filters?.active?.search ?? ''}
                        showJumpMonths={ui?.showJumpMonths ?? true}
                    />
                </div>
            </AnimatedSection>
        </PublicLayout>
    );
}

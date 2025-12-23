import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import EventCalendar from '@/Components/calendar/EventCalendar';

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

            <div className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 space-y-4">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Stay Informed</h4>
                        <h1 className="text-5xl font-bold text-slate-900 tracking-tighter">Exhibitions Calendar</h1>
                        <p className="max-w-xl text-slate-500 font-medium text-sm leading-relaxed">Discover and explore upcoming events across Saudi Arabia and Egypt. Filter by industry, country, or keyword to find what matters to you.</p>
                    </div>

                    <EventCalendar
                        initialMonth={initialMonth}
                        initialYear={initialYear}
                        events={events}
                        filters={filters}
                        initialSearch={filters?.active?.search ?? ''}
                        showJumpMonths={ui?.showJumpMonths ?? true}
                    />
                </div>
            </div>
        </PublicLayout>
    );
}

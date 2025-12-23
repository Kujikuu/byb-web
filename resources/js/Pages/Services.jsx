import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MagnifyingGlass, Calendar, ChartPie } from 'phosphor-react';

export default function Services() {
    return (
        <PublicLayout>
            <Head title="Our Services - Build Your Booth" />

            <div className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl space-y-6 mb-16 lg:mb-24 text-center mx-auto">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Excellence Defined</h4>
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">Our Services</h1>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
                            Comprehensive event management and discovery solutions designed to make your next exhibition a success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <ServiceItem
                            icon={MagnifyingGlass}
                            title="Event Discovery"
                            description="Access a curated list of industry conferences, meetups, and workshops tailored to your interests and location."
                        />
                        <ServiceItem
                            icon={Calendar}
                            title="Calendar Integration"
                            description="Sync important event dates with your personal or team calendars effortlessly with our one-click export."
                        />
                        <ServiceItem
                            icon={ChartPie}
                            title="Organizer Analytics"
                            description="Detailed reports and insights for event organizers to track attendance, engagement, and ROI."
                        />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function ServiceItem({ icon: Icon, title, description }) {
    return (
        <div className="group p-10 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
                <Icon size={28} weight="bold" className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MagnifyingGlass, Calendar, ChartPie } from 'phosphor-react';
import PageHeader from '@/Components/PageHeader';
import AnimatedSection, { AnimatedItem } from '@/Components/AnimatedSection';
import { motion } from 'framer-motion';

export default function Services() {
    return (
        <PublicLayout>
            <Head title="Our Services - Build Your Booth" />

            <PageHeader
                title="Our Services"
                subtitle="Excellence Defined"
                description="Comprehensive event management and discovery solutions designed to make your next exhibition a success."
            />

            <AnimatedSection className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatedItem>
                            <ServiceItem
                                icon={MagnifyingGlass}
                                title="Event Discovery"
                                description="Access a curated list of industry conferences, meetups, and workshops tailored to your interests and location."
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ServiceItem
                                icon={Calendar}
                                title="Calendar Integration"
                                description="Sync important event dates with your personal or team calendars effortlessly with our one-click export."
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ServiceItem
                                icon={ChartPie}
                                title="Organizer Analytics"
                                description="Detailed reports and insights for event organizers to track attendance, engagement, and ROI."
                            />
                        </AnimatedItem>
                    </div>
                </div>
            </AnimatedSection>
        </PublicLayout>
    );
}

function ServiceItem({ icon: Icon, title, description }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ borderColor: '#dbeafe' }}
            className="p-10 rounded-2xl border border-slate-100"
        >
            <motion.div
                animate={{
                    backgroundColor: isHovered ? '#2563eb' : '#eff6ff',
                }}
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-8"
            >
                <motion.div
                    animate={{
                        color: isHovered ? '#ffffff' : '#2563eb',
                    }}
                >
                    <Icon size={28} weight="bold" />
                </motion.div>
            </motion.div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}

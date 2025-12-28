import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Check } from 'phosphor-react';
import PageHeader from '@/Components/PageHeader';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About Us - Build Your Booth" />

            <PageHeader
                title="About Build Your Booth"
                subtitle="Our Story"
                description="Our mission is to bridge the gap between exhibitors and their success by providing a centralized, easy-to-use platform for booth discovery and management."
            />

            <div className="py-20 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg font-medium text-slate-600 leading-relaxed">
                                Build Your Booth was founded on the belief that staying connected with your exhibition community should be effortless. We provide a robust calendar system that tracks both internal organizational events and external industry conferences.
                            </p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-10 mb-6">What We Do</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                                        <Check size={14} weight="bold" className="text-white" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Curate high-quality industry events and meetups for Saudi Arabia and Egypt.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                                        <Check size={14} weight="bold" className="text-white" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Provide a seamless interface for internal workshop scheduling and planning.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                                        <Check size={14} weight="bold" className="text-white" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Help users never miss an important date with precision tracking and analytics.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 aspect-square">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover"
                                alt="Modern Office"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MapPin, Phone, EnvelopeSimple, ChatCircleText } from 'phosphor-react';
import PageHeader from '@/Components/PageHeader';

export default function Contact() {
    return (
        <PublicLayout>
            <Head title="Contact Us - Build Your Booth" />

            <PageHeader
                title="Contact Us"
                subtitle="Get In Touch"
                description="Have a question or ready to build your next booth? We're here to help you stand out at your next exhibition."
            />

            <div className="py-20 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-gray-100">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Send us a message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Project Inquiry"
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                                    <textarea
                                        rows="5"
                                        placeholder="Tell us about your project..."
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>
                                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Information</h3>

                            <div className="space-y-6">
                                {/* KSA Office */}
                                <div className="flex gap-6 p-6 rounded-3xl border border-slate-50 hover:border-blue-100 transition-colors">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin size={28} weight="bold" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Saudi Arabia Office</h4>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            Riyadh, KSA<br />
                                            Commercial Registration: 1234567890
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                                            <Phone size={18} weight="bold" />
                                            <a href="tel:+966547639806" className="hover:underline">(+966) 54 763 9806</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Egypt Office */}
                                <div className="flex gap-6 p-6 rounded-3xl border border-slate-50 hover:border-blue-100 transition-colors">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin size={28} weight="bold" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Egypt Office</h4>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            7 Taha Hussien st., New Nozha, Cairo<br />
                                            Egypt Office Hub
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                                            <Phone size={18} weight="bold" />
                                            <a href="tel:+201005003732" className="hover:underline">(+20) 100 500 3732</a>
                                        </div>
                                    </div>
                                </div>

                                {/* General Contact */}
                                <div className="flex gap-6 p-6 rounded-3xl border border-slate-50 hover:border-blue-100 transition-colors">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <EnvelopeSimple size={28} weight="bold" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">Email & WhatsApp</h4>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            Our team typically responds within 2-4 hours during business days.
                                        </p>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                                                <EnvelopeSimple size={18} weight="bold" />
                                                <a href="mailto:hello@buildyourbooth.net" className="hover:underline">hello@buildyourbooth.net</a>
                                            </div>
                                            <a
                                                href="https://api.whatsapp.com/send?phone=966547639806"
                                                target="_blank"
                                                className="flex items-center gap-2 text-green-600 font-bold text-sm hover:underline"
                                            >
                                                <ChatCircleText size={18} weight="bold" />
                                                <span>Chat on WhatsApp</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Check, ArrowRight } from 'phosphor-react';
import PageHeader from '@/Components/PageHeader';
import CTABanner from '@/Components/CTABanner';

const CONSULTATION_BG_IMG = '/images/consultation_bg.png';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About Us - Build Your Booth" />

            <PageHeader
                title="About"
                subtitle="Our Story"
                description="Our mission is to bridge the gap between exhibitors and their success by providing a centralized, easy-to-use platform for booth discovery and management."
            />

            {/* Welcome To Build Your Booth Section */}
            <section className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">
                                Welcome To Build Your Booth
                            </h4>
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tighter">
                                We Are a Professional Exhibition Booths Builders
                            </h2>
                            <p className="text-lg font-medium text-slate-600 leading-relaxed">
                                Build Your Booth specializes in creating exceptional exhibition experiences. With years of expertise in booth design and construction, we help businesses stand out at trade shows and exhibitions across Saudi Arabia and Egypt. Our team combines innovative design with quality craftsmanship to deliver booths that attract attention and engage your audience.
                            </p>
                            
                            {/* Feature Points */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                        <Check size={24} weight="bold" className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">3 Days Delivery</h3>
                                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                            Fast and efficient delivery service. We understand the importance of timing in exhibitions, which is why we ensure your booth is ready and delivered within 3 days of approval.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                        <Check size={24} weight="bold" className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Materials</h3>
                                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                            We use only the highest quality materials and cutting-edge technology to ensure your booth is durable, visually stunning, and built to last through multiple exhibitions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 aspect-[4/5]">
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover"
                                alt="Professional Exhibition Booth"
                            />
                            {/* Client Count Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-xl">
                                <div className="text-3xl font-black mb-1">1450+</div>
                                <div className="text-sm font-bold uppercase tracking-wide">Trusted Clients</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 aspect-square">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover"
                                alt="Team Collaboration"
                            />
                            {/* Optional Speech Bubble Overlay */}
                            <div className="absolute top-6 right-6 bg-white px-4 py-3 rounded-xl shadow-lg max-w-[200px]">
                                <p className="text-sm font-medium text-slate-700 mb-1">
                                    "Excellent service and quality!"
                                </p>
                                <p className="text-xs font-bold text-blue-600">Alan Alexander</p>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">
                                Why Choose Us
                            </h4>
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tighter">
                                The Perfect Solution For All Exhibition Booth Building Services
                            </h2>
                            <p className="text-lg font-medium text-slate-600 leading-relaxed">
                                We provide comprehensive booth building services that cover every aspect of your exhibition needs. From initial design concepts to final installation, our experienced team ensures your booth reflects your brand and achieves your exhibition goals.
                            </p>
                            
                            {/* Feature Points */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                        <ArrowRight size={24} weight="bold" className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
                                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                            To become the leading exhibition booth builder in the Middle East, recognized for innovation, quality, and exceptional customer service. We envision a future where every exhibitor has access to world-class booth solutions.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                        <Check size={24} weight="bold" className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
                                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                            To empower businesses with exceptional exhibition booths that drive engagement, increase brand visibility, and deliver measurable results. We commit to delivering excellence in every project, from concept to completion.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-4">
                                <Link
                                    href="/contact"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-md text-sm transition-all uppercase tracking-wide"
                                >
                                    BUILD YOUR BOOTH
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Banner */}
            <CTABanner
                title="Still Confused About Our Features? Get A Consultation"
                description="Not sure which booth solution is right for you? Our expert team is here to help. Schedule a free consultation and discover how we can bring your exhibition vision to life."
                buttonText="START CONSULTATION"
                backgroundImage={CONSULTATION_BG_IMG}
            />
        </PublicLayout>
    );
}

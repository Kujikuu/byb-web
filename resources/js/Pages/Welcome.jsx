import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CaretRight, PaintBrush, Wrench, ChartBar, Play } from 'phosphor-react';
import CTABanner from '@/Components/CTABanner';
import VideoModal from '@/Components/VideoModal';
import ApplicationLogo from '@/Components/ApplicationLogo';
import AnimatedSection, { AnimatedItem } from '@/Components/AnimatedSection';
import { motion } from 'framer-motion';

const BOOTH_SHOWCASE_IMG = '/images/booth_showcase.png';
const CONSULTATION_BG_IMG = '/images/consultation_bg.png';
const BACKGROUND_IMG = '/images/background.png';

export default function Welcome() {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    // TODO: Replace with actual video URL
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Placeholder
    return (
        <PublicLayout>
            <Head title="Build Your Booth - Exceptional Booth Building Experience" />

            {/* Hero Section */}
            <AnimatedSection className="relative flex items-center overflow-hidden mt-0 lg:-mt-20 pt-0 lg:pt-20 z-0">
                <div className="flex w-full h-full">
                    {/* Left Section - 1/2 width */}
                    <div
                        className="w-full lg:w-1/2 bg-[#f6f4ef] relative flex items-center px-4 py-0 sm:py-10 sm:px-6 lg:px-12 xl:px-16"
                        style={{
                            backgroundImage: `url('${BACKGROUND_IMG}')`,
                            backgroundSize: 'auto',
                            backgroundPosition: 'center right',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {/* Large White Plus Sign - Upper Middle */}
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 opacity-20 pointer-events-none">
                            <div className="text-9xl font-thin text-white select-none">+</div>
                        </div>

                        {/* Thin Curved White Lines */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                            <svg className="absolute top-20 right-20 w-64 h-64" viewBox="0 0 200 200">
                                <path d="M 20 100 Q 50 50, 100 80 T 180 100" stroke="white" strokeWidth="2" fill="none" />
                            </svg>
                            <svg className="absolute bottom-20 left-20 w-64 h-64" viewBox="0 0 200 200">
                                <path d="M 20 100 Q 50 150, 100 120 T 180 100" stroke="white" strokeWidth="2" fill="none" />
                            </svg>
                        </div>

                        {/* Chevrons - Below Content, Pointing Right */}
                        <div className="absolute bottom-24 left-10 opacity-20 pointer-events-none">
                            <div className="flex gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="text-slate-400 text-2xl font-thin">&gt;</div>
                                ))}
                            </div>
                        </div>

                        {/* Dots Pattern - Bottom Right */}
                        <div className="absolute bottom-10 right-20 opacity-15 pointer-events-none">
                            <div className="grid grid-cols-6 gap-2">
                                {[...Array(24)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full ${i % 4 === 0 ? 'bg-red-500' : 'bg-white'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 max-w-2xl space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-[2px] bg-blue-600" />
                                    Exceptional booth-building experience
                                </h4>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-slate-900 leading-[1.05] tracking-tighter">
                                    Build your next <br className="hidden sm:block" />
                                    <span className="text-blue-600">Booth</span>
                                </h1>
                                <p className="text-slate-500 text-lg leading-relaxed max-w-lg font-normal">
                                    Elevate your booth-building experience with our digital platform and stay updated on upcoming exhibitions through our exhibition calendar.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-5 items-center">
                                <motion.button
                                    whileHover={{ backgroundColor: '#2563eb' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-blue-600 text-white font-black px-10 py-5 rounded-md text-sm uppercase tracking-wide"
                                >
                                    BUILD YOUR BOOTH
                                </motion.button>
                                <motion.div whileHover={{ color: '#2563eb' }}>
                                    <Link href="/calendar" className="text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-2">
                                        BROWSE CALENDAR
                                        <CaretRight size={16} weight="bold" />
                                    </Link>
                                </motion.div>
                            </div>
                            <div className="pt-4">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Stay updated on the exhibition calendar for Saudi Arabia and Egypt.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - 1/2 width */}
                    <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center h-[640px]">
                        {/* Branded Logo/Cube Behind Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="text-center">
                                <div className="mb-4">
                                    <ApplicationLogo className="h-16 w-auto mx-auto opacity-30" />
                                </div>
                                <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
                                    BUILD YOUR BOOTH
                                </div>
                            </div>
                        </div>

                        {/* Play Button */}
                        <motion.button
                            onClick={() => setIsVideoModalOpen(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative z-10 cursor-pointer"
                            aria-label="Play video"
                        >
                            <div className="w-32 h-32 bg-purple-400 rounded-full flex items-center justify-center shadow-2xl">
                                <Play size={48} weight="fill" className="text-white ml-2" />
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* Video Modal */}
                <VideoModal
                    isOpen={isVideoModalOpen}
                    onClose={() => setIsVideoModalOpen(false)}
                    videoUrl={videoUrl}
                    videoType="youtube"
                />
            </AnimatedSection>

            {/* Services Section */}
            <AnimatedSection className="py-20 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedItem className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
                        <div className="space-y-4 max-w-2xl">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Our Services</h4>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter">Innovative Booth Solutions</h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed pb-2">
                            Designing an exceptional booth can be challenging, but we're here to help. Check out our solutions for building and designing your booth, complete with performance reports to measure its success.
                        </p>
                    </AnimatedItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatedItem>
                            <ServiceCard
                                icon={PaintBrush}
                                title="Booth Design"
                                description="Our team handles everything from planning to setup, ensuring your booth attracts attention and engages your audience."
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ServiceCard
                                icon={Wrench}
                                title="Booth Build"
                                description="We focus on your goals to build an attractive and effective display. With quality materials and additional features, we ensure your booth stands out."
                                highlighted
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ServiceCard
                                icon={ChartBar}
                                title="Performance Report"
                                description="We analyze visitor numbers and engagement to help you improve future exhibitions. Boost your impact with our detailed report!"
                            />
                        </AnimatedItem>
                    </div>
                </div>
            </AnimatedSection>

            {/* Consultation Banner */}
            <CTABanner
                title="Get a Free Consultation!"
                description="Get your booth ready for your next event! Contact us now for a FREE consultation!"
                buttonText="REQUEST CONSULTATION"
                backgroundImage={CONSULTATION_BG_IMG}
            />

            {/* Working Process */}
            <AnimatedSection className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AnimatedItem className="max-w-3xl mx-auto space-y-6 mb-16 lg:mb-24">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">How It Works</h4>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter">Our Working Process</h2>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed px-4 sm:px-10">
                            From initial consultation to final delivery, we guide you through every step of creating an exceptional exhibition booth that stands out and engages your audience.
                        </p>
                    </AnimatedItem>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[20%] left-[15%] right-[15%] h-[1px] bg-slate-100 -z-0" />

                        <AnimatedItem>
                            <ProcessStep
                                number="01"
                                title="Request Your Booth"
                                description="Submit your booth request with your exhibition details, location, and requirements. Tell us about your brand, target audience, and what you want to achieve at the event."
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ProcessStep
                                number="02"
                                title="Design & Planning"
                                description="Our expert designers create a custom booth design tailored to your brand. We handle everything from concept to detailed planning, ensuring your booth attracts attention."
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ProcessStep
                                number="03"
                                title="Build & Delivery"
                                description="We build your booth using premium materials and cutting-edge technology. With our fast-track service, your booth is ready and delivered within 3 days of approval."
                            />
                        </AnimatedItem>
                    </div>
                </div>
            </AnimatedSection>
        </PublicLayout>
    );
}

function ServiceCard({ icon: Icon, title, description, highlighted = false }) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={`p-10 rounded-2xl border ${highlighted
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-100 text-slate-900'
                }`}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-8 ${highlighted ? 'bg-white/20' : 'bg-blue-50'
                }`}>
                <Icon size={28} weight="bold" className={`${highlighted ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 tracking-tight ${highlighted ? 'text-white' : 'text-slate-900'
                }`}>{title}</h3>
            <p className={`text-sm font-medium leading-relaxed ${highlighted ? 'text-white/80' : 'text-slate-500'
                }`}>
                {description}
            </p>
        </motion.div>
    );
}

function ProcessStep({ number, title, description }) {
    return (
        <div className="relative z-10">
            <div className="text-8xl font-black text-slate-100 mb-[-3rem] select-none">
                {number}
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[16rem] mx-auto">
                    {description}
                </p>
            </div>
        </div>
    );
}

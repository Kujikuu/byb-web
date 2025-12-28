import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { CaretRight, CaretLeft, PaintBrush, Wrench, ChartBar, Play } from 'phosphor-react';
import CTABanner from '@/Components/CTABanner';
import VideoModal from '@/Components/VideoModal';
import ApplicationLogo from '@/Components/ApplicationLogo';
import AnimatedSection, { AnimatedItem } from '@/Components/AnimatedSection';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/Contexts/LanguageContext';

const BOOTH_SHOWCASE_IMG = '/images/booth_showcase.png';
const CONSULTATION_BG_IMG = '/images/consultation_bg.png';
const BACKGROUND_IMG = '/images/background.png';
const SHOWREEL_IMG = '/images/Showreel_1920x108002.jpg';

export default function Welcome() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    // TODO: Replace with actual Vimeo video URL
    const videoUrl = 'https://vimeo.com/1089796539?autoplay=1&controls=0&muted=0'; // Placeholder - replace with your Vimeo video URL
    return (
        <PublicLayout>
            <Head title={t('welcome.title')} />

            {/* Hero Section */}
            <AnimatedSection className="relative flex items-center overflow-hidden mt-0 lg:-mt-20 pt-0 lg:pt-20 z-0">
                <div className="flex w-full h-full">
                    {/* Left Section - 1/2 width */}
                    <div
                        className="w-full lg:w-1/2 bg-[#f6f4ef] relative flex items-center px-4 py-0 sm:py-20 sm:px-6 lg:px-12 xl:px-16"
                        style={{
                            backgroundImage: `url('${BACKGROUND_IMG}')`,
                            backgroundSize: 'auto',
                            backgroundPosition: 'center right',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className="relative z-10 max-w-2xl space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-[2px] bg-blue-600" />
                                    {t('welcome.heroSubtitle')}
                                </h4>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-slate-900 leading-[1.05] tracking-tighter">
                                    {t('welcome.heroTitle').split(' ').slice(0, -1).join(' ')} <br className="hidden sm:block" />
                                    <span className="text-blue-600">{t('welcome.heroTitle').split(' ').slice(-1)[0]}</span>
                                </h1>
                                <p className="text-slate-500 text-lg leading-relaxed max-w-lg font-normal">
                                    {t('welcome.heroDescription')}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-5 items-center">
                                <motion.button
                                    whileHover={{ backgroundColor: '#2563eb' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-blue-600 text-white font-black px-10 py-5 rounded-md text-sm uppercase tracking-wide"
                                >
                                    {t('common.buildYourBooth')}
                                </motion.button>
                                <motion.div whileHover={{ color: '#2563eb' }}>
                                    <Link href="/calendar" className="text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-2">
                                        {t('common.browseCalendar')}
                                        {isRTL ? (
                                            <CaretLeft size={16} weight="bold" />
                                        ) : (
                                            <CaretRight size={16} weight="bold" />
                                        )}
                                    </Link>
                                </motion.div>
                            </div>
                            <div className="pt-4">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    {t('welcome.heroFooter')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - 1/2 width */}
                    <div 
                        className="hidden lg:flex w-1/2 relative items-center justify-center"
                        style={{
                            backgroundImage: `url('${SHOWREEL_IMG}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {/* Overlay for better contrast */}
                        <div className="absolute inset-0 bg-slate-900/40"></div>
                        
                        {/* Branded Logo/Cube Behind Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="text-center">
                                <div className="mb-4">
                                    <ApplicationLogo className="h-16 w-auto mx-auto opacity-30" />
                                </div>
                                <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
                                    {t('common.buildYourBooth')}
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
                    videoType="vimeo"
                />
            </AnimatedSection>

            {/* Services Section */}
            <AnimatedSection className="py-20 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedItem className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
                        <div className="space-y-4 max-w-2xl">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">{t('welcome.servicesTitle')}</h4>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter">{t('welcome.servicesSubtitle')}</h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed pb-2">
                            {t('welcome.servicesDescription')}
                        </p>
                    </AnimatedItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatedItem>
                            <ServiceCard
                                icon={PaintBrush}
                                title={t('welcome.boothDesign')}
                                description={t('welcome.boothDesignDesc')}
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ServiceCard
                                icon={Wrench}
                                title={t('welcome.boothBuild')}
                                description={t('welcome.boothBuildDesc')}
                                highlighted
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ServiceCard
                                icon={ChartBar}
                                title={t('welcome.performanceReport')}
                                description={t('welcome.performanceReportDesc')}
                            />
                        </AnimatedItem>
                    </div>
                </div>
            </AnimatedSection>

            {/* Consultation Banner */}
            <CTABanner
                title={t('welcome.consultationTitle')}
                description={t('welcome.consultationDescription')}
                buttonText={t('welcome.consultationButton')}
                backgroundImage={CONSULTATION_BG_IMG}
            />

            {/* Working Process */}
            <AnimatedSection className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <AnimatedItem className="max-w-3xl mx-auto space-y-6 mb-16 lg:mb-24">
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">{t('welcome.howItWorks')}</h4>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter">{t('welcome.workingProcess')}</h2>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed px-4 sm:px-10">
                            {t('welcome.workingProcessDesc')}
                        </p>
                    </AnimatedItem>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[20%] left-[15%] right-[15%] h-[1px] bg-slate-100 -z-0" />

                        <AnimatedItem>
                            <ProcessStep
                                number="01"
                                title={t('welcome.step1Title')}
                                description={t('welcome.step1Desc')}
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ProcessStep
                                number="02"
                                title={t('welcome.step2Title')}
                                description={t('welcome.step2Desc')}
                            />
                        </AnimatedItem>
                        <AnimatedItem>
                            <ProcessStep
                                number="03"
                                title={t('welcome.step3Title')}
                                description={t('welcome.step3Desc')}
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

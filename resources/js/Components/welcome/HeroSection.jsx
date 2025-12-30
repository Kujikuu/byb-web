import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CaretRight, CaretLeft, Play } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/Contexts/LanguageContext';
import AnimatedSection from '@/Components/AnimatedSection';
import ApplicationLogo from '@/Components/ApplicationLogo';
import VideoModal from '@/Components/VideoModal';

const BACKGROUND_IMG = '/images/background.png';
const SHOWREEL_IMG = '/images/Showreel_1920x108002.jpg';

export default function HeroSection() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    // TODO: Replace with actual Vimeo video URL
    const videoUrl = 'https://vimeo.com/1089796539?autoplay=1&controls=0&muted=0'; // Placeholder - replace with your Vimeo video URL

    return (
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
    );
}

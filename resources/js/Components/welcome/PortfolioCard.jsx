import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CaretRight, CaretLeft, Calendar, CaretLeft as ArrowLeft, CaretRight as ArrowRight } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/Contexts/LanguageContext';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function PortfolioCard({ portfolio }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Normalize images: support both single image and images array
    const images = useMemo(() => {
        if (portfolio.images && Array.isArray(portfolio.images) && portfolio.images.length > 0) {
            return portfolio.images;
        }
        if (portfolio.image) {
            return [portfolio.image];
        }
        return [];
    }, [portfolio.image, portfolio.images]);

    // Prepare slides for lightbox
    const slides = useMemo(() => {
        return images.map((src) => ({ src }));
    }, [images]);

    const hasImages = images.length > 0;
    const hasMultipleImages = images.length > 1;

    const handleImageClick = () => {
        setLightboxIndex(currentImageIndex);
        setLightboxOpen(true);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <motion.div className="bg-white border border-slate-100 rounded-2xl overflow-hidden group">
                {hasImages && (
                    <div className="relative h-64 overflow-hidden">
                        <div 
                            className="w-full h-full cursor-pointer relative"
                            onClick={handleImageClick}
                        >
                            <img
                                src={images[currentImageIndex]}
                                alt={portfolio.title}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Navigation Arrows - Only show if multiple images */}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all z-20 shadow-lg"
                                        aria-label="Previous image"
                                    >
                                        {isRTL ? (
                                            <ArrowRight size={16} weight="bold" className="text-slate-900" />
                                        ) : (
                                            <ArrowLeft size={16} weight="bold" className="text-slate-900" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all z-20 shadow-lg"
                                        aria-label="Next image"
                                    >
                                        {isRTL ? (
                                            <ArrowLeft size={16} weight="bold" className="text-slate-900" />
                                        ) : (
                                            <ArrowRight size={16} weight="bold" className="text-slate-900" />
                                        )}
                                    </button>
                                    
                                    {/* Image Counter */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Hover overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
                    </div>
                )}
                <div className="p-6 space-y-4">
                    {portfolio.industry && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                {portfolio.industry.name}
                            </span>
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight line-clamp-2">
                        {portfolio.title}
                    </h3>
                    {portfolio.description && (
                        <div
                            className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: portfolio.description }}
                        />
                    )}
                    {portfolio.date && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar size={14} weight="bold" />
                            <span>{new Date(portfolio.date).toLocaleDateString()}</span>
                        </div>
                    )}
                    {portfolio.link && (
                        <motion.a
                            href={portfolio.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ color: '#2563eb' }}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            {t('common.learnMore')}
                            {isRTL ? (
                                <CaretLeft size={16} weight="bold" />
                            ) : (
                                <CaretRight size={16} weight="bold" />
                            )}
                        </motion.a>
                    )}
                </div>
            </motion.div>

            {/* Fullscreen Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                on={{
                    view: ({ index }) => setLightboxIndex(index),
                }}
            />
        </>
    );
}

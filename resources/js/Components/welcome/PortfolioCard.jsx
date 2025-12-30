import { motion } from 'framer-motion';
import { CaretRight, CaretLeft, Calendar } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function PortfolioCard({ portfolio }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    return (
        <motion.div className="bg-white border border-slate-100 rounded-2xl overflow-hidden group cursor-pointer">
            {portfolio.image && (
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
    );
}

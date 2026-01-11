import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MapPin, Phone, EnvelopeSimple, ChatCircleText } from 'phosphor-react';
import PageHeader from '@/Components/PageHeader';
import AnimatedSection, { AnimatedItem } from '@/Components/AnimatedSection';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { COUNTRIES } from '@/config/countries';

export default function Contact() {
    const { t } = useTranslation();
    
    return (
        <PublicLayout>
            <Head title={t('contact.title')} />

            <PageHeader
                title={t('contact.pageTitle')}
                subtitle={t('contact.subtitle')}
                description={t('contact.description')}
            />

            <AnimatedSection className="py-20 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <AnimatedItem className="bg-white p-6 sm:p-12 rounded-3xl border border-gray-100">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">{t('contact.sendMessage')}</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.fullName')}</label>
                                        <motion.input
                                            type="text"
                                            placeholder={t('contact.placeholders.fullName')}
                                            whileFocus={{ scale: 1.02 }}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.emailAddress')}</label>
                                        <motion.input
                                            type="email"
                                            placeholder={t('contact.placeholders.email')}
                                            whileFocus={{ scale: 1.02 }}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.country')}</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    >
                                        <option value="">{t('contact.placeholders.country')}</option>
                                        {COUNTRIES.map((country) => (
                                            <option key={country} value={country}>
                                                {t(`contact.countries.${country}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.subject')}</label>
                                    <motion.input
                                        type="text"
                                        placeholder={t('contact.projectInquiry')}
                                        whileFocus={{ scale: 1.02 }}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.message')}</label>
                                    <motion.textarea
                                        rows="5"
                                        placeholder={t('contact.tellUsAboutProject')}
                                        whileFocus={{ scale: 1.02 }}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
                                    ></motion.textarea>
                                </div>
                                <motion.button
                                    type="button"
                                    whileHover={{ backgroundColor: '#1d4ed8' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl uppercase tracking-widest text-xs"
                                >
                                    {t('contact.sendMessageButton')}
                                </motion.button>
                            </form>
                        </AnimatedItem>

                        {/* Contact Info */}
                        <AnimatedItem className="flex flex-col">
                            <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">{t('contact.information')}</h3>

                            <div className="space-y-6">
                                {/* KSA Office */}
                                <AnimatedItem>
                                    <motion.div
                                        whileHover={{ borderColor: '#dbeafe' }}
                                        className="flex gap-6 p-6 rounded-3xl border border-slate-50"
                                    >
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin size={28} weight="bold" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{t('contact.ksaOffice')}</h4>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            {t('contact.ksaAddress')}<br />
                                            {t('contact.ksaRegistration')}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                                            <Phone size={18} weight="bold" />
                                            <a href="tel:+966547639806" className="hover:underline">(+966) 54 763 9806</a>
                                        </div>
                                    </div>
                                    </motion.div>
                                </AnimatedItem>

                                {/* Egypt Office */}
                                <AnimatedItem>
                                    <motion.div
                                        whileHover={{ borderColor: '#dbeafe' }}
                                        className="flex gap-6 p-6 rounded-3xl border border-slate-50"
                                    >
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin size={28} weight="bold" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{t('contact.egyptOffice')}</h4>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            {t('contact.egyptAddress')}<br />
                                            {t('contact.egyptHub')}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                                            <Phone size={18} weight="bold" />
                                            <a href="tel:+201005003732" className="hover:underline">(+20) 100 500 3732</a>
                                        </div>
                                    </div>
                                    </motion.div>
                                </AnimatedItem>

                                {/* General Contact */}
                                <AnimatedItem>
                                    <motion.div
                                        whileHover={{ borderColor: '#dbeafe' }}
                                        className="flex gap-6 p-6 rounded-3xl border border-slate-50"
                                    >
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <EnvelopeSimple size={28} weight="bold" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-2">{t('contact.emailWhatsApp')}</h4>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            {t('contact.responseTime')}
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
                                                <span>{t('common.chatOnWhatsApp')}</span>
                                            </a>
                                        </div>
                                    </div>
                                    </motion.div>
                                </AnimatedItem>
                            </div>
                        </AnimatedItem>
                    </div>
                </div>
            </AnimatedSection>
        </PublicLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FileX, House } from 'phosphor-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <Head title={t('errors.notFound')} />

            <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4">
                <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                    <FileX className="w-10 h-10 text-blue-600" weight="fill" />
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 text-center tracking-tighter">
                    {t('errors.notFound')}
                </h1>
                
                <p className="text-slate-500 text-center mb-8 max-w-md text-base leading-relaxed">
                    {t('errors.notFoundDescription')}
                </p>
                
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md text-xs font-semibold uppercase tracking-widest hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                    <House className="w-4 h-4" weight="fill" />
                    {t('errors.goHome')}
                </Link>
            </div>
        </PublicLayout>
    );
}

import { Link } from '@inertiajs/react';
import { CaretRight } from 'phosphor-react';

export default function PageHeader({ title, subtitle, description, breadcrumbs }) {
    // Generate breadcrumbs dynamically if not provided
    const generateBreadcrumbs = () => {
        if (breadcrumbs) {
            return breadcrumbs;
        }

        const crumbs = [
            { label: 'Home', href: '/' },
        ];

        // Get current route name
        const currentRoute = route().current();

        // Map route names to breadcrumb labels
        const routeLabels = {
            'calendar.index': 'Exhibitions Calendar',
            'about': 'About',
            'contact': 'Contact',
            'services': 'Services',
            'welcome': 'Home',
        };

        if (currentRoute && currentRoute !== 'welcome') {
            const label = routeLabels[currentRoute] || title || 'Page';
            crumbs.push({ label, href: null });
        }

        return crumbs;
    };

    const breadcrumbItems = generateBreadcrumbs();

    return (
        <div
            className="flex flex-col items-center w-full max-w-full -mt-[104px] pt-[204px] pb-[140px] px-0 bg-[#f6f4ef] bg-[url('/images/back.png')] bg-[50%_0%] bg-cover font-sans text-[16px] leading-[27.2px] text-[#363636] antialiased box-border"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="space-y-4 flex flex-col items-center text-center">
                    {/* Breadcrumb */}
                    <div className="inline-block">
                        <nav className="bg-gray-200 px-4 py-2 rounded-lg">
                            <ol className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                {breadcrumbItems.map((crumb, index) => (
                                    <li key={index} className="flex items-center">
                                        {index > 0 && (
                                            <CaretRight size={16} className='mr-2' />
                                        )}
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-900">{crumb.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>

                    {/* Subtitle */}
                    {/* {subtitle && (
                        <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">
                            {subtitle}
                        </h4>
                    )} */}

                    {/* Title */}
                    <h1 className="text-5xl font-bold text-slate-900 tracking-tighter">
                        {title}
                    </h1>

                    {/* Description */}
                    {description && (
                        <p className="max-w-xl text-slate-500 font-medium text-sm leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

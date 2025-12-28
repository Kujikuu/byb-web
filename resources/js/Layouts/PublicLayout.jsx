import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Phone, EnvelopeSimple, WhatsappLogo, List, X, CaretUp } from 'phosphor-react';
import { useEffect } from 'react';
import PageTransition from '@/Components/PageTransition';

export default function PublicLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navigation */}
            {/* Navigation */}
            <nav className="relative top-0 z-50 bg-[#f6f4ef]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-24">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="h-10 lg:h-14 w-auto" />
                            </Link>

                        </div>
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-6">
                            <NavLink href="/" active={route().current('welcome')}>Home</NavLink>
                            <NavLink href="/calendar" active={route().current('calendar.index')}>Exhibitions Calendar</NavLink>
                            <NavLink href="/about" active={route().current('about')}>About</NavLink>
                            <NavLink href="/contact" active={route().current('contact')}>Contact</NavLink>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-6">
                            <a
                                href="https://api.whatsapp.com/send?phone=966547639806"
                                target="_blank"
                                className="hidden xl:flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                                <div className="p-2 bg-white rounded-full">
                                    <WhatsappLogo size={20} weight="fill" className="text-green-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">WhatsApp</span>
                                    <span className="text-sm font-medium text-slate-900 leading-tight">Free Consultation</span>
                                </div>
                            </a>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md text-xs transition-all uppercase tracking-wide">
                                BUILD YOUR BOOTH
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <X size={24} weight="bold" />
                                ) : (
                                    <List size={24} weight="bold" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white transition-all duration-300">
                        <div className="px-4 py-8 space-y-6">
                            <MobileNavLink href="/" active={route().current('welcome')} onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink href="/calendar" active={route().current('calendar.index')} onClick={() => setMobileMenuOpen(false)}>Exhibitions Calendar</MobileNavLink>
                            <MobileNavLink href="/about" active={route().current('about')} onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
                            <MobileNavLink href="/contact" active={route().current('contact')} onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>

                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <a
                                    href="https://api.whatsapp.com/send?phone=966547639806"
                                    target="_blank"
                                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl"
                                >
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                        <WhatsappLogo size={24} weight="fill" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest leading-none">WhatsApp</span>
                                        <span className="text-sm font-medium text-slate-800 leading-tight">Free Consultation</span>
                                    </div>
                                </a>
                                <button className="w-full bg-blue-600 text-white font-medium py-4 rounded-2xl text-[13px] uppercase tracking-wide">
                                    BUILD YOUR BOOTH
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main>
                <PageTransition>
                    {children}
                </PageTransition>
            </main>

            {/* Footer */}
            <footer className="bg-black text-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-20">
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <ApplicationLogo className="h-16 w-auto" variant="white" />
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                BuildYourBooth aims to assist exhibitors in building their booth in the best possible way!
                            </p>
                            <div className="space-y-4">
                                <ContactItem icon={MapPin} text="Riyadh, KSA" />
                                <ContactItem icon={Phone} text="(+966) 54 763 9806" href="tel:+966547639806" />
                                <ContactItem icon={MapPin} text="7 Taha Hussien st., New Nozha, Cairo" />
                                <ContactItem icon={Phone} text="(+20) 100 500 3732" href="tel:+201005003732" />
                                <ContactItem icon={EnvelopeSimple} text="hello@buildyourbooth.net" href="mailto:hello@buildyourbooth.net" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-8 lg:mb-10">
                                <h4 className="font-bold text-lg mb-3 text-white">Quick Links</h4>
                                <div className="w-12 h-[2px] bg-indigo-500"></div>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                                <FooterLink href="/calendar">Exhibitions Calendar</FooterLink>
                                <FooterLink href="#">Portfolio</FooterLink>
                                <FooterLink href="/about">About Us</FooterLink>
                                <FooterLink href="/contact">Contact Us</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <div className="mb-8 lg:mb-10">
                                <h4 className="font-bold text-lg mb-3 text-white">Quick Links</h4>
                                <div className="w-12 h-[2px] bg-indigo-500"></div>
                            </div>
                            <ul className="space-y-5">
                                <FooterLink href="https://www.scega.gov.sa">Saudi Conventions and Exhibitions General Authority</FooterLink>
                                <FooterLink href="http://www.eeca.gov.eg">Egypt Expo & Convention Authority (EECA)</FooterLink>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-900 pt-10 text-center">
                        <p className="text-slate-500 text-xs font-medium">
                            Copyright © {new Date().getFullYear()}. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 focus:outline-none ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
                    }`}
                aria-label="Scroll to top"
            >
                <CaretUp size={24} weight="bold" />
            </button>
        </div>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center text-base font-medium leading-5 transition duration-150 ease-in-out focus:outline-none uppercase tracking-tight whitespace-nowrap ${active
                ? 'text-blue-600 lg:bg-blue-600/10 lg:px-4 lg:py-2 lg:rounded-md transition-all ease-in-out'
                : 'text-slate-600 hover:text-blue-600 lg:px-4'
                }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, active, onClick, children }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block py-3 px-4 rounded-xl text-sm font-medium uppercase tracking-wide transition-colors ${active
                ? 'bg-blue-600 text-white hover:text-white'
                : 'text-slate-600 hover:bg-gray-50'
                }`}
        >
            {children}
        </Link>
    );
}

function ContactItem({ icon: Icon, text, href }) {
    return (
        <div className="flex items-start gap-3 text-slate-400 group cursor-default">
            <Icon size={18} weight="bold" className="text-blue-600 mt-0.5 shrink-0" />
            {href ? (
                <a href={href} className="leading-tight text-slate-300 hover:text-blue-400 transition-colors">
                    {text}
                </a>
            ) : (
                <span className="leading-tight text-slate-300">{text}</span>
            )}
        </div>
    );
}

function FooterLink({ href, className = "", children }) {
    const isExternal = href.startsWith('http');
    const classes = `text-white hover:text-indigo-400 text-md font-medium transition-colors ${className}`;

    return (
        <li>
            {isExternal ? (
                <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            ) : (
                <Link href={href} className={classes}>
                    {children}
                </Link>
            )}
        </li>
    );
}

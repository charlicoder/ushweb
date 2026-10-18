'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function Header() {
    const { lang, isAr, toggleLang, theme, isDark, toggleTheme } = useApp();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { label: isAr ? 'الرئيسية' : 'Home', href: '#hero' },
        { label: isAr ? 'خدماتنا' : 'Our Services', href: '#services' },
        { label: isAr ? 'قسيمة إهداء' : 'Gift Voucher', href: '/gift-voucher' },
        { label: isAr ? 'اتصل بنا' : 'Contact Us', href: '/contact-us' },
    ];

    const handleNavClick = (href: string) => {
        setMobileOpen(false);
        if (href.startsWith('/')) {
            window.location.href = href;
            return;
        }
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = `/${href}`;
        }
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 bg-[#543C30] shadow-md py-2 transition-all duration-500"
            style={{ boxShadow: '0 4px 20px rgba(78, 39, 18, 0.25)' }}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 sm:gap-4">
                {/* Logo & Legal Entity Title */}
                <a
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        if (typeof window !== 'undefined' && window.location.pathname === '/') {
                            handleNavClick('#hero');
                        } else {
                            window.location.href = '/';
                        }
                    }}
                    className="flex items-center gap-2 sm:gap-3 group min-w-0"
                >
                    <img
                        src="/images/logo-white.png"
                        alt="USH Spa Logo"
                        style={{ height: '46px', width: 'auto', display: 'block' }}
                        className="transition-all duration-300 flex-shrink-0"
                    />
                    <div
                        className={`flex flex-col justify-center transition-colors duration-300 ${
                            isAr ? 'border-r pr-2 sm:pr-3' : 'border-l pl-2 sm:pl-3'
                        }`}
                        style={{ borderColor: 'rgba(255,255,255,0.35)' }}
                    >
                        <span
                            className="font-lustria font-semibold text-[11px] sm:text-xs md:text-sm lg:text-[14px] leading-tight text-white transition-colors duration-300 max-w-[190px] sm:max-w-[260px] md:max-w-md lg:max-w-none"
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}
                        >
                            {isAr
                                ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                                : 'Quiet Ush Thai Spa Health Institute for Women'}
                        </span>
                    </div>
                </a>

                {/* Desktop Nav & Actions */}
                <div className="hidden lg:flex items-center gap-2">
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(item.href);
                                }}
                                className="text-sm font-medium uppercase tracking-wider px-3 py-2 transition-colors duration-300 !text-white hover:!text-[#D3C0B1]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 ml-3 border-l border-white/20 pl-3">
                        {/* Language Switcher Button */}
                        <button
                            type="button"
                            onClick={toggleLang}
                            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
                            aria-label="Switch Language"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all duration-200 cursor-pointer"
                        >
                            <svg
                                className="w-4 h-4 text-spa-petal"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.8}
                                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"
                                />
                            </svg>
                            <span>{isAr ? 'English' : 'عربي'}</span>
                        </button>

                        {/* Theme Changer Toggle (Dark/Light) */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            aria-label="Toggle Theme"
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all duration-200 cursor-pointer"
                        >
                            {isDark ? (
                                /* Sun Icon */
                                <svg
                                    className="w-4 h-4 text-amber-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            ) : (
                                /* Moon Icon */
                                <svg
                                    className="w-4 h-4 text-spa-petal"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Header Controls (Theme, Language, Menu Button) */}
                <div className="flex items-center gap-2 lg:hidden">
                    {/* Theme Changer */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                        className="p-1.5 rounded-full bg-white/10 text-white border border-white/25 cursor-pointer"
                    >
                        {isDark ? (
                            <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-spa-petal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {/* Language Switcher */}
                    <button
                        type="button"
                        onClick={toggleLang}
                        aria-label="Switch Language"
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/25 cursor-pointer"
                    >
                        {isAr ? 'EN' : 'عربي'}
                    </button>

                    {/* Hamburger Button */}
                    <button
                        className="p-2 text-white transition-colors duration-300 flex flex-col gap-1.5 cursor-pointer"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`lg:hidden bg-white dark:bg-[#231a16] shadow-lg transition-all duration-300 overflow-hidden ${
                    mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(item.href);
                            }}
                            className="text-sm font-medium uppercase tracking-wider py-2 !text-spa-text dark:!text-[#f7eee9] hover:!text-spa-rose transition-colors duration-300 border-b border-spa-petal dark:border-white/10"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </header>
    );
}

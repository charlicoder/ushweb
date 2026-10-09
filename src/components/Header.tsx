'use client';

import { useState } from 'react';

const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Our Services', href: '#services' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Gallery', href: '#gallery' },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

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
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
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
                    className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
                >
                    <img
                        src="/images/logo-white.png"
                        alt="USH Spa Logo"
                        style={{ height: '48px', width: 'auto', display: 'block' }}
                        className="transition-all duration-300 flex-shrink-0"
                    />
                    <div
                        className="flex flex-col justify-center border-l pl-2.5 sm:pl-3 transition-colors duration-300"
                        style={{ borderColor: 'rgba(255,255,255,0.35)' }}
                    >
                        <span
                            className="font-lustria font-semibold text-[11px] sm:text-xs md:text-sm lg:text-[14px] leading-tight text-white transition-colors duration-300 max-w-[200px] sm:max-w-[280px] md:max-w-md lg:max-w-none"
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}
                        >
                            Quiet Ush Thai Spa Health Institute for Women
                        </span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                            className="text-sm font-medium uppercase tracking-wider px-3 py-2 transition-colors duration-300 !text-white hover:!text-[#D3C0B1]"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href="#booking"
                        onClick={(e) => { e.preventDefault(); handleNavClick('#booking'); }}
                        className="btn-spa btn-rose ml-4 text-xs"
                    >
                        Book Now
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden flex flex-col gap-1.5 p-2 text-white transition-colors duration-300"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                            className="text-sm font-medium uppercase tracking-wider py-2 !text-spa-text hover:!text-spa-rose transition-colors duration-300 border-b border-spa-petal"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href="#booking"
                        onClick={(e) => { e.preventDefault(); handleNavClick('#booking'); }}
                        className="btn-spa btn-rose mt-2 text-center text-xs"
                    >
                        Book Now
                    </a>
                </div>
            </div>
        </header>
    );
}

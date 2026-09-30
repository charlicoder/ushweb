'use client';

const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Our Services', href: '#services' },
    { label: 'Our Experts', href: '#team' },
    { label: 'Appointments', href: '#booking' },
    { label: 'Gift Cards', href: '#gift-cards' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Privacy Policy', href: '/privacy-policy' }
];

const instagramImages = [
    { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=150&q=80', alt: 'USH Spa massage therapy session' },
    { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=150&q=80', alt: 'USH Spa facial treatment' },
    { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=150&q=80', alt: 'USH Spa aromatherapy oils' },
    { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=150&q=80', alt: 'USH Spa hot stone massage' },
    { src: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=150&q=80', alt: 'USH Spa body scrub treatment' },
    { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=150&q=80', alt: 'USH Spa luxury suite' }
];

export default function Footer() {
    const handleScroll = (href: string) => {
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
        <footer className="bg-spa-text text-white pt-16 pb-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
                    {/* Brand */}
                    <div>
                        <div className="mb-4">
                            <span className="font-lustria text-3xl font-bold tracking-widest text-white">USH</span>
                            <span className="font-brush text-2xl text-spa-rose ml-2">Spa</span>
                        </div>
                        <p className="font-semibold text-white/95 text-sm mb-1">
                            Quiet Ush Thai Spa Health Institute for Women
                        </p>
                        <p className="text-white/60 text-xs mb-3">
                            Commercial / Legal Business Entity
                        </p>
                        <p className="text-white/70 text-xs leading-relaxed">
                            Kuwait&apos;s premier destination for luxury spa treatments, authentic Thai wellness therapies,
                            and transformative beauty experiences.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h6 className="font-lustria text-base mb-4 text-white">Let&apos;s Talk</h6>
                        <div className="flex flex-col gap-2 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                            <p className="font-semibold text-white">
                                Quiet Ush Thai Spa Health Institute for Women
                            </p>
                            <p className="text-white/80">
                                Al-Shuhada Street<br />
                                Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman<br />
                                Kuwait city, Sharq 15300, Kuwait
                            </p>
                            <div className="mt-2 flex flex-col gap-1.5 text-xs">
                                <p>
                                    Email:{' '}
                                    <a href="mailto:info@ushspa.co" style={{ color: '#efa697' }} className="hover:opacity-80 transition-opacity duration-300">
                                        info@ushspa.co
                                    </a>
                                </p>
                                <p>
                                    Phone:{' '}
                                    <a href="tel:+965900103335" className="hover:text-spa-rose transition-colors">
                                        +965 900103335
                                    </a>
                                </p>
                                <p>
                                    Instagram:{' '}
                                    <a href="#" style={{ color: '#efa697' }} className="hover:opacity-80 transition-opacity duration-300">
                                        @ushspa
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h6 className="font-lustria text-base mb-6 text-white">Quick Links</h6>
                        <ul className="flex flex-col gap-2">
                            {quickLinks.map((link) =>
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => { e.preventDefault(); handleScroll(link.href); }}
                                        className="text-sm transition-opacity duration-300 hover:opacity-70"
                                        style={{ color: '#ffffff' }}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Instagram */}
                    <div>
                        <h6 className="font-lustria text-base mb-6 text-white">Instagram</h6>
                        <div className="grid grid-cols-3 gap-1">
                            {instagramImages.map((img, idx) =>
                                <a key={idx} href="#" className="block overflow-hidden rounded-sm">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-16 object-cover hover:scale-110 transition-transform duration-300" />

                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white/50 text-xs flex-wrap">
                        <p>&copy; {new Date().getFullYear()} Quiet Ush Thai Spa Health Institute for Women (USH Spa). All Rights Reserved.</p>
                        <span>|</span>
                        <a href="/contact-us" className="hover:text-spa-rose transition-colors duration-300">
                            Contact Us
                        </a>
                        <span>|</span>
                        <a href="/privacy-policy" className="hover:text-spa-rose transition-colors duration-300">
                            Privacy Policy
                        </a>
                        <span>|</span>
                        <a href="/marketing" className="hover:text-spa-rose transition-colors duration-300">
                            Marketing Details
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        {[
                            { label: 'Facebook', href: '#' },
                            { label: 'Instagram', href: '#' },
                            { label: 'Twitter', href: '#' },
                            { label: 'Yelp', href: '#' }].
                            map((social, idx) =>
                                <span key={social.label} className="flex items-center gap-4">
                                    <a
                                        href={social.href}
                                        className="text-white/50 text-sm hover:text-spa-rose transition-colors duration-300">

                                        {social.label}
                                    </a>
                                    {idx < 3 && <span className="text-white/20">|</span>}
                                </span>
                            )}
                    </div>
                </div>
            </div>
        </footer>);

}

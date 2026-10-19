'use client';

import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF, USH_EMAIL_DISPLAY, USH_EMAIL_MAILTO_HREF } from '@/lib/contact';
import { useApp } from '@/context/AppContext';

const instagramImages = [
    { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=150&q=80', alt: 'USH Spa massage therapy session' },
    { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=150&q=80', alt: 'USH Spa facial treatment' },
    { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=150&q=80', alt: 'USH Spa aromatherapy oils' },
    { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=150&q=80', alt: 'USH Spa hot stone massage' },
    { src: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=150&q=80', alt: 'USH Spa body scrub treatment' },
    { src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=150&q=80', alt: 'USH Spa luxury suite' },
];

export default function Footer() {
    const { isAr } = useApp();

    const quickLinks = [
        { label: isAr ? 'عن المعهد' : 'About Us', href: '#about' },
        { label: isAr ? 'خدماتنا' : 'Our Services', href: '/services' },
        { label: isAr ? 'حجز المواعيد' : 'Appointments', href: '#booking' },
        { label: isAr ? 'قسيمة إهداء' : 'Gift Voucher', href: '/gift-voucher' },
        { label: isAr ? 'اتصل بنا' : 'Contact Us', href: '/contact-us' },
        { label: isAr ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy-policy' },
    ];

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
        <footer className="bg-spa-text dark:bg-[#120c09] text-white pt-16 pb-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
                    {/* Brand */}
                    <div>
                        <div className="mb-4">
                            <span className="font-lustria text-3xl font-bold tracking-widest text-white">USH</span>
                            <span className="font-brush text-2xl text-spa-rose ml-2 rtl:mr-2 rtl:ml-0">Spa</span>
                        </div>
                        <p className="font-semibold text-white/95 text-sm mb-1">
                            {isAr
                                ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                                : 'Quiet Ush Thai Spa Health Institute for Women'}
                        </p>
                        <p className="text-white/60 text-xs mb-3">
                            {isAr ? 'الكيان القانوني والتجاري المعتمد' : 'Commercial / Legal Business Entity'}
                        </p>
                        <p className="text-white/70 text-xs leading-relaxed">
                            {isAr
                                ? 'وجهتكم الرائدة في دولة الكويت لأرقى علاجات السبا الفاخرة، والتدليك التايلاندي العلاجي الأصيل، وتجارب الجمال وتجديد الحيوية.'
                                : 'Kuwait’s premier destination for luxury spa treatments, authentic Thai wellness therapies, and transformative beauty experiences.'}
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h6 className="font-lustria text-base mb-4 text-white">
                            {isAr ? 'تواصل معنا' : 'Let’s Talk'}
                        </h6>
                        <div className="flex flex-col gap-2 text-xs leading-relaxed text-white/85">
                            <p className="font-semibold text-white">
                                {isAr ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء' : 'Quiet Ush Thai Spa Health Institute for Women'}
                            </p>
                            <p className="text-white/80">
                                {isAr ? 'شارع الشهداء، قطعة 04، قسيمة 32' : 'Al-Shuhada Street'}<br />
                                {isAr ? 'مبنى ناصر أحمد عبد اللطيف العثمان' : 'Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman'}<br />
                                {isAr ? 'مدينة الكويت، الشرق 15300، دولة الكويت' : 'Kuwait city, Sharq 15300, Kuwait'}
                            </p>
                            <div className="mt-2 flex flex-col gap-1.5 text-xs">
                                <p>
                                    {isAr ? 'البريد الإلكتروني:' : 'Email:'}{' '}
                                    <a href={USH_EMAIL_MAILTO_HREF} style={{ color: '#efa697' }} className="hover:opacity-80 transition-opacity duration-300">
                                        {USH_EMAIL_DISPLAY}
                                    </a>
                                </p>
                                <p>
                                    {isAr ? 'الهاتف:' : 'Phone:'}{' '}
                                    <a href={USH_PHONE_TEL_HREF} className="hover:text-spa-rose transition-colors">
                                        {USH_PHONE_DISPLAY}
                                    </a>
                                </p>
                                <p>
                                    {isAr ? 'انستغرام:' : 'Instagram:'}{' '}
                                    <a href="#" style={{ color: '#efa697' }} className="hover:opacity-80 transition-opacity duration-300">
                                        @ushspa
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h6 className="font-lustria text-base mb-6 text-white">
                            {isAr ? 'روابط سريعة' : 'Quick Links'}
                        </h6>
                        <ul className="flex flex-col gap-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => { e.preventDefault(); handleScroll(link.href); }}
                                        className="text-xs sm:text-sm text-white/85 hover:text-spa-rose transition-colors duration-300"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instagram */}
                    <div>
                        <h6 className="font-lustria text-base mb-6 text-white">
                            {isAr ? 'معرض انستغرام' : 'Instagram'}
                        </h6>
                        <div className="grid grid-cols-3 gap-1.5">
                            {instagramImages.map((img, idx) => (
                                <a key={idx} href="#" className="block overflow-hidden rounded-sm">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-16 object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white/60 text-xs flex-wrap">
                        <p>
                            &copy; {new Date().getFullYear()}{' '}
                            {isAr
                                ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء (USH Spa). جميع الحقوق محفوظة.'
                                : 'Quiet Ush Thai Spa Health Institute for Women (USH Spa). All Rights Reserved.'}
                        </p>
                        <span>|</span>
                        <a href="/contact-us" className="hover:text-spa-rose transition-colors duration-300">
                            {isAr ? 'اتصل بنا' : 'Contact Us'}
                        </a>
                        <span>|</span>
                        <a href="/privacy-policy" className="hover:text-spa-rose transition-colors duration-300">
                            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        </a>
                        <span>|</span>
                        <a href="/marketing" className="hover:text-spa-rose transition-colors duration-300">
                            {isAr ? 'بيانات التسويق' : 'Marketing Details'}
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        {[
                            { label: 'Facebook', href: '#' },
                            { label: 'Instagram', href: '#' },
                            { label: 'Twitter', href: '#' },
                        ].map((social, idx) => (
                            <span key={social.label} className="flex items-center gap-4">
                                <a
                                    href={social.href}
                                    className="text-white/60 text-xs hover:text-spa-rose transition-colors duration-300"
                                >
                                    {social.label}
                                </a>
                                {idx < 2 && <span className="text-white/20">|</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

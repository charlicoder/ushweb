'use client';

import {
    USH_PHONE_DISPLAY,
    USH_PHONE_TEL_HREF,
    USH_BUSINESS_PHONE_DISPLAY,
    USH_BUSINESS_PHONE_TEL_HREF,
    USH_EMAIL_DISPLAY,
    USH_EMAIL_MAILTO_HREF,
    USH_ADDRESS,
} from '@/lib/contact';
import { useApp } from '@/context/AppContext';

const instagramImages = [
    {
        src: '/images/instagram/insta-01.jpg',
        href: 'https://www.instagram.com/p/Da-_bM8Mwn2/',
        alt: 'USH Spa Kuwait Instagram - Mind & Body Rejuvenation',
    },
    {
        src: '/images/instagram/insta-02.jpg',
        href: 'https://www.instagram.com/reel/DRFYtJUDFTA/',
        alt: 'USH Spa Kuwait Instagram - Pure Sanctuary & Relaxation',
    },
    {
        src: '/images/instagram/insta-03.jpg',
        href: 'https://www.instagram.com/p/DbJZXqXjFWL/',
        alt: 'USH Spa Kuwait Instagram - Luxury Suite & Spa Experience',
    },
    {
        src: '/images/instagram/insta-04.jpg',
        href: 'https://www.instagram.com/p/DQmWqx_jNoQ/',
        alt: 'USH Spa Kuwait Instagram - Japanese Hair Detox & Scalp Care',
    },
    {
        src: '/images/instagram/insta-05.jpg',
        href: 'https://www.instagram.com/reel/DRNLIrCjK_t/',
        alt: 'USH Spa Kuwait Instagram - Authentic Thai Wellness Therapy',
    },
    {
        src: '/images/instagram/insta-06.jpg',
        href: 'https://www.instagram.com/p/DR4mbNpDHcG/',
        alt: 'USH Spa Kuwait Instagram - Quiet Ush Thai Spa for Women',
    },
];

export default function Footer() {
    const { isAr } = useApp();

    const quickLinks = [
        { label: isAr ? 'عن المعهد' : 'About Us', href: '#about' },
        // { label: isAr ? 'خدماتنا' : 'Our Services', href: '/services' },
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
        <footer
            style={{ backgroundColor: '#543C30' }}
            className="bg-[#543C30] text-white pt-16 pb-6 transition-colors duration-300"
        >
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
                                {isAr ? (
                                    <>
                                        {USH_ADDRESS.buildingAr}<br />
                                        {USH_ADDRESS.streetAr}، قطعة {USH_ADDRESS.block}، قسيمة {USH_ADDRESS.plot}<br />
                                        {USH_ADDRESS.areaAr}، محافظة {USH_ADDRESS.governorateAr}، {USH_ADDRESS.countryAr}<br />
                                        <span className="text-white/60 text-[11px]">{USH_ADDRESS.unitsAr}</span>
                                    </>
                                ) : (
                                    <>
                                        {USH_ADDRESS.buildingEn}<br />
                                        {USH_ADDRESS.streetEn}, Block {USH_ADDRESS.block}, Plot {USH_ADDRESS.plot}<br />
                                        {USH_ADDRESS.areaEn}, {USH_ADDRESS.governorateEn} Governorate, {USH_ADDRESS.countryEn}<br />
                                        <span className="text-white/60 text-[11px]">{USH_ADDRESS.unitsEn}</span>
                                    </>
                                )}
                            </p>
                            <div className="mt-2 flex flex-col gap-1.5 text-xs">
                                <p>
                                    {isAr ? 'البريد الإلكتروني:' : 'Email:'}{' '}
                                    <a href={USH_EMAIL_MAILTO_HREF} style={{ color: '#efa697' }} className="hover:opacity-80 transition-opacity duration-300">
                                        {USH_EMAIL_DISPLAY}
                                    </a>
                                </p>
                                <p>
                                    {isAr ? 'خدمة العملاء ومركز الاتصال:' : 'Support & Call Center:'}{' '}
                                    <a href={USH_PHONE_TEL_HREF} className="hover:text-spa-rose transition-colors">
                                        {USH_PHONE_DISPLAY}
                                    </a>
                                </p>
                                <p>
                                    {isAr ? 'تواصل المالك / إدارة الأعمال:' : 'Owner / Business Contact:'}{' '}
                                    <a href={USH_BUSINESS_PHONE_TEL_HREF} className="hover:text-spa-rose transition-colors">
                                        {USH_BUSINESS_PHONE_DISPLAY}
                                    </a>
                                </p>
                                <p>
                                    {isAr ? 'انستغرام:' : 'Instagram:'}{' '}
                                    <a
                                        href="https://www.instagram.com/ush_spa/?hl=en"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#efa697' }}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    >
                                        @ush_spa
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
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="font-lustria text-base text-white">
                                {isAr ? 'معرض انستغرام' : 'Instagram'}
                            </h6>
                            <a
                                href="https://www.instagram.com/ush_spa/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs hover:underline text-[#efa697]"
                            >
                                @ush_spa
                            </a>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {instagramImages.map((img, idx) => (
                                <a
                                    key={idx}
                                    href={img.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block overflow-hidden rounded-md group relative shadow-xs"
                                    title={img.alt}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-18 object-cover group-hover:scale-110 transition-transform duration-300"
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
                            { label: 'Instagram', href: 'https://www.instagram.com/ush_spa/?hl=en' },
                            { label: 'Twitter', href: '#' },
                        ].map((social, idx) => (
                            <span key={social.label} className="flex items-center gap-4">
                                <a
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : undefined}
                                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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

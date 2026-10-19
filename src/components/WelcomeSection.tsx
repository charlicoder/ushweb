'use client';

import { useApp } from '@/context/AppContext';

interface ServiceItem {
    id: string;
    iconClass: string;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    featured?: boolean;
}

const services: ServiceItem[] = [
    {
        id: 's1',
        iconClass: 'flaticon-relax-stones',
        titleEn: 'Massage Therapy',
        titleAr: 'التدليك العلاجي',
        descEn: 'Authentic Thai techniques and pressure point therapy to release tension, restore natural energy, and revitalize your whole body.',
        descAr: 'تقنيات تايلاندية أصيلة وعلاج بمراكز الضغط لتخفيف الإجهاد والتوتر، واستعادة تدفق الطاقة الطبيعية وحيوية الجسد.',
    },
    {
        id: 's2',
        iconClass: 'flaticon-cream-2',
        titleEn: 'Skin Care',
        titleAr: 'العناية بالبشرة',
        descEn: 'Custom facial rituals using botanical extracts and premium organic serums for deeply nourished, luminous, and youthful skin.',
        descAr: 'جلسات عناية ملكية بالوجه باستخدام مستخلصات نباتية وسيرومات عضوية فاخرة لبشرة نضرة ومشرقة تشع شباباً وحيوية.',
        featured: true,
    },
    {
        id: 's3',
        iconClass: 'flaticon-towel',
        titleEn: 'Body Treatments',
        titleAr: 'علاجات الجسد',
        descEn: 'Exfoliating body scrubs, therapeutic herbal wraps, and restorative hydrotherapy crafted exclusively for women’s wellness.',
        descAr: 'تقشير عطري ناعم، ولفائف عشبية علاجية دافئة، وتجارب استرخاء مائية صممت خصيصاً لتعزيز صحة وجمال المرأة.',
    },
];

export default function WelcomeSection() {
    const { isAr } = useApp();

    const handleReadMore = () => {
        window.location.href = '/services';
    };

    return (
        <section id="welcome" className="bg-[#faf7f5] dark:bg-[#1c1512] transition-colors duration-300 overflow-hidden">
            {/* ── Section Title ── */}
            <div className="text-center pt-20 pb-2 px-4 relative">
                <span
                    aria-hidden="true"
                    className="font-brush block leading-none select-none pointer-events-none"
                    style={{
                        fontSize: '6rem',
                        color: '#9a7570',
                        opacity: 0.12,
                        marginBottom: '-3.4rem',
                        letterSpacing: '3px',
                    }}
                >
                    {isAr ? 'مرحباً بكم في' : 'Welcome To'}
                </span>
                <h2
                    className="font-lustria text-[#727475] dark:text-[#e4d8d1] relative z-10 mb-4 transition-colors duration-300"
                    style={{ fontSize: '2.6rem', letterSpacing: '0.5px', fontWeight: 700 }}
                >
                    {isAr ? 'معهد التدليك والعناية الصحية' : 'Massage Therapy Center'}
                </h2>
                <p
                    className="text-spa-muted dark:text-[#b5a49c] mx-auto leading-relaxed transition-colors duration-300"
                    style={{ fontSize: '1.05rem', maxWidth: '540px' }}
                >
                    {isAr
                        ? 'ملاذكِ الهادئ في قلب الكويت للاستمتاع بجلسات تدليك تايلاندية تقليدية وعلاجات استرخاء متكاملة تحت أيدي أخصائيات خبيرات.'
                        : 'Your tranquil sanctuary in Kuwait for authentic Thai massage and comprehensive restorative wellness crafted by certified specialists.'}
                </p>
            </div>

            {/* ── Service Cards ── */}
            <div className="max-w-5xl mx-auto px-4 pb-20 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6 md:gap-0">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`flex flex-col items-center text-center transition-all duration-300 p-8 sm:p-12 ${
                                service.featured
                                    ? 'bg-white dark:bg-[#231a16] shadow-xl md:-translate-y-2 rounded-xl border border-spa-petal/40 dark:border-white/10 z-10'
                                    : 'bg-transparent'
                            }`}
                        >
                            {/* Blush circle with flaticon */}
                            <div
                                className="flex items-center justify-center rounded-full mb-8 ico-80 bg-[#f7f4f0] dark:bg-[#2d211c] text-[#efa697] transition-colors duration-300"
                                style={{
                                    width: '160px',
                                    height: '160px',
                                    flexShrink: 0,
                                }}
                            >
                                <span className={service.iconClass} />
                            </div>

                            {/* Title */}
                            <h5
                                className="font-lustria text-spa-text dark:text-[#f7eee9] mb-3 transition-colors duration-300"
                                style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.3px' }}
                            >
                                {isAr ? service.titleAr : service.titleEn}
                            </h5>

                            {/* Description */}
                            <p
                                className="text-spa-muted dark:text-[#b5a49c] leading-relaxed mb-8 transition-colors duration-300"
                                style={{ fontSize: '0.95rem', maxWidth: '240px' }}
                            >
                                {isAr ? service.descAr : service.descEn}
                            </p>

                            {/* Outlined rose button */}
                            <button
                                onClick={handleReadMore}
                                className="btn-spa btn-tra-rose mt-auto"
                                style={{ fontSize: '0.78rem', padding: '9px 30px', letterSpacing: '0.8px' }}
                            >
                                {isAr ? 'المزيد من التفاصيل' : 'Read More'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

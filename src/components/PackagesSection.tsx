'use client';

import { useApp } from '@/context/AppContext';

interface Package {
    image: string;
    alt: string;
    titleEn: string;
    titleAr: string;
    includesEn: string[];
    includesAr: string[];
    price: string;
}

const packages: Package[] = [
    {
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_14ea820b6-1776868633883.png",
        alt: 'Combination massage package with custom massage and facial treatment',
        titleEn: 'Combination Massage',
        titleAr: 'مساج مدمج',
        includesEn: [
            'Custom Massage (20 min)',
            'Detox Custom Facial (50 min)',
        ],
        includesAr: [
            'مساج مخصص (20 دقيقة)',
            'فيشل تنقية ديتوكس (50 دقيقة)',
        ],
        price: '20 KWD',
    },
    {
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_137aa3333-1786991984482.png",
        alt: 'Supreme skincare package with sea salt scrub and body wrap treatments',
        titleEn: 'Supreme Skincare',
        titleAr: 'عناية فائقة بالبشرة',
        includesEn: [
            'Organic Sea Salt Scrub (30 min)',
            'Soothing Skin Body Wrap (40 min)',
            'Hydrating Facial (20 min)',
        ],
        includesAr: [
            'صنفرة بملح البحر العضوي (30 دقيقة)',
            'لف جسم مهدئ للبشرة (40 دقيقة)',
            'فيشل ترطيب عميق (20 دقيقة)',
        ],
        price: '35 KWD',
    },
    {
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bb336078-1773907383325.png",
        alt: 'Hot stones massage package with sea salt scrub and body wrap',
        titleEn: 'Hot Stones Massage',
        titleAr: 'مساج الأحجار الساخنة',
        includesEn: [
            'Organic Sea Salt Scrub (20 min)',
            'Hot Stone Body Massage (50 min)',
        ],
        includesAr: [
            'صنفرة بملح البحر العضوي (20 دقيقة)',
            'مساج كامل بالأحجار الساخنة (50 دقيقة)',
        ],
        price: '28 KWD',
    },
    {
        image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bb336078-1773907383325.png",
        alt: 'Relaxing massage package with aromatherapy and body wrap',
        titleEn: 'Relaxing Massage',
        titleAr: 'مساج استرخائي شامل',
        includesEn: [
            'Aromatherapy Scrub (20 min)',
            'Full Body Relaxing Massage (50 min)',
        ],
        includesAr: [
            'صنفرة بالزيوت العطرية (20 دقيقة)',
            'مساج استرخائي لكامل الجسم (50 دقيقة)',
        ],
        price: '22 KWD',
    },
];

export default function PackagesSection() {
    const { isAr, t } = useApp();

    return (
        <section id="packages" className="py-24 bg-spa-pearl dark:bg-[#1E1917] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <div className="section-title mb-14 text-center">
                    <span className="section-id text-spa-rose block font-brush text-3xl sm:text-4xl mb-2">
                        {t('Packages', 'باقاتنا المميزة')}
                    </span>
                    <h2 className="font-lustria text-4xl md:text-5xl text-spa-text dark:text-[#EBE5DE] mb-4">
                        {t('Relax, Renew, Revitalize', 'استرخي، تجددي، واستعيدي حيويتك')}
                    </h2>
                    <p className="text-spa-muted dark:text-[#D3C0B1]/80 max-w-2xl mx-auto">
                        {t(
                            'Our carefully curated spa packages combine multiple treatments for a complete wellness experience at exceptional value.',
                            'تجمع باقات السبا المصممة بعناية بين علاجات متعددة لتمنحك تجربة عافية متكاملة وقيمة استثنائية.'
                        )}
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.titleEn}
                            className="package-card bg-white dark:bg-[#2A221E] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#D3C0B1]/30 dark:border-white/10 transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Image */}
                            <div className="overflow-hidden h-48">
                                <img
                                    src={pkg.image}
                                    alt={pkg.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            {/* Content */}
                            <div className="p-5 flex-grow flex flex-col justify-between">
                                <div className="mb-4">
                                    <h5 className="font-lustria text-lg text-spa-text dark:text-[#EBE5DE] mb-3 font-semibold">
                                        {isAr ? pkg.titleAr : pkg.titleEn}
                                    </h5>
                                    <ul className="flex flex-col gap-1.5">
                                        {(isAr ? pkg.includesAr : pkg.includesEn).map((item) => (
                                            <li
                                                key={item}
                                                className="text-spa-muted dark:text-[#D3C0B1]/75 text-sm flex items-start gap-2"
                                            >
                                                <span className="text-spa-rose mt-0.5 flex-shrink-0">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-spa-petal/60 dark:border-white/10 mt-auto">
                                    <span className="font-lustria text-xl font-bold text-spa-rose">
                                        {pkg.price}
                                    </span>
                                    <a
                                        href="#booking"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-spa-muted dark:text-[#D3C0B1] text-sm hover:text-spa-rose dark:hover:text-spa-rose transition-colors duration-300 font-medium inline-flex items-center gap-1"
                                    >
                                        <span>{t('Book Now', 'احجز الآن')}</span>
                                        <span>{isAr ? '←' : '→'}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
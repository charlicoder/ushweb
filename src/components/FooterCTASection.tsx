'use client';

import { useApp } from '@/context/AppContext';

export default function FooterCTASection() {
    const { t } = useApp();

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            className="relative py-24 text-center text-white bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80')`,
            }}
        >
            <div className="absolute inset-0 bg-spa-cherry/75 dark:bg-black/75 transition-colors duration-300" />
            <div className="relative z-10 max-w-3xl mx-auto px-4">
                <span className="font-brush text-4xl text-spa-petal opacity-80 block mb-2">
                    {t('Welcome to', 'مرحباً بكم في')}
                </span>
                <h3 className="font-lustria text-4xl md:text-5xl mb-4 leading-tight">
                    {t('USH Spa — Where Beauty Meets Wellness', 'أوش سبا — حيث يلتقي الجمال بالعافية')}
                </h3>
                <p className="text-lg opacity-90 mb-10 font-light leading-relaxed">
                    {t(
                        'Experience the transformative power of our expert treatments. Your journey to radiant beauty and deep relaxation begins with a single appointment.',
                        'اختبري القوة العلاجية لعلاجاتنا الاحترافية. رحلتك نحو الجمال المشرق والاسترخاء العميق تبدأ بحجز موعدك.'
                    )}
                </p>
                <button
                    onClick={() => handleScroll('#booking')}
                    className="btn-spa btn-tra-white text-base px-10 py-4 shadow-md hover:scale-105 transition-transform"
                >
                    {t('Book an Appointment', 'احجزي موعداً الآن')}
                </button>
            </div>
        </section>
    );
}


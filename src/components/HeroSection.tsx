'use client';

import { useApp } from '@/context/AppContext';

export default function HeroSection() {
    const { isAr } = useApp();

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('/images/hero-2.jpg')`,
                backgroundPosition: 'center center',
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/45 dark:bg-black/60 transition-colors" />

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-24 pb-32">
                <span className="font-brush text-4xl text-spa-petal opacity-85 block mb-2">
                    {isAr ? 'أهلاً بكم في' : 'Welcome to'}
                </span>
                <h1
                    className="font-lustria text-4xl sm:text-5xl md:text-7xl font-bold tracking-wide leading-tight mb-6"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}
                >
                    {isAr ? (
                        <>
                            جددي جمالكِ وتألقكِ،
                            <br />
                            <span className="text-spa-rose">وأعيدي الحيوية لروحكِ</span>
                        </>
                    ) : (
                        <>
                            Revitalize Your Beauty,
                            <br />
                            <span className="text-spa-rose">Revitalize Your Soul</span>
                        </>
                    )}
                </h1>
                <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl mx-auto opacity-90 px-4">
                    {isAr
                        ? 'استمتعي بأرقى تجارب السبا الفاخرة في معهد أوش سبا الصحي للنساء. من جلسات التدليك التايلاندي العلاجي إلى العناية الملكية بالبشرة، نصمم لكِ رحلة استرخاء استثنائية لجسدكِ وروحكِ.'
                        : 'Experience the ultimate in luxury spa treatments at USH Spa. From rejuvenating massages to transformative skincare, we craft personalized wellness journeys for your body and mind.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => handleScroll('#booking')}
                        className="btn-spa btn-rose text-base px-8 py-4 shadow-lg hover:shadow-xl"
                    >
                        {isAr ? 'حجز موعد الآن' : 'Book an Appointment'}
                    </button>
                    <button
                        onClick={() => handleScroll('#services')}
                        className="btn-spa btn-tra-white text-base px-8 py-4"
                    >
                        {isAr ? 'استكشاف الخدمات' : 'Explore Services'}
                    </button>
                </div>
            </div>

            {/* Bottom wave transition */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
                        className="fill-[#faf7f5] dark:fill-[#1c1512] transition-colors duration-300"
                    />
                </svg>
            </div>
        </section>
    );
}

'use client';

import { useApp } from '@/context/AppContext';

export default function OpenHoursSection() {
    const { isAr } = useApp();

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const hours = [
        {
            dayEn: 'Monday – Thursday',
            dayAr: 'من الإثنين إلى الخميس',
            timeEn: '10:00 AM – 10:00 PM',
            timeAr: '10:00 ص – 10:00 م',
        },
        {
            dayEn: 'Friday',
            dayAr: 'الجمعة',
            timeEn: '1:00 PM – 10:00 PM',
            timeAr: '1:00 م – 10:00 م',
        },
        {
            dayEn: 'Saturday – Sunday',
            dayAr: 'السبت والأحد',
            timeEn: '10:00 AM – 10:00 PM',
            timeAr: '10:00 ص – 10:00 م',
        },
    ];

    return (
        <section id="hours" className="py-24 bg-white dark:bg-[#1a1310] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Hours */}
                    <div>
                        <h5 className="font-lustria text-2xl text-spa-rose mb-4">
                            {isAr ? 'أوقات العمل والاستقبال:' : 'Open Hours:'}
                        </h5>
                        <p className="text-spa-muted dark:text-[#b5a49c] leading-relaxed mb-8 transition-colors duration-300">
                            {isAr
                                ? 'نسعد باستقبالكِ في معهد كوايت أوش للسبا الصحي التايلاندي للنساء. نرحب بالزيارات المباشرة، ونوصي بالحجز المسبق لضمان توفير الغرفة والموعد المناسب لراحتكِ.'
                                : 'We welcome you to visit USH Spa during our operating hours. Walk-ins are welcome, but we recommend booking in advance to secure your preferred time slot.'}
                        </p>

                        <ul className="flex flex-col gap-4 mb-8">
                            {hours.map((item) => (
                                <li
                                    key={item.dayEn}
                                    className="flex justify-between items-center py-3 border-b border-spa-petal/60 dark:border-white/10"
                                >
                                    <span className="font-lustria text-spa-text dark:text-[#f7eee9] font-medium transition-colors duration-300">
                                        {isAr ? item.dayAr : item.dayEn}
                                    </span>
                                    <span className="text-spa-rose font-medium text-sm sm:text-base">
                                        {isAr ? item.timeAr : item.timeEn}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleScroll('#booking')}
                            className="btn-spa btn-rose shadow-md"
                        >
                            {isAr ? 'حجز موعد الآن' : 'Book Now'}
                        </button>
                    </div>

                    {/* Right: Image */}
                    <div className="relative">
                        <img
                            src="https://img.rocket.new/generatedImages/rocket_gen_img_132edc4a8-1772445380897.png"
                            alt="Serene spa reception area with warm lighting and floral arrangements"
                            className="w-full h-[450px] object-cover rounded-xl shadow-spa-lg"
                        />
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-spa-petal rounded-full opacity-60 pointer-events-none" />
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-spa-rose rounded-full opacity-40 pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useApp } from '@/context/AppContext';

interface GiftCard {
    titleEn: string;
    titleAr: string;
    discount: string;
    descEn: string;
    descAr: string;
}

const giftCards: GiftCard[] = [
    {
        titleEn: 'Relaxation Package',
        titleAr: 'باقة الاسترخاء الشاملة',
        discount: '-25%',
        descEn: 'Swedish massage + facial treatment combo',
        descAr: 'مساج سويدي مهدئ للأعصاب + جلسة نضارة متكاملة للبشرة',
    },
    {
        titleEn: 'Deep Tissue Massage',
        titleAr: 'مساج الأنسجة العميقة',
        discount: '-30%',
        descEn: 'Full body deep tissue massage session',
        descAr: 'جلسة تدليك علاجي عميق لكامل الجسم لإزالة تقلصات العضلات والإجهاد',
    },
    {
        titleEn: 'Aromatherapy Facial',
        titleAr: 'جلسة الوجه العطرية الفاخرة',
        discount: '-12%',
        descEn: 'Premium aromatherapy facial treatment',
        descAr: 'عناية مركزة بالبشرة باستخدام أرقى الزيوت العطرية الطبيعية',
    },
];

export default function GiftCardsSection() {
    const { isAr } = useApp();

    return (
        <section id="gift-cards" className="py-24 bg-white dark:bg-[#1a1310] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div>
                        <div className="section-title text-left rtl:text-right mb-10">
                            <span className="section-id text-spa-rose">
                                {isAr ? 'قسائم الهدايا' : 'Gift Cards'}
                            </span>
                            <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-4 transition-colors duration-300">
                                {isAr ? 'شاركي من تحبين لحظات الدلال' : 'Experience Life With Color'}
                            </h2>
                            <p className="text-spa-muted dark:text-[#b5a49c] leading-relaxed transition-colors duration-300">
                                {isAr
                                    ? 'أهدي من تعزين تجربة استجمام مميزة ودلالاً استثنائياً. قسائم وبطاقات هدايا معهد أوش سبا الصحي هي الهدية الأرقى للتعبير عن المحبة والامتنان.'
                                    : 'Give the gift of relaxation and beauty. Our gift cards are the perfect way to share the USH Spa experience with someone special.'}
                            </p>
                        </div>

                        {/* Gift Card List */}
                        <div className="flex flex-col gap-4">
                            {giftCards.map((card) => (
                                <a
                                    key={card.titleEn}
                                    href="/gift-voucher"
                                    className="flex items-center justify-between p-5 border border-spa-petal/80 dark:border-white/10 rounded-lg hover:border-spa-rose dark:hover:border-spa-rose hover:bg-spa-blush dark:hover:bg-[#251b17] transition-all duration-300 group"
                                >
                                    <div>
                                        <h5 className="font-lustria text-lg text-spa-text dark:text-[#f7eee9] group-hover:text-spa-rose transition-colors duration-300">
                                            {isAr ? card.titleAr : card.titleEn}
                                        </h5>
                                        <p className="text-spa-muted dark:text-[#b5a49c] text-sm mt-1">
                                            {isAr ? card.descAr : card.descEn}
                                        </p>
                                    </div>
                                    <span className="text-spa-rose font-lustria text-xl font-bold ml-4 rtl:mr-4 rtl:ml-0 flex-shrink-0">
                                        {card.discount}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1716893917077-5b320c1ecfec"
                            alt="Beautifully wrapped spa gift card with rose petals and ribbon"
                            className="w-full h-[500px] object-cover rounded-lg shadow-spa-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-spa-cherry/20 to-transparent rounded-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
}
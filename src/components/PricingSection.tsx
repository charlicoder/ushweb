'use client';

import { useApp } from '@/context/AppContext';

interface PriceItem {
    nameEn: string;
    nameAr: string;
    durationEn: string;
    durationAr: string;
    price: string;
}

const massages: PriceItem[] = [
    { nameEn: 'Traditional Thai Massage', nameAr: 'المساج التايلاندي التقليدي', durationEn: '60 Minute Session', durationAr: 'جلسة 60 دقيقة', price: '20 KD' },
    { nameEn: 'Swedish Massage', nameAr: 'المساج السويدي المهدئ', durationEn: '50 Minute Session', durationAr: 'جلسة 50 دقيقة', price: '18 KD' },
    { nameEn: 'Combination Massage', nameAr: 'المساج المزدوج المتكامل', durationEn: '60 Minute Session', durationAr: 'جلسة 60 دقيقة', price: '22 KD' },
    { nameEn: 'Deep Tissue Massage', nameAr: 'مساج الأنسجة العميقة', durationEn: '60 Minute Session', durationAr: 'جلسة 60 دقيقة', price: '22 KD' },
    { nameEn: 'Hot Stone Therapy', nameAr: 'مساج الأحجار البركانية الساخنة', durationEn: '75 Minute Session', durationAr: 'جلسة 75 دقيقة', price: '26 KD' },
];

const treatments: PriceItem[] = [
    { nameEn: 'Aromatherapy Treatment', nameAr: 'جلسة الزيوت العطرية النقية', durationEn: '50 Minute Session', durationAr: 'جلسة 50 دقيقة', price: '20 KD' },
    { nameEn: 'Supreme Skincare Facial', nameAr: 'العناية الملكية بالبشرة', durationEn: '60 Minute Session', durationAr: 'جلسة 60 دقيقة', price: '28 KD' },
    { nameEn: 'Calming Hydration Facial', nameAr: 'ترطيب وتلطيف الوجه المكثف', durationEn: '50 Minute Session', durationAr: 'جلسة 50 دقيقة', price: '24 KD' },
    { nameEn: 'Organic Body Scrub & Polish', nameAr: 'تقشير وصنفرة الجسم العضوية', durationEn: '45 Minute Session', durationAr: 'جلسة 45 دقيقة', price: '22 KD' },
    { nameEn: 'Herbal Body Wrap & Detox', nameAr: 'لفافات الأعشاب لإزالة السموم', durationEn: '60 Minute Session', durationAr: 'جلسة 60 دقيقة', price: '25 KD' },
];

function PriceList({ items, isAr }: { items: PriceItem[]; isAr: boolean }) {
    return (
        <ul className="pricing-list">
            {items.map((item) => (
                <li key={item.nameEn} className="flex items-start justify-between py-4 border-b border-dashed border-spa-petal/60 dark:border-white/10">
                    <div className="flex-1">
                        <h5 className="font-lustria text-base text-spa-text dark:text-[#f7eee9] mb-1 font-semibold transition-colors duration-300">
                            {isAr ? item.nameAr : item.nameEn}
                        </h5>
                        <p className="text-spa-muted dark:text-[#b5a49c] text-xs transition-colors duration-300">
                            {isAr ? item.durationAr : item.durationEn}
                        </p>
                    </div>
                    <h4 className="font-lustria text-lg sm:text-xl text-spa-rose font-bold ml-4 rtl:mr-4 rtl:ml-0 flex-shrink-0">
                        {item.price}
                    </h4>
                </li>
            ))}
        </ul>
    );
}

export default function PricingSection() {
    const { isAr } = useApp();

    return (
        <section id="pricing" className="py-24 bg-spa-pearl dark:bg-[#16100d] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <div className="section-title mb-14 text-center">
                    <span className="section-id text-spa-rose">
                        {isAr ? 'قائمة الأسعار' : 'Pricing'}
                    </span>
                    <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-4 transition-colors duration-300">
                        {isAr ? 'أسعار واضحة وباقات مدروسة' : 'Transparent Pricing'}
                    </h2>
                    <p className="text-spa-muted dark:text-[#b5a49c] max-w-2xl mx-auto transition-colors duration-300">
                        {isAr
                            ? 'نلتزم بالوضوح والشفافية التامة دون أي رسوم إضافية خفية. تشمل جميع جلساتنا الاستشارة الفردية والضيافة الفاخرة والعناية الفائقة.'
                            : 'We believe in honest, transparent pricing with no hidden fees. All prices include personal consultation, treatment, and aftercare advice.'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Massages */}
                    <div className="bg-white dark:bg-[#231a16] p-6 sm:p-8 rounded-xl shadow-spa border border-spa-petal/40 dark:border-white/10 transition-colors duration-300">
                        <h3 className="font-lustria text-xl sm:text-2xl text-spa-text dark:text-[#f7eee9] mb-6 pb-4 border-b border-spa-petal/60 dark:border-white/10 font-bold transition-colors duration-300">
                            {isAr ? 'جلسات التدليك والمساج' : 'Massages'}
                        </h3>
                        <PriceList items={massages} isAr={isAr} />
                    </div>

                    {/* Treatments */}
                    <div className="bg-white dark:bg-[#231a16] p-6 sm:p-8 rounded-xl shadow-spa border border-spa-petal/40 dark:border-white/10 transition-colors duration-300">
                        <h3 className="font-lustria text-xl sm:text-2xl text-spa-text dark:text-[#f7eee9] mb-6 pb-4 border-b border-spa-petal/60 dark:border-white/10 font-bold transition-colors duration-300">
                            {isAr ? 'علاجات البشرة والجسم' : 'Treatments'}
                        </h3>
                        <PriceList items={treatments} isAr={isAr} />
                    </div>
                </div>
            </div>
        </section>
    );
}

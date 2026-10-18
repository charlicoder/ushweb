'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface GalleryItem {
    src: string;
    alt: string;
    titleEn: string;
    titleAr: string;
    categoryKey: string;
    categoryEn: string;
    categoryAr: string;
}

const galleryItems: GalleryItem[] = [
    {
        src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
        alt: 'Client receiving a relaxing full-body massage at USH Spa',
        titleEn: 'Relaxing Massage',
        titleAr: 'تدليك استرخائي ملكي',
        categoryKey: 'spa_wellness',
        categoryEn: 'SPA & Wellness',
        categoryAr: 'السبا والعافية',
    },
    {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1412db922-1772488337954.png',
        alt: 'Aromatherapy treatment with essential oils and candles',
        titleEn: 'Aromatherapy',
        titleAr: 'علاجات الروائح العطرية',
        categoryKey: 'aroma_skin',
        categoryEn: 'Aroma & Skin Care',
        categoryAr: 'العطور ونضارة البشرة',
    },
    {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1659097b4-1767312782153.png',
        alt: 'Deep tissue massage therapy session',
        titleEn: 'Deep Tissue Massage',
        titleAr: 'تدليك الأنسجة العميقة',
        categoryKey: 'massage',
        categoryEn: 'SPA & Massage Therapy',
        categoryAr: 'التدليك العلاجي',
    },
    {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a861e5eb-1764905106158.png',
        alt: 'Facial treatment with natural skincare products',
        titleEn: 'Supreme Skincare',
        titleAr: 'العناية الفائقة بالبشرة',
        categoryKey: 'aroma_skin',
        categoryEn: 'Aroma & Skin Care',
        categoryAr: 'العطور ونضارة البشرة',
    },
    {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_19ab11eae-1785421948742.png',
        alt: 'Hot stone massage therapy with volcanic stones',
        titleEn: 'Hot Stones Therapy',
        titleAr: 'علاج الأحجار البركانية الساخنة',
        categoryKey: 'massage',
        categoryEn: 'SPA & Massage Therapy',
        categoryAr: 'التدليك العلاجي',
    },
    {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_10e65110a-1768849367647.png',
        alt: 'Thai massage stretching and pressure point therapy',
        titleEn: 'Thai Massage',
        titleAr: 'المساج التايلاندي التقليدي',
        categoryKey: 'herbs_skin',
        categoryEn: 'Herbs & Skin Care',
        categoryAr: 'الأعشاب والعناية',
    },
    {
        src: 'https://images.unsplash.com/photo-1672883562106-5e6aea8ebc3b',
        alt: 'Body scrub treatment with sea salt and essential oils',
        titleEn: 'Scrub Treatment',
        titleAr: 'جلسة تقشير وتنعيم الجسم',
        categoryKey: 'massage',
        categoryEn: 'SPA & Massage Therapy',
        categoryAr: 'التدليك العلاجي',
    },
    {
        src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b73f4754-1772703715205.png',
        alt: 'Luxury spa suite with rose petals and candles',
        titleEn: 'Luxury Suite',
        titleAr: 'أجنحة السبا الملكية',
        categoryKey: 'spa_wellness',
        categoryEn: 'SPA & Wellness',
        categoryAr: 'السبا والعافية',
    },
];

const filterCategories = [
    { key: 'all', labelEn: 'All', labelAr: 'الكل' },
    { key: 'spa_wellness', labelEn: 'SPA & Wellness', labelAr: 'السبا والعافية' },
    { key: 'aroma_skin', labelEn: 'Aroma & Skin Care', labelAr: 'العطور ونضارة البشرة' },
    { key: 'massage', labelEn: 'Massage Therapy', labelAr: 'التدليك العلاجي' },
    { key: 'herbs_skin', labelEn: 'Herbs & Care', labelAr: 'الأعشاب والعناية' },
];

export default function GallerySection() {
    const { isAr } = useApp();
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all'
        ? galleryItems
        : galleryItems.filter((item) => item.categoryKey === activeFilter);

    return (
        <section id="gallery" className="py-24 bg-spa-cream dark:bg-[#17110e] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <div className="section-title mb-12 text-center">
                    <span className="section-id text-spa-rose">
                        {isAr ? 'معرض الصور' : 'Our Gallery'}
                    </span>
                    <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-4 transition-colors duration-300">
                        {isAr ? 'جمال بشرتكِ وراحتكِ تبدأ هنا' : 'Beautiful Skin Starts Here'}
                    </h2>
                    <p className="text-spa-muted dark:text-[#b5a49c] max-w-2xl mx-auto transition-colors duration-300">
                        {isAr
                            ? 'ألقي نظرة على أجنحتنا الملكية الهادئة ولمحات من تجارب الاسترخاء والعناية الطبيعية في معهد أوش سبا الصحي.'
                            : 'Explore our gallery of transformative spa experiences and discover the art of natural beauty at USH Spa.'}
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {filterCategories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveFilter(cat.key)}
                            className={`font-lustria text-sm sm:text-base px-4 py-2 border-b-2 transition-all duration-300 bg-transparent ${
                                activeFilter === cat.key
                                    ? 'text-spa-rose border-spa-rose font-bold'
                                    : 'text-spa-muted dark:text-[#b5a49c] border-transparent hover:text-spa-text dark:hover:text-white'
                            }`}
                        >
                            {isAr ? cat.labelAr : cat.labelEn}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((item, idx) => (
                        <div key={idx} className="gallery-item h-56 cursor-pointer rounded-lg overflow-hidden relative group">
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="item-overlay" />
                            <div className="image-description">
                                <div className="image-data px-4">
                                    <h6 className="font-lustria text-white text-sm font-bold mb-1">
                                        {isAr ? item.titleAr : item.titleEn}
                                    </h6>
                                    <p className="text-white/85 text-xs">
                                        {isAr ? item.categoryAr : item.categoryEn}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
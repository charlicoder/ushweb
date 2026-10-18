'use client';

import { useApp } from '@/context/AppContext';

interface FeatureItem {
    id: string;
    iconClass: string;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
}

const features: FeatureItem[] = [
    {
        id: 'f1',
        iconClass: 'flaticon-relax-stones',
        titleEn: 'Safety & Hygiene Standards',
        titleAr: 'أعلى معايير النظافة والتعقيم',
        descEn: 'Hospital-grade sanitization protocols and single-use supplies ensuring maximum safety, comfort and privacy for every guest.',
        descAr: 'بروتوكولات تعقيم طبية متقدمة ومستلزمات فردية ذات استخدام لمرة واحدة لضمان أعلى درجات الأمان والراحة والخصوصية التامة.',
    },
    {
        id: 'f2',
        iconClass: 'flaticon-mortar',
        titleEn: 'Holistic Wellness Programs',
        titleAr: 'برامج صحية واستجمامية شاملة',
        descEn: 'Personalized wellness journeys combining Thai herbal therapy, acupressure and organic essential oils to restore vitality.',
        descAr: 'جلسات استجمام متكاملة تجمع بين العلاج بالأعشاب التايلاندية ونقاط الضغط والزيوت العطرية العضوية لاستعادة النشاط والحيوية.',
    },
    {
        id: 'f3',
        iconClass: 'flaticon-gift',
        titleEn: 'Luxury Gift Vouchers',
        titleAr: 'قسائم إهداء فاخرة',
        descEn: 'Give the memorable gift of relaxation with our customizable digital and physical presentation vouchers for someone special.',
        descAr: 'امنحي من تحبين هدية استرخاء لا تُنسى مع قسائم الإهداء الرقمية والفاخرة التي نوفرها مع إمكانية التخصيص وإضافة عبارات التهنئة.',
    },
];

export default function ExperienceSection() {
    const { isAr } = useApp();

    return (
        <section id="experience" className="bg-white dark:bg-[#201713] pt-20 pb-16 overflow-visible transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4">
                {/* ── Section Title ── */}
                <div className="text-center mb-12 relative">
                    <span
                        aria-hidden="true"
                        className="font-brush block leading-none select-none pointer-events-none"
                        style={{
                            fontSize: '5.5rem',
                            color: '#9a7570',
                            opacity: 0.13,
                            marginBottom: '-3.2rem',
                            letterSpacing: '3px',
                        }}
                    >
                        {isAr ? 'تجربة استثنائية' : 'Experience'}
                    </span>
                    <h2
                        className="font-lustria text-spa-text dark:text-[#f7eee9] relative z-10 mb-5 transition-colors duration-300"
                        style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '0.3px' }}
                    >
                        {isAr ? 'عيشي الطبيعة، وتألقي بجمالكِ الفطري' : 'Feel Natural, Be Natural'}
                    </h2>
                    <p
                        className="text-spa-muted dark:text-[#b5a49c] mx-auto leading-relaxed transition-colors duration-300"
                        style={{ fontSize: '0.97rem', maxWidth: '540px' }}
                    >
                        {isAr
                            ? 'واحة نسائية هادئة صُممت لتمنحكِ ملاذاً من صخب الحياة اليومية، حيث تلتقي التقاليد التايلاندية العريقة بأعلى مستويات الضيافة الفاخرة.'
                            : 'A peaceful sanctuary designed to offer you respite from daily bustle, where ancient Thai traditions harmonize with world-class wellness hospitality.'}
                    </p>
                </div>

                {/* ── Photo Mosaic Grid ── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.45fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '8px',
                        height: '420px',
                        marginBottom: '56px',
                    }}
                >
                    <div style={{ gridColumn: '1', gridRow: '1', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                            src="/images/gallery/img-1.jpg"
                            alt="Woman receiving relaxing back massage"
                            className="hover:scale-105 transition-transform duration-500"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div style={{ gridColumn: '2', gridRow: '1 / span 2', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                            src="/images/image-12.jpg"
                            alt="Client receiving luxury facial clay treatment"
                            className="hover:scale-105 transition-transform duration-500"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div style={{ gridColumn: '3', gridRow: '1', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                            src="/images/gallery/img-3.jpg"
                            alt="Aromatherapy oil being poured near candles"
                            className="hover:scale-105 transition-transform duration-500"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div style={{ gridColumn: '1', gridRow: '2', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                            src="/images/gallery/img-4.jpg"
                            alt="Natural spa soaps, herbs and towels on wooden tray"
                            className="hover:scale-105 transition-transform duration-500"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    <div style={{ gridColumn: '3', gridRow: '2', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                            src="/images/gallery/img-5.jpg"
                            alt="Woman with towel receiving face massage"
                            className="hover:scale-105 transition-transform duration-500"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                </div>

                {/* ── Feature Items Row ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-4">
                            <div
                                className="flex-shrink-0 flex items-center justify-center rounded-full ico-50 bg-[#f7f4f0] dark:bg-[#2d211c] text-[#efa697] transition-colors duration-300"
                                style={{
                                    width: '68px',
                                    height: '68px',
                                }}
                            >
                                <span className={feature.iconClass} />
                            </div>

                            <div>
                                <h5
                                    className="font-lustria text-spa-text dark:text-[#f7eee9] mb-2 transition-colors duration-300"
                                    style={{ fontSize: '1.05rem', fontWeight: 700 }}
                                >
                                    {isAr ? feature.titleAr : feature.titleEn}
                                </h5>
                                <p
                                    className="text-spa-muted dark:text-[#b5a49c] leading-relaxed transition-colors duration-300"
                                    style={{ fontSize: '0.875rem' }}
                                >
                                    {isAr ? feature.descAr : feature.descEn}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

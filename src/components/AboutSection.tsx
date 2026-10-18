'use client';

import { useApp } from '@/context/AppContext';

export default function AboutSection() {
    const { isAr } = useApp();

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="about"
            className="bg-[#ece9e5] dark:bg-[#1a1310] transition-colors duration-300 relative z-10 overflow-visible"
        >
            <div className="max-w-7xl mx-auto overflow-visible">
                <div
                    className="grid lg:grid-cols-[55%_45%] items-center"
                    style={{ minHeight: '380px', overflow: 'visible' }}
                >
                    {/* ── Left: Image — overflows top and bottom of section boundary ── */}
                    <div
                        className="relative my-[-40px] sm:my-[-80px] flex items-center justify-center px-4"
                    >
                        <img
                            src="/images/image-03.png"
                            alt="USH Spa beauty products — himalayan salt bowl, white towels and floral decor"
                            style={{
                                width: '100%',
                                maxHeight: '560px',
                                objectFit: 'contain',
                                objectPosition: 'center',
                                display: 'block',
                            }}
                        />
                    </div>

                    {/* ── Right: Text ── */}
                    <div className="py-16 px-6 sm:px-12 lg:pl-4">
                        <div className="inline-block text-xs uppercase tracking-widest text-spa-cherry dark:text-spa-rose font-semibold mb-2">
                            {isAr
                                ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                                : 'Quiet Ush Thai Spa Health Institute for Women'}
                        </div>
                        <h2
                            className="font-lustria leading-snug mb-5 text-[#727475] dark:text-[#f7eee9] transition-colors duration-300"
                            style={{
                                fontSize: '2.1rem',
                                fontWeight: 700,
                                letterSpacing: '0.3px',
                            }}
                        >
                            {isAr ? (
                                <>
                                    جمالكِ وعافيتكِ
                                    <br />
                                    تبدأ من هنا
                                </>
                            ) : (
                                <>
                                    Your Beauty And
                                    <br />
                                    Wellness Starts Here
                                </>
                            )}
                        </h2>

                        <p
                            className="text-spa-muted dark:text-[#b5a49c] leading-relaxed mb-8 transition-colors duration-300"
                            style={{ fontSize: '0.92rem', maxWidth: '460px' }}
                        >
                            {isAr ? (
                                <>
                                    يعتبر <strong className="text-spa-text dark:text-white">معهد كوايت أوش للسبا الصحي التايلاندي للنساء</strong> (USH Spa)
                                    الوجهة الرائدة الأولى في دولة الكويت المكرسة لسكينة المرأة وتجديد حيويتها ونشاطها. استمتعي بجلسات التدليك العلاجي التايلاندي الأصيل،
                                    والعناية الفائقة بنضارة البشرة، والعلاج بالروائح العطرية الطبيعية في بيئة هادئة وراقية تلبي أعلى معايير الخصوصية والفخامة.
                                </>
                            ) : (
                                <>
                                    <strong className="text-spa-text dark:text-white">Quiet Ush Thai Spa Health Institute for Women</strong> (USH Spa)
                                    is Kuwait&apos;s premier institute dedicated to women&apos;s tranquility and vitality. Experience authentic Thai therapeutic massage,
                                    rejuvenating skincare, and restorative aromatherapy in a serene, luxurious atmosphere.
                                </>
                            )}
                        </p>

                        <button
                            onClick={() => handleScroll('#services')}
                            className="btn-spa btn-rose shadow-md"
                            style={{ fontSize: '0.82rem', padding: '11px 32px', letterSpacing: '0.5px' }}
                        >
                            {isAr ? 'اكتشفي المزيد' : 'Read More'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
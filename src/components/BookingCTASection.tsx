'use client';

import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF } from '@/lib/contact';
import { useApp } from '@/context/AppContext';

export default function BookingCTASection() {
    const { isAr } = useApp();

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="booking-cta"
            className="overflow-hidden bg-[#faf7f4] dark:bg-[#1c1512] transition-colors duration-300"
            style={{ minHeight: '420px' }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '420px' }}>
                {/* ── Left: Cream panel with botanical watermark ── */}
                <div
                    className="relative flex items-center justify-end overflow-hidden px-8 sm:px-12 py-16"
                >
                    {/* Subtle botanical watermark */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none select-none opacity-30 dark:opacity-10"
                        style={{
                            backgroundImage: `url('/images/sbox-bg-pink.png')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center right',
                            backgroundSize: 'contain',
                        }}
                    />

                    {/* Text content */}
                    <div className="relative z-10 max-w-lg">
                        <h2
                            className="font-lustria leading-snug mb-6 text-[#727475] dark:text-[#f7eee9] transition-colors duration-300"
                            style={{
                                fontSize: '2.35rem',
                                fontWeight: 700,
                                letterSpacing: '0.3px',
                                lineHeight: 1.25,
                            }}
                        >
                            {isAr ? (
                                <>
                                    ترغبين في حجز موعد
                                    <br />
                                    أو لديكِ أي استفسار؟
                                </>
                            ) : (
                                <>
                                    Want to Make a
                                    <br />
                                    Booking or Have a
                                    <br />
                                    Question?
                                </>
                            )}
                        </h2>

                        <p
                            className="text-spa-muted dark:text-[#b5a49c] mb-8 leading-relaxed transition-colors duration-300"
                            style={{ fontSize: '0.92rem', maxWidth: '420px' }}
                        >
                            {isAr ? (
                                <>
                                    اتصلي بنا مباشرة على:{' '}
                                    <a
                                        href={USH_PHONE_TEL_HREF}
                                        className="font-bold hover:text-spa-rose transition-colors duration-300 text-[#4a4a4a] dark:text-white"
                                        style={{ fontWeight: 700 }}
                                    >
                                        {USH_PHONE_DISPLAY}
                                    </a>{' '}
                                    أو تفضلي بتعبئة نموذج الحجز وسيتواصل معكِ فريق الكونسيرج لتأكيد موعدكِ.
                                </>
                            ) : (
                                <>
                                    Call us :{' '}
                                    <a
                                        href={USH_PHONE_TEL_HREF}
                                        className="font-bold hover:text-spa-rose transition-colors duration-300 text-[#4a4a4a] dark:text-white"
                                        style={{ fontWeight: 700 }}
                                    >
                                        {USH_PHONE_DISPLAY}
                                    </a>{' '}
                                    or fill out our online booking &amp; enquiry form and we will contact you.
                                </>
                            )}
                        </p>

                        <button
                            onClick={() => handleScroll('#booking')}
                            className="btn-spa btn-rose shadow-md"
                            style={{ fontSize: '0.82rem', padding: '11px 30px', letterSpacing: '0.5px' }}
                        >
                            {isAr ? 'حجز موعد الآن' : 'Make an Appointment'}
                        </button>
                    </div>
                </div>

                {/* ── Right: Spa facial image ── */}
                <div className="relative overflow-hidden min-h-[340px] lg:min-h-[420px]">
                    <img
                        src="/images/image-04.jpg"
                        alt="Client receiving a relaxing facial spa treatment"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            display: 'block',
                            position: 'absolute',
                            inset: 0,
                        }}
                    />
                </div>
            </div>
        </section>
    );
}

'use client';

import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF } from '@/lib/contact';

export default function BookingCTASection() {
    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="booking-cta"
            className="overflow-hidden"
            style={{ minHeight: '420px' }}
        >
            {/* Full-width 50/50 split — no container, image bleeds to right edge */}
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '420px' }}>

                {/* ── Left: Cream panel with botanical watermark ── */}
                <div
                    className="relative flex items-center justify-end overflow-hidden"
                    style={{ backgroundColor: '#faf7f4' }}
                >
                    {/* Subtle botanical watermark */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none select-none"
                        style={{
                            backgroundImage: `url('/images/sbox-bg-pink.png')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center right',
                            backgroundSize: 'contain',
                            opacity: 0.35,
                        }}
                    />

                    {/* Text content */}
                    <div className="relative z-10 px-12 py-16 max-w-lg">
                        <h2
                            className="font-lustria leading-snug mb-6"
                            style={{
                                fontSize: '2.35rem',
                                fontWeight: 700,
                                color: '#727475',
                                letterSpacing: '0.3px',
                                lineHeight: 1.25,
                            }}
                        >
                            Want to Make a<br />
                            Booking or Have a<br />
                            Question?
                        </h2>

                        <p
                            className="text-spa-muted mb-8 leading-relaxed"
                            style={{ fontSize: '0.92rem', maxWidth: '380px' }}
                        >
                            Call us :{' '}
                            <a
                                href={USH_PHONE_TEL_HREF}
                                className="font-bold hover:text-spa-rose transition-colors duration-300"
                                style={{ color: '#4a4a4a', fontWeight: 700 }}
                            >
                                {USH_PHONE_DISPLAY}
                            </a>{' '}
                            or fill out our online booking &amp; enquiry form and we will contact you
                        </p>

                        <button
                            onClick={() => handleScroll('#booking')}
                            className="btn-spa btn-rose"
                            style={{ fontSize: '0.82rem', padding: '11px 30px', letterSpacing: '0.5px' }}
                        >
                            Make an Appointment
                        </button>
                    </div>
                </div>

                {/* ── Right: Spa facial image — fills full height, no padding ── */}
                <div className="relative overflow-hidden" style={{ minHeight: '420px' }}>
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

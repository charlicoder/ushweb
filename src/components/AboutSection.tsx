'use client';

export default function AboutSection() {
    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* ── About Banner ── */}
            <section
                id="about"
                style={{ backgroundColor: '#ece9e5', overflow: 'visible', position: 'relative', zIndex: 1 }}
            >
                <div className="max-w-7xl mx-auto" style={{ overflow: 'visible' }}>
                    <div
                        className="grid lg:grid-cols-[55%_45%] items-center"
                        style={{ minHeight: '380px', overflow: 'visible' }}
                    >
                        {/* ── Left: Image — overflows top and bottom of section boundary ── */}
                        <div
                            style={{
                                position: 'relative',
                                marginTop: '-80px',
                                marginBottom: '-80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src="/images/image-03.png"
                                alt="USH Spa beauty products — himalayan salt bowl, white towels and floral decor"
                                style={{
                                    width: '100%',
                                    height: '560px',
                                    objectFit: 'contain',
                                    objectPosition: 'center',
                                    display: 'block',
                                }}
                            />
                        </div>

                        {/* ── Right: Text ── */}
                        <div className="py-16 pr-12 pl-6 lg:pl-4">
                            <div className="inline-block text-xs uppercase tracking-widest text-spa-cherry font-semibold mb-2">
                                Quiet Ush Thai Spa Health Institute for Women
                            </div>
                            <h2
                                className="font-lustria leading-snug mb-5"
                                style={{
                                    fontSize: '2.1rem',
                                    fontWeight: 700,
                                    color: '#727475',
                                    letterSpacing: '0.3px',
                                }}
                            >
                                Your Beauty And<br />Wellness Starts Here
                            </h2>

                            <p
                                className="text-spa-muted leading-relaxed mb-8"
                                style={{ fontSize: '0.92rem', maxWidth: '460px' }}
                            >
                                <strong>Quiet Ush Thai Spa Health Institute for Women</strong> (USH Spa) is Kuwait&apos;s premier institute
                                dedicated to women&apos;s tranquility and vitality. Experience authentic Thai therapeutic massage,
                                rejuvenating skincare, and restorative aromatherapy in a serene, luxurious atmosphere.
                            </p>

                            <button
                                onClick={() => handleScroll('#services')}
                                className="btn-spa btn-rose"
                                style={{ fontSize: '0.82rem', padding: '11px 32px', letterSpacing: '0.5px' }}
                            >
                                Read More
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
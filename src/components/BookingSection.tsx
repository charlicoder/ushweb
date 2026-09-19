'use client';

import { useState } from 'react';

export default function BookingSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <section id="booking" className="py-24" style={{ backgroundColor: '#fdf8f6' }}>
            {/* Also serves as contact section */}
            <div id="contact" className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Info */}
                    <div>
                        <span className="section-id text-spa-rose">Book Now</span>
                        <h2 className="font-lustria text-4xl md:text-5xl text-spa-text mb-6 leading-tight">
                            Schedule Your Visit
                        </h2>
                        <p className="text-spa-muted leading-relaxed mb-8">
                            Ready to experience the ultimate in relaxation and beauty? Book your appointment
                            online or download our mobile app for the most convenient booking experience.
                        </p>

                        {/* App Download CTA */}
                        <div className="bg-white p-6 rounded-sm shadow-spa mb-8">
                            <h5 className="font-lustria text-lg text-spa-text mb-3">📱 Book via Our Mobile App</h5>
                            <p className="text-spa-muted text-sm leading-relaxed mb-4">
                                Download the USH Spa app for instant booking, exclusive offers, and personalized
                                wellness recommendations at your fingertips.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="https://apps.apple.com/us/app/ushspa/id6771279814"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-spa-text text-white px-4 py-2.5 rounded-sm hover:bg-spa-cherry transition-colors duration-300 text-sm font-medium"
                                >
                                    <span className="text-lg">🍎</span>
                                    App Store
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.spaush.ushspa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-spa-text text-white px-4 py-2.5 rounded-sm hover:bg-spa-cherry transition-colors duration-300 text-sm font-medium"
                                >
                                    {/* Google Play SVG icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M3.18 23.76c.3.17.64.24.99.2l12.37-11.88L13.48 9 3.18 23.76zM21.37 10.6l-2.79-1.6-3.44 3.31 3.44 3.3 2.8-1.6c.8-.46.8-1.95 0-2.41zM1.96.48C1.65.85 1.5 1.36 1.5 1.98v20.04c0 .62.15 1.13.47 1.5L13.06 12 1.96.48zM16.54 1.64 4.17.24c-.35-.04-.69.03-.99.2L13.48 9l3.06-7.36z"/>
                                    </svg>
                                    Google Play
                                </a>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-spa-muted">
                                <span className="text-spa-rose text-lg">📞</span>
                                <span>+965 900103335</span>
                            </div>
                            <div className="flex items-center gap-3 text-spa-muted">
                                <span className="text-spa-rose text-lg">✉️</span>
                                <span>info@ushspa.co</span>
                            </div>
                            <div className="flex items-center gap-3 text-spa-muted">
                                <span className="text-spa-rose text-lg">📍</span>
                                <span>Building 124 floor 5 office 10</span>
                                <span>USH SPA - Mangaf</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-white p-8 rounded-sm shadow-spa">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🌸</div>
                                <h4 className="font-lustria text-2xl text-spa-text mb-3">Booking Received!</h4>
                                <p className="text-spa-muted">
                                    Thank you for booking with USH Spa. We&apos;ll confirm your appointment within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-spa btn-rose mt-6"
                                >
                                    Book Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <h4 className="font-lustria text-xl text-spa-text mb-2">Appointment Request</h4>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-spa-muted text-sm mb-1.5">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your full name"
                                            className="w-full h-12 px-4 border border-spa-petal rounded-sm text-spa-text text-sm focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white"
                                        />
                                    </div>
                                     <div>
                                         <label className="block text-spa-muted text-sm mb-1.5">Email</label>
                                         <input
                                             type="email"
                                             name="email"
                                             value={formData.email}
                                             onChange={handleChange}
                                             placeholder="your@email.com"
                                             className="w-full h-12 px-4 border border-spa-petal rounded-sm text-spa-text text-sm focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white"
                                         />
                                    </div>
                                </div>

                                {/* Phone/WhatsApp — required */}
                                <div>
                                    <label className="block text-spa-muted text-sm mb-1.5">Phone / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+965 XXXX XXXX"
                                        className="w-full h-12 px-4 border border-spa-petal rounded-sm text-spa-text text-sm focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-spa-muted text-sm mb-1.5">Special Requests</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Any special requests or health considerations..."
                                        className="w-full px-4 py-3 border border-spa-petal rounded-sm text-spa-text text-sm focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white resize-none"
                                    />
                                </div>

                                <button type="submit" className="btn-spa btn-rose w-full text-base py-4 mt-2">
                                    Request Appointment
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}


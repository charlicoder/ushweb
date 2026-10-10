'use client';

import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF, USH_EMAIL_DISPLAY, USH_EMAIL_MAILTO_HREF } from '@/lib/contact';

import { useState } from 'react';
import AppDownloadButtons from '@/components/AppDownloadButtons';

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
                        <p className="text-spa-muted leading-relaxed mb-6">
                            <strong>Quiet Ush Thai Spa Health Institute for Women</strong> welcomes you to experience the ultimate in
                            relaxation and authentic wellness therapies. Book your appointment online or download our mobile app for instant reservations.
                        </p>

                        {/* App Download CTA */}
                        <div className="bg-white p-6 rounded-sm shadow-spa mb-8">
                            <h5 className="font-lustria text-lg text-spa-text mb-2">📱 Book via Our Mobile App</h5>
                            <p className="text-spa-muted text-sm leading-relaxed mb-4">
                                Download the USH Spa app for instant booking, exclusive offers, and personalized
                                wellness recommendations at your fingertips.
                            </p>
                            <AppDownloadButtons />
                        </div>

                        {/* Contact & Legal Entity Info */}
                        <div className="flex flex-col gap-3.5 bg-spa-cream/40 p-5 rounded-md border border-spa-petal/50">
                            <div>
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry block mb-0.5">
                                    Legal Business Entity
                                </span>
                                <h6 className="font-lustria font-bold text-spa-text text-base leading-snug">
                                    Quiet Ush Thai Spa Health Institute for Women
                                </h6>
                                <p className="text-xs text-spa-muted">Operating as USH Spa</p>
                            </div>
                            <div className="flex items-center gap-3 text-spa-muted text-sm">
                                <span className="text-spa-rose text-lg">📞</span>
                                <a href={USH_PHONE_TEL_HREF} className="hover:text-spa-cherry font-medium transition-colors">
                                    {USH_PHONE_DISPLAY}
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-spa-muted text-sm">
                                <span className="text-spa-rose text-lg">✉️</span>
                                <a href={USH_EMAIL_MAILTO_HREF} className="hover:text-spa-cherry font-medium transition-colors">
                                    {USH_EMAIL_DISPLAY}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-spa-muted text-sm">
                                <span className="text-spa-rose text-lg mt-0.5">📍</span>
                                <div>
                                    <p className="font-medium text-spa-text">Al-Shuhada Street</p>
                                    <p>Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman</p>
                                    <p>Kuwait city, Sharq 15300, Kuwait</p>
                                </div>
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


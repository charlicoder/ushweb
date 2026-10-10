'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppDownloadButtons from '@/components/AppDownloadButtons';
import { USH_PHONE_DISPLAY, USH_PHONE_E164, USH_PHONE_TEL_HREF, USH_EMAIL_DISPLAY, USH_EMAIL_MAILTO_HREF } from '@/lib/contact';

export default function ContactUsClient() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Thai Massage Therapy',
    message: '',
  });

  const copyEmail = () => {
    navigator.clipboard.writeText(USH_EMAIL_DISPLAY);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(USH_PHONE_E164);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] text-spa-text antialiased">
      {/* Global Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#f2ece7] via-[#faf7f5] to-[#faf7f5] border-b border-spa-petal/40 overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-spa-rose/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-spa-petal/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-spa-petal text-spa-cherry text-xs font-semibold tracking-wider uppercase mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-spa-rose animate-pulse" />
            Official Business Contact
          </div>

          <h1 className="font-lustria text-3xl sm:text-5xl md:text-6xl text-spa-text mb-4 leading-tight">
            Contact USH Spa
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-spa-cherry font-medium text-sm sm:text-base mb-2">
              Quiet Ush Thai Spa Health Institute for Women
            </p>
            <p className="text-spa-muted text-sm sm:text-base leading-relaxed">
              We welcome you to Kuwait&apos;s premier institute for authentic Thai therapy, luxury skincare,
              and rejuvenating body wellness. Get in touch with our concierge team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* 4 Contact Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Address */}
          <div className="bg-white rounded-xl p-6 border border-spa-petal/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream flex items-center justify-center text-2xl text-spa-cherry mb-4">
                📍
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry block mb-1">
                Official Location
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text mb-2">
                Business Address
              </h3>
              <p className="text-xs font-semibold text-spa-text mb-1">
                Quiet Ush Thai Spa Health Institute for Women
              </p>
              <address className="not-italic text-xs text-spa-muted leading-relaxed mb-4">
                Al-Shuhada Street<br />
                Block 04, Building 32<br />
                Nasser Ahmed Abdul Latif Al-Othman<br />
                Kuwait city, Sharq 15300<br />
                State of Kuwait
              </address>
            </div>
            <a
              href="https://maps.google.com/?q=Al-Shuhada+Street,+Sharq,+Kuwait+City"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-spa-cherry hover:text-spa-rose transition-colors py-2 px-3 rounded-lg bg-spa-cream/60 hover:bg-spa-cream"
            >
              Open in Maps →
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white rounded-xl p-6 border border-spa-petal/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream flex items-center justify-center text-2xl text-spa-cherry mb-4">
                📞
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry block mb-1">
                Telephone &amp; WhatsApp
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text mb-2">
                Phone Number
              </h3>
              <p className="text-xs text-spa-muted mb-2">
                Direct bookings, concierge assistance, and guest inquiries:
              </p>
              <p className="text-base font-bold text-spa-text font-mono mb-4">
                {USH_PHONE_DISPLAY}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={USH_PHONE_TEL_HREF}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium !text-white hover:!text-white bg-spa-text hover:bg-spa-cherry transition-colors py-2 px-3 rounded-lg"
              >
                Call {USH_PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={copyPhone}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-spa-muted hover:text-spa-text py-1.5 px-3 rounded-lg border border-spa-petal/70 hover:border-spa-rose transition-colors"
              >
                {copiedPhone ? '✓ Number Copied' : 'Copy Phone Number'}
              </button>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white rounded-xl p-6 border border-spa-petal/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream flex items-center justify-center text-2xl text-spa-cherry mb-4">
                ✉️
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry block mb-1">
                Written Support
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text mb-2">
                Email Address
              </h3>
              <p className="text-xs text-spa-muted mb-2">
                Corporate inquiries, customer service, and verification requests:
              </p>
              <p className="text-base font-bold text-spa-text font-mono mb-4">
                {USH_EMAIL_DISPLAY}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={USH_EMAIL_MAILTO_HREF}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium !text-white hover:!text-white bg-spa-text hover:bg-spa-cherry transition-colors py-2 px-3 rounded-lg"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-spa-muted hover:text-spa-text py-1.5 px-3 rounded-lg border border-spa-petal/70 hover:border-spa-rose transition-colors"
              >
                {copiedEmail ? '✓ Email Copied' : 'Copy Email Address'}
              </button>
            </div>
          </div>

          {/* Card 4: Hours */}
          <div className="bg-white rounded-xl p-6 border border-spa-petal/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream flex items-center justify-center text-2xl text-spa-cherry mb-4">
                ⏰
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry block mb-1">
                Visiting Hours
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text mb-2">
                Operating Schedule
              </h3>
              <div className="space-y-1.5 text-xs text-spa-muted mb-4">
                <div className="flex justify-between py-1 border-b border-spa-petal/40">
                  <span className="font-medium text-spa-text">Mon – Sun:</span>
                  <span>10:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-spa-petal/40">
                  <span className="font-medium text-spa-text">Audience:</span>
                  <span>Women Only</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-spa-text">Walk-ins:</span>
                  <span>Welcome / App Preferred</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-spa-cherry bg-spa-blush/60 p-2.5 rounded-lg text-center font-medium">
              Appointments recommended
            </div>
          </div>
        </section>

        {/* Two-Column Section: Contact Form + Legal Business Statement */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-10 border border-spa-petal/70 shadow-sm">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-wider font-semibold text-spa-cherry block mb-1">
                Online Inquiry
              </span>
              <h2 className="font-lustria text-2xl sm:text-3xl text-spa-text mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-spa-muted leading-relaxed">
                Have questions about our Thai massage therapies, special packages, or bookings?
                Leave your details below and our concierge team will respond promptly.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 px-4 bg-spa-cream/40 rounded-xl border border-spa-petal/50">
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="font-lustria text-2xl text-spa-text mb-2">
                  Thank You for Reaching Out!
                </h3>
                <p className="text-sm text-spa-muted max-w-md mx-auto mb-6">
                  We have received your message. A representative from Quiet Ush Thai Spa Health Institute for Women
                  will get in touch with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="btn-spa btn-rose text-xs py-2.5 px-6"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-spa-text mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Al-Ahmad"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal bg-white focus:outline-none focus:border-spa-cherry transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-spa-text mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+965 XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal bg-white focus:outline-none focus:border-spa-cherry transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-spa-text mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal bg-white focus:outline-none focus:border-spa-cherry transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-spa-text mb-1.5">
                      Service of Interest
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal bg-white focus:outline-none focus:border-spa-cherry transition-colors"
                    >
                      <option value="Traditional Thai Massage">Traditional Thai Massage</option>
                      <option value="Aromatherapy Body Massage">Aromatherapy Body Massage</option>
                      <option value="Hot Stone & Herbal Ball Therapy">Hot Stone &amp; Herbal Ball Therapy</option>
                      <option value="Facial Care & Rejuvenation">Facial Care &amp; Rejuvenation</option>
                      <option value="Body Scrub & Polishing">Body Scrub &amp; Polishing</option>
                      <option value="Gift Card & Voucher Inquiry">Gift Card &amp; Voucher Inquiry</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-spa-text mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your preferred dates, party size, or specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal bg-white focus:outline-none focus:border-spa-cherry transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-spa btn-rose text-xs py-3 px-8 w-full sm:w-auto uppercase tracking-wider"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Business Verification & Entity Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f5ede7] rounded-2xl p-8 border border-spa-petal/60">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry block mb-1">
                Commercial Verification Notice
              </span>
              <h3 className="font-lustria text-xl font-bold text-spa-text mb-3">
                Quiet Ush Thai Spa Health Institute for Women
              </h3>
              <p className="text-xs text-spa-muted leading-relaxed mb-4">
                This website and the official USH Spa mobile applications are owned and operated by{' '}
                <strong className="text-spa-text">Quiet Ush Thai Spa Health Institute for Women</strong>,
                a licensed commercial wellness institute registered and established under the commercial laws of the State of Kuwait.
              </p>

              <div className="bg-white/80 rounded-xl p-4 border border-spa-petal/50 space-y-2.5 text-xs text-spa-muted mb-6">
                <div>
                  <span className="block font-semibold text-spa-text">Legal Business Name:</span>
                  <span>Quiet Ush Thai Spa Health Institute for Women</span>
                </div>
                <div>
                  <span className="block font-semibold text-spa-text">Brand / Operating Name:</span>
                  <span>USH Spa</span>
                </div>
                <div>
                  <span className="block font-semibold text-spa-text">Registered Address:</span>
                  <span>Al-Shuhada Street, Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman, Kuwait city, Sharq 15300, Kuwait</span>
                </div>
                <div>
                  <span className="block font-semibold text-spa-text">Official Contact:</span>
                  <span>{USH_EMAIL_DISPLAY} • {USH_PHONE_DISPLAY}</span>
                </div>
              </div>

              {/* Mobile App Download Card */}
              <div className="bg-white rounded-xl p-5 border border-spa-petal/50">
                <h4 className="font-lustria text-sm font-bold text-spa-text mb-1">
                  📱 Book Instantly with the Mobile App
                </h4>
                <p className="text-xs text-spa-muted mb-4">
                  Browse treatments, choose your therapist, and book directly from iOS and Android.
                </p>
                <AppDownloadButtons />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

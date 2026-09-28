'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface Section {
  id: string;
  number: string;
  title: string;
}

const sections: Section[] = [
  { id: 'introduction', number: '1', title: 'Introduction & Scope' },
  { id: 'data-collected', number: '2', title: 'Information We Collect' },
  { id: 'how-we-use-data', number: '3', title: 'How We Use Your Information' },
  { id: 'legal-basis', number: '4', title: 'Legal Bases for Processing' },
  { id: 'device-permissions', number: '5', title: 'Device Permissions & Access' },
  { id: 'payment-security', number: '6', title: 'Payment & Financial Security' },
  { id: 'data-sharing', number: '7', title: 'Data Sharing & Third Parties' },
  { id: 'data-retention', number: '8', title: 'Data Retention' },
  { id: 'data-security', number: '9', title: 'Data Security Measures' },
  { id: 'user-rights', number: '10', title: 'Your Privacy Rights' },
  { id: 'account-deletion', number: '11', title: 'Account Deletion & Data Erasure' },
  { id: 'children-privacy', number: '12', title: "Children's Privacy" },
  { id: 'policy-changes', number: '13', title: 'Changes to this Policy' },
  { id: 'contact-us', number: '14', title: 'Contact Us & Grievances' },
];

export default function PrivacyPolicyClient() {
  const [activeSection, setActiveSection] = useState<string>('introduction');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('info@ushspa.co');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter((s) => s.title.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white text-spa-text antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-spa-petal/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo-01.png"
              alt="USH Spa"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block border-l border-spa-petal/60 pl-3">
              <span className="block font-lustria text-xs font-semibold tracking-wider text-spa-text uppercase">
                Legal & Privacy Portal
              </span>
              <span className="block text-[11px] text-spa-muted">
                USH Spa Mobile App
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-spa-muted hover:text-spa-cherry transition-colors px-3 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>

            <button
              onClick={handlePrint}
              type="button"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-spa-text border border-spa-petal/70 bg-spa-cream/60 hover:bg-spa-blush px-3 py-2 rounded-sm transition-colors"
              title="Print Privacy Policy"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-spa-rosybrown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>

            <button
              onClick={() => scrollToSection('account-deletion')}
              type="button"
              className="text-xs font-medium text-spa-cherry bg-spa-blush hover:bg-spa-petal/60 border border-spa-petal px-3 py-2 rounded-sm transition-colors"
            >
              Account Deletion
            </button>

            <Link
              href="/#booking"
              className="btn-spa btn-rose text-xs py-2 px-4 shadow-sm"
            >
              Book Spa
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-spa-cream via-spa-pearl to-white pt-12 pb-14 border-b border-spa-petal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-spa-muted mb-6">
            <Link href="/" className="hover:text-spa-cherry transition-colors">Home</Link>
            <span>/</span>
            <span className="text-spa-cherry font-medium">Privacy Policy</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-spa-blush border border-spa-petal/60 text-spa-cherry text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-spa-rose animate-pulse" />
              Official Mobile App Notice
            </div>

            <h1 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text mb-4 leading-tight">
              USH Spa Mobile App Privacy Policy
            </h1>

            <p className="text-spa-muted text-base sm:text-lg leading-relaxed mb-6 font-light">
              This Privacy Policy explains how <strong className="text-spa-text font-medium">USH Spa Co.</strong> collects,
              uses, protects, and discloses personal data when you use the <strong className="text-spa-text font-medium">USH Spa</strong> mobile application
              (available for iOS on the Apple App Store and for Android on the Google Play Store) to discover spa services, schedule appointments, and manage gift vouchers.
            </p>

            {/* Quick Metadata Pill Container */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-4 border-t border-spa-petal/40 text-xs text-spa-muted">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-spa-text">Last Updated:</span>
                <span className="bg-white px-2 py-1 rounded border border-spa-petal/50">September 28, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-spa-text">Application:</span>
                <span className="bg-white px-2 py-1 rounded border border-spa-petal/50">USH Spa (iOS &amp; Android)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-spa-text">Entity:</span>
                <span>USH Spa Co., Mangaf, Kuwait</span>
              </div>
            </div>

            {/* App Store Quick Links */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://apps.apple.com/us/app/ushspa/id6771279814"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff' }}
                className="inline-flex items-center gap-2.5 bg-spa-text !text-white px-4 py-2 rounded text-xs font-medium hover:bg-spa-cherry transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-1 .04-2.17.67-2.8 1.41-.57.65-1.06 1.71-.93 2.74 1.13.09 2.1-.53 2.72-1.28z" />
                </svg>
                Apple App Store (ID: 6771279814)
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.spaush.ushspa"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff' }}
                className="inline-flex items-center gap-2.5 bg-spa-text !text-white px-4 py-2 rounded text-xs font-medium hover:bg-spa-cherry transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l12.37-11.88L13.48 9 3.18 23.76zM21.37 10.6l-2.79-1.6-3.44 3.31 3.44 3.3 2.8-1.6c.8-.46.8-1.95 0-2.41zM1.96.48C1.65.85 1.5 1.36 1.5 1.98v20.04c0 .62.15 1.13.47 1.5L13.06 12 1.96.48zM16.54 1.64 4.17.24c-.35-.04-.69.03-.99.2L13.48 9l3.06-7.36z" />
                </svg>
                Google Play Store (com.spaush.ushspa)
              </a>

              <button
                onClick={copyEmail}
                type="button"
                className="inline-flex items-center gap-2 border border-spa-petal bg-white text-spa-text px-3.5 py-2 rounded text-xs font-medium hover:border-spa-rose transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-spa-cherry" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {copiedEmail ? 'Copied info@ushspa.co!' : 'Copy Privacy Contact Email'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile TOC Accordion Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="w-full flex items-center justify-between p-4 bg-spa-cream rounded-sm border border-spa-petal/60 text-sm font-medium text-spa-text shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-spa-cherry" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Table of Contents ({sections.length} Sections)
            </span>
            <span className="text-xs text-spa-cherry font-semibold">
              {mobileMenuOpen ? 'Hide ▲' : 'Browse ▼'}
            </span>
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 p-3 bg-white border border-spa-petal rounded-sm shadow-md space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    activeSection === section.id
                      ? 'bg-spa-blush text-spa-cherry font-medium'
                      : 'text-spa-text hover:bg-spa-cream'
                  }`}
                >
                  <span className="text-spa-muted mr-1.5">{section.number}.</span>
                  {section.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Desktop Left Sidebar: Interactive Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 bg-white border border-spa-petal/50 rounded-sm p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-lustria text-sm font-bold uppercase tracking-wider text-spa-text">
                  Policy Navigation
                </h2>
                <p className="text-[11px] text-spa-muted mt-0.5">Jump directly to any section</p>
              </div>

              {/* Quick Filter */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Filter topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 pl-8 border border-spa-petal/70 rounded-sm bg-spa-cream/40 focus:outline-none focus:border-spa-rose transition-colors"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-spa-muted absolute left-2.5 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <nav className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredSections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      type="button"
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-spa-blush text-spa-cherry font-medium border-l-2 border-spa-cherry pl-3'
                          : 'text-spa-muted hover:text-spa-text hover:bg-spa-cream/60'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono text-[11px] mr-1.5 opacity-60">
                          {section.number}.
                        </span>
                        {section.title}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-spa-cherry ml-2 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Priority Callout for Account Deletion */}
              <div className="mt-6 pt-4 border-t border-spa-petal/40">
                <button
                  onClick={() => scrollToSection('account-deletion')}
                  type="button"
                  className="w-full block text-center bg-spa-blush hover:bg-spa-petal/70 text-spa-cherry border border-spa-petal/80 rounded py-2 text-xs font-medium transition-colors"
                >
                  🗑️ Account Deletion Instructions
                </button>
              </div>
            </div>
          </aside>

          {/* Right Column: Policy Document Body */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12">
            {/* Quick Summary Highlights Box */}
            <div className="bg-spa-cream/60 border border-spa-petal/60 rounded-sm p-6 sm:p-7 shadow-sm">
              <h3 className="font-lustria text-lg text-spa-text mb-3 flex items-center gap-2">
                <span className="text-spa-rose text-xl">🛡️</span>
                Summary of Core Privacy Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-spa-muted">
                <div className="bg-white p-3.5 rounded border border-spa-petal/40">
                  <span className="font-semibold text-spa-text block mb-1">Appointment &amp; Service Care</span>
                  We process your name, contact details, and spa service choices solely to deliver appointments, assign qualified specialists, and fulfill gift vouchers.
                </div>
                <div className="bg-white p-3.5 rounded border border-spa-petal/40">
                  <span className="font-semibold text-spa-text block mb-1">Zero Data Selling</span>
                  We never sell, rent, or trade your personal data to data brokers or third parties for external marketing purposes.
                </div>
                <div className="bg-white p-3.5 rounded border border-spa-petal/40">
                  <span className="font-semibold text-spa-text block mb-1">Secure Payments</span>
                  Payment card and KNET details are processed through encrypted, licensed payment gateways. USH Spa never stores full card numbers or banking PINs.
                </div>
                <div className="bg-white p-3.5 rounded border border-spa-petal/40">
                  <span className="font-semibold text-spa-text block mb-1">User Control &amp; Deletion</span>
                  You have full rights to request your data or permanently delete your account and associated profile directly in the app or via email.
                </div>
              </div>
            </div>

            {/* SECTION 1 */}
            <section id="introduction" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Introduction &amp; Scope
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                Welcome to <strong className="text-spa-text">USH Spa</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated by <strong className="text-spa-text">USH Spa Co.</strong>, registered in the State of Kuwait at Building 124, Floor 5, Office 10, USH SPA - Mangaf. We are committed to honoring the trust you place in us when using our mobile application (the &ldquo;App&rdquo;) and associated web and online booking services.
              </p>
              <p className="text-sm leading-relaxed text-spa-muted">
                This Privacy Policy applies to personal data collected through:
              </p>
              <ul className="list-disc list-inside text-sm text-spa-muted space-y-1.5 pl-2">
                <li>The <strong className="text-spa-text">USH Spa Mobile Application</strong> for iOS (Apple App Store ID: <code className="bg-spa-cream px-1.5 py-0.5 rounded text-xs text-spa-cherry">6771279814</code>) and Android (Google Play Store Package: <code className="bg-spa-cream px-1.5 py-0.5 rounded text-xs text-spa-cherry">com.spaush.ushspa</code>).</li>
                <li>Digital appointment bookings, therapist scheduling, and consultation preferences.</li>
                <li>Digital gift vouchers, gift cards, and order tracking services delivered through our web and mobile platforms.</li>
                <li>Direct customer service interactions via phone, WhatsApp, email, or in-app support.</li>
              </ul>
              <p className="text-sm leading-relaxed text-spa-muted">
                By downloading, accessing, or using the USH Spa mobile app, you acknowledge that you have read and understood this Privacy Policy and agree to our processing of your information in accordance with its provisions.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="data-collected" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Information We Collect
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                To provide a seamless, luxurious, and personalized spa booking experience, we collect certain categories of personal data. We only collect information that is strictly necessary for our services:
              </p>

              <div className="space-y-4">
                <div className="border border-spa-petal/50 rounded-sm p-4 bg-white shadow-2xs">
                  <h3 className="font-lustria text-sm font-semibold text-spa-text mb-2 flex items-center gap-2">
                    <span className="text-spa-rose">👤</span> A. Account &amp; Identity Information
                  </h3>
                  <p className="text-xs text-spa-muted leading-relaxed mb-2">
                    When you create an account or initiate a booking in the USH Spa app, we may collect:
                  </p>
                  <ul className="list-disc list-inside text-xs text-spa-muted space-y-1 pl-2">
                    <li><strong className="text-spa-text">Full Name:</strong> To identify you at our reception and personalize your appointment.</li>
                    <li><strong className="text-spa-text">Mobile Phone Number:</strong> Essential for one-time passcode (OTP) SMS verification, appointment confirmations, reminder notifications, and urgent scheduling alerts.</li>
                    <li><strong className="text-spa-text">Email Address:</strong> Used for booking invoices, receipts, gift voucher delivery, and account security notices.</li>
                    <li><strong className="text-spa-text">Profile Picture (Optional):</strong> If you choose to upload an avatar to personalize your account profile.</li>
                  </ul>
                </div>

                <div className="border border-spa-petal/50 rounded-sm p-4 bg-white shadow-2xs">
                  <h3 className="font-lustria text-sm font-semibold text-spa-text mb-2 flex items-center gap-2">
                    <span className="text-spa-rose">💆</span> B. Appointment &amp; Treatment Records
                  </h3>
                  <p className="text-xs text-spa-muted leading-relaxed mb-2">
                    Information related to the spa and wellness services you request:
                  </p>
                  <ul className="list-disc list-inside text-xs text-spa-muted space-y-1 pl-2">
                    <li><strong className="text-spa-text">Selected Procedures:</strong> Massages, Moroccan baths, hydrotherapy, facials, scrubs, packages, or custom treatments.</li>
                    <li><strong className="text-spa-text">Schedule Preferences:</strong> Requested appointment date, time slot, duration, and branch location.</li>
                    <li><strong className="text-spa-text">Therapist Selection:</strong> Preference for specific spa specialists or female/male practitioners as selected by you.</li>
                    <li><strong className="text-spa-text">Health &amp; Wellness Preferences (Voluntarily Disclosed):</strong> Any allergies, pressure preferences, skin sensitivities, or pregnancy status you voluntarily choose to inform us about in the appointment notes to ensure your physical safety and comfort during treatment.</li>
                  </ul>
                </div>

                <div className="border border-spa-petal/50 rounded-sm p-4 bg-white shadow-2xs">
                  <h3 className="font-lustria text-sm font-semibold text-spa-text mb-2 flex items-center gap-2">
                    <span className="text-spa-rose">🎁</span> C. Gift Cards &amp; Voucher Information
                  </h3>
                  <p className="text-xs text-spa-muted leading-relaxed">
                    If you purchase or send a digital gift card through our app, we collect the recipient&rsquo;s name, phone number or email address, your custom greeting message, and the generated voucher code to enable redemption and track delivery status.
                  </p>
                </div>

                <div className="border border-spa-petal/50 rounded-sm p-4 bg-white shadow-2xs">
                  <h3 className="font-lustria text-sm font-semibold text-spa-text mb-2 flex items-center gap-2">
                    <span className="text-spa-rose">📱</span> D. Device, Technical &amp; Diagnostic Data
                  </h3>
                  <p className="text-xs text-spa-muted leading-relaxed mb-2">
                    Automatically collected during your interactions with our app to ensure uptime and security:
                  </p>
                  <ul className="list-disc list-inside text-xs text-spa-muted space-y-1 pl-2">
                    <li><strong className="text-spa-text">Device Identifiers:</strong> Device model, hardware manufacturer, operating system version (iOS/Android), and app version.</li>
                    <li><strong className="text-spa-text">Network &amp; Logs:</strong> Internet Protocol (IP) address, connection type, timestamp of requests, and crash analytics for diagnosing technical errors.</li>
                    <li><strong className="text-spa-text">Push Notification Tokens:</strong> Device push tokens (Apple Push Notification service / Firebase Cloud Messaging) to send booking status updates if notifications are enabled.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="how-we-use-data" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                We process your personal data exclusively for lawful and legitimate purposes connected with the spa services you solicit:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-spa-muted">
                <div className="p-3 bg-spa-cream/40 rounded border border-spa-petal/40">
                  <strong className="text-spa-text block mb-1">1. Appointment Fulfillment</strong>
                  Reserving treatment suites, assigning requested therapists, scheduling equipment (e.g. hydrotherapy baths), and greeting you upon arrival at USH Spa.
                </div>
                <div className="p-3 bg-spa-cream/40 rounded border border-spa-petal/40">
                  <strong className="text-spa-text block mb-1">2. Notifications &amp; Reminders</strong>
                  Sending automated booking confirmations, 24-hour reminder notices, schedule modification updates, and cancellation confirmations.
                </div>
                <div className="p-3 bg-spa-cream/40 rounded border border-spa-petal/40">
                  <strong className="text-spa-text block mb-1">3. Customer Care &amp; Support</strong>
                  Responding to your inquiries, handling rescheduling requests, and honoring service vouchers.
                </div>
                <div className="p-3 bg-spa-cream/40 rounded border border-spa-petal/40">
                  <strong className="text-spa-text block mb-1">4. Safety &amp; Health Protection</strong>
                  Ensuring spa treatments (e.g., hot stone, deep tissue, essential oils) are safely administered according to any sensitivities or preferences you shared.
                </div>
                <div className="p-3 bg-spa-cream/40 rounded border border-spa-petal/40">
                  <strong className="text-spa-text block mb-1">5. App Optimization &amp; Bug Fixing</strong>
                  Monitoring app performance, troubleshooting crashes, optimizing load speeds, and releasing feature improvements.
                </div>
                <div className="p-3 bg-spa-cream/40 rounded border border-spa-petal/40">
                  <strong className="text-spa-text block mb-1">6. Legal &amp; Regulatory Compliance</strong>
                  Complying with accounting rules, tax documentation, and regulatory obligations applicable in Kuwait.
                </div>
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="legal-basis" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Legal Bases for Processing
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                Under applicable data protection principles, we rely on the following legal grounds to process your personal data:
              </p>
              <ul className="list-disc list-inside text-sm text-spa-muted space-y-2 pl-2">
                <li><strong className="text-spa-text">Performance of a Contract:</strong> When you book a spa appointment or purchase a gift voucher, processing your name, phone number, and service selections is necessary to execute the contract and deliver the requested treatment.</li>
                <li><strong className="text-spa-text">Consent:</strong> For optional features such as device push notifications, camera permissions, and marketing updates, we ask for your explicit consent, which you may withdraw at any time via your device settings.</li>
                <li><strong className="text-spa-text">Legitimate Interests:</strong> To protect the security of our application, prevent fraudulent bookings, and continuously improve user experience.</li>
                <li><strong className="text-spa-text">Legal Obligations:</strong> Retaining invoices and transaction histories as required by commercial and taxation authorities.</li>
              </ul>
            </section>

            {/* SECTION 5 */}
            <section id="device-permissions" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Device Permissions &amp; Access
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                The USH Spa mobile app requests only those operating system permissions strictly needed to enable specific app capabilities. Permissions are requested dynamically at runtime:
              </p>

              <div className="border border-spa-petal/60 rounded-sm overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-spa-cream border-b border-spa-petal/60 text-spa-text font-lustria">
                      <th className="p-3">Permission</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Reason for Request</th>
                      <th className="p-3">Mandatory?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-spa-petal/30 text-spa-muted">
                    <tr>
                      <td className="p-3 font-semibold text-spa-text">Push Notifications</td>
                      <td className="p-3">iOS &amp; Android</td>
                      <td className="p-3">To deliver immediate booking confirmations, appointment reminders, and schedule updates.</td>
                      <td className="p-3 text-spa-cherry font-medium">Optional (Opt-in)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-spa-text">Location (Coarse/Fine)</td>
                      <td className="p-3">iOS &amp; Android</td>
                      <td className="p-3">To calculate travel distance and navigate you to our Mangaf branch. We do not track you continuously in the background.</td>
                      <td className="p-3 text-spa-cherry font-medium">Optional</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-spa-text">Camera</td>
                      <td className="p-3">iOS &amp; Android</td>
                      <td className="p-3">Used exclusively if you choose to take a photo for your profile avatar or scan a gift voucher QR code.</td>
                      <td className="p-3 text-spa-cherry font-medium">Optional</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-spa-text">Photo Library / Storage</td>
                      <td className="p-3">iOS &amp; Android</td>
                      <td className="p-3">Used only to select an existing photo for your user profile avatar.</td>
                      <td className="p-3 text-spa-cherry font-medium">Optional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-spa-muted italic">
                You can grant or revoke these permissions at any time through your device settings (<code className="bg-spa-cream px-1 py-0.5 rounded text-[11px]">Settings &gt; USH Spa</code> on iOS or <code className="bg-spa-cream px-1 py-0.5 rounded text-[11px]">Settings &gt; Apps &gt; USH Spa &gt; Permissions</code> on Android).
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="payment-security" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  6
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Payment &amp; Financial Security
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                When you pay for appointments, deposits, or gift cards through the app:
              </p>
              <div className="bg-spa-blush/60 border border-spa-petal p-4 rounded-sm space-y-2 text-xs text-spa-muted">
                <p>
                  <strong className="text-spa-cherry">PCI-DSS Compliant Payment Gateways:</strong> All electronic transactions (including KNET, Visa, and MasterCard) are processed securely through certified, licensed payment gateway providers.
                </p>
                <p>
                  <strong className="text-spa-cherry">No Card Credentials Stored:</strong> USH Spa does <strong>NOT</strong> collect, view, or store your credit card CVV codes, bank account credentials, or KNET PINs on its servers. We only receive a secure tokenized transaction identifier and payment status confirmation (e.g. &ldquo;Paid&rdquo;, &ldquo;Pending&rdquo;).
                </p>
                <p>
                  All transaction communications are conducted via 256-bit TLS (Transport Layer Security) encryption.
                </p>
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="data-sharing" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  7
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Data Sharing &amp; Third Parties
                </h2>
              </div>
              <div className="p-4 bg-spa-cream rounded border-l-4 border-spa-cherry text-xs text-spa-muted">
                <strong className="text-spa-text block text-sm font-lustria mb-1">Our Pledge: We Never Sell Your Data</strong>
                USH Spa does <strong>not</strong> sell, rent, monetize, or disclose your personal data to third-party advertisers or data brokers.
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                We share personal information strictly with vetted third-party service providers (subprocessors) that enable our core operations, subject to contractual confidentiality agreements:
              </p>
              <ul className="list-disc list-inside text-xs text-spa-muted space-y-2 pl-2">
                <li><strong className="text-spa-text">Cloud Infrastructure &amp; Databases:</strong> Hosted in secure enterprise cloud environments to store your encrypted booking records and account tokens.</li>
                <li><strong className="text-spa-text">SMS &amp; Telecommunication Gateways:</strong> To transmit automated OTP verification codes and appointment SMS notifications.</li>
                <li><strong className="text-spa-text">Push Notification Services:</strong> Apple Push Notification service (APNs) and Google Firebase Cloud Messaging (FCM) to deliver appointment alerts to your device.</li>
                <li><strong className="text-spa-text">Legal Authorities:</strong> If required by law, subpoena, or competent judicial or government order in the State of Kuwait.</li>
              </ul>
            </section>

            {/* SECTION 8 */}
            <section id="data-retention" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  8
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Data Retention Policy
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws:
              </p>
              <ul className="list-disc list-inside text-xs text-spa-muted space-y-1.5 pl-2">
                <li><strong className="text-spa-text">Active Accounts:</strong> Maintained for the duration of your active account so you can view past appointments and redeem valid gift vouchers.</li>
                <li><strong className="text-spa-text">Financial &amp; Invoicing Records:</strong> Preserved for the duration required by Kuwaiti commercial and tax laws (typically up to 5 years).</li>
                <li><strong className="text-spa-text">Upon Account Deletion:</strong> Personal identifiers (name, email, phone number, push tokens, avatars) are permanently purged or anonymized within 14 business days, except where statutory retention applies.</li>
              </ul>
            </section>

            {/* SECTION 9 */}
            <section id="data-security" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  9
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Data Security Measures
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                We implement comprehensive administrative, technical, and physical safeguards designed to protect personal data against accidental loss, unauthorized access, alteration, and misuse:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-spa-muted">
                <div className="p-3 bg-white border border-spa-petal/60 rounded">
                  <span className="text-spa-rose text-base block mb-1">🔒</span>
                  <strong className="text-spa-text block mb-1">Encryption in Transit</strong>
                  All network communications between the USH Spa mobile app and our API servers (<code className="text-[10px]">api.ushspa.co</code>) use modern TLS encryption.
                </div>
                <div className="p-3 bg-white border border-spa-petal/60 rounded">
                  <span className="text-spa-rose text-base block mb-1">🔑</span>
                  <strong className="text-spa-text block mb-1">Tokenized Auth</strong>
                  User authentication uses secure tokens, preventing passwords or credentials from being stored in plaintext on your device.
                </div>
                <div className="p-3 bg-white border border-spa-petal/60 rounded">
                  <span className="text-spa-rose text-base block mb-1">👥</span>
                  <strong className="text-spa-text block mb-1">Restricted Access</strong>
                  Only authorized spa coordinators and therapists have role-based access to appointment schedules necessary for your treatment.
                </div>
              </div>
            </section>

            {/* SECTION 10 */}
            <section id="user-rights" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  10
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Your Privacy Rights
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                Depending on your jurisdiction and in line with our privacy commitment, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-xs text-spa-muted space-y-2 pl-2">
                <li><strong className="text-spa-text">Right of Access:</strong> You may request a summary of the personal data we hold about your account.</li>
                <li><strong className="text-spa-text">Right to Rectification:</strong> You can update or correct inaccurate profile details (e.g. updated phone number, email address) directly in the app profile section or by contacting us.</li>
                <li><strong className="text-spa-text">Right to Erasure (Right to be Forgotten):</strong> You have the absolute right to delete your account and all associated personal data (see Section 11).</li>
                <li><strong className="text-spa-text">Right to Withdraw Consent:</strong> You can disable push notifications or location permissions at any time via your smartphone settings without affecting your ability to book appointments in person or by phone.</li>
              </ul>
            </section>

            {/* SECTION 11 - CRITICAL FOR APP STORE & GOOGLE PLAY */}
            <section id="account-deletion" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-cherry text-white flex items-center justify-center font-bold text-xs">
                  11
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Account Deletion &amp; Data Erasure
                </h2>
              </div>

              {/* Prominent Apple / Google Compliant Notice Box */}
              <div className="bg-gradient-to-r from-spa-blush to-spa-cream border-2 border-spa-petal rounded-sm p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-spa-cherry text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-lustria text-base font-semibold text-spa-text">
                      How to Delete Your USH Spa Account and Associated Data
                    </h3>
                    <p className="text-xs text-spa-muted mt-1 leading-relaxed">
                      In full compliance with <strong className="text-spa-text">Apple App Store Guideline 5.1.1(v)</strong> and <strong className="text-spa-text">Google Play Data Safety</strong> policies, USH Spa provides direct, immediate mechanisms for users to delete their account and purge all associated personal data.
                    </p>
                  </div>
                </div>

                {/* Option A: In-App Deletion */}
                <div className="bg-white p-4 rounded border border-spa-petal/70 space-y-2">
                  <h4 className="font-lustria text-xs font-bold uppercase tracking-wider text-spa-cherry flex items-center gap-1.5">
                    <span>📱</span> Method 1: Delete Directly Inside the USH Spa App (Immediate)
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-spa-muted space-y-1.5 pl-2 leading-relaxed">
                    <li>Launch the <strong className="text-spa-text">USH Spa</strong> mobile app on your iPhone or Android device.</li>
                    <li>Navigate to the <strong className="text-spa-text">Profile</strong> or <strong className="text-spa-text">My Account</strong> tab on the bottom navigation bar.</li>
                    <li>Select <strong className="text-spa-text">Account Settings</strong>.</li>
                    <li>Tap on <strong className="text-spa-text text-red-600">Delete Account</strong>.</li>
                    <li>Read the confirmation summary and tap <strong className="text-spa-text text-red-600">Confirm Deletion</strong>.</li>
                  </ol>
                  <p className="text-[11px] text-spa-muted italic pt-1">
                    Your session will be immediately terminated, and your profile data will be queued for permanent erasure.
                  </p>
                </div>

                {/* Option B: Web Request Portal (Google Play store link) */}
                <div className="bg-white p-4 rounded border border-spa-petal/70 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-lustria text-xs font-bold uppercase tracking-wider text-spa-cherry flex items-center gap-1.5">
                      <span>🌐</span> Method 2: Web Deletion Request Portal (Immediate Online Form)
                    </h4>
                    <Link
                      href="/customers/delete-request/"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-spa-cherry hover:underline"
                    >
                      Open Delete Portal →
                    </Link>
                  </div>
                  <p className="text-xs text-spa-muted leading-relaxed">
                    Users can submit an authenticated account deletion request through our official web form using their registered phone number and account password:
                  </p>
                  <div className="p-3 bg-spa-blush/60 rounded border border-spa-petal/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-semibold text-spa-text block">Official Web Deletion URL:</span>
                      <code className="text-spa-cherry font-mono text-[11px]">https://ushspa.co/customers/delete-request/</code>
                    </div>
                    <Link
                      href="/customers/delete-request/"
                      className="btn-spa btn-rose text-xs py-1.5 px-3 shrink-0"
                    >
                      Go to Delete Form
                    </Link>
                  </div>
                  <p className="text-[11px] text-spa-muted leading-relaxed">
                    Alternatively, you can email our privacy desk at <a href="mailto:info@ushspa.co?subject=Account%20Deletion%20Request%20-%20USH%20Spa" className="text-spa-cherry hover:underline font-mono">info@ushspa.co</a> with your registered phone number.
                  </p>
                </div>

                {/* Scope of Deletion Table */}
                <div className="pt-2">
                  <h4 className="font-lustria text-xs font-semibold text-spa-text mb-2">
                    What Data is Deleted vs. Retained:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-red-50/60 border border-red-200/60 p-3 rounded text-red-900">
                      <span className="font-bold block mb-1 text-red-800">🗑️ Permanently Deleted:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-red-700">
                        <li>Account profile (Name, Email, Phone number)</li>
                        <li>Uploaded avatar / profile photo</li>
                        <li>Push notification device tokens</li>
                        <li>Saved treatment preferences &amp; notes</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded text-amber-900">
                      <span className="font-bold block mb-1 text-amber-800">📑 Retained for Legal Compliance:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
                        <li>Anonymized accounting records of completed transactions</li>
                        <li>Financial audit logs mandated by Kuwait commerce laws</li>
                        <li>Non-identifiable aggregate booking statistics</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-[11px] text-spa-muted mt-2">
                    Requests submitted via email are verified and executed within <strong>7 to 14 business days</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 12 */}
            <section id="children-privacy" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  12
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Children&apos;s Privacy
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                The USH Spa mobile app is designed and marketed exclusively for adult clients and individuals aged <strong className="text-spa-text">16 years and older</strong>. We do not knowingly collect, solicit, or maintain personal information from children under 16.
              </p>
              <p className="text-xs leading-relaxed text-spa-muted">
                If we learn that an account has been registered by a minor without parental consent, we will promptly delete all associated data from our servers. Parents or guardians who believe their child has submitted personal data to us may contact us at <a href="mailto:info@ushspa.co" className="text-spa-cherry hover:underline">info@ushspa.co</a>.
              </p>
            </section>

            {/* SECTION 13 */}
            <section id="policy-changes" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  13
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Changes to this Privacy Policy
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                We may periodically update this Privacy Policy to reflect modifications in our spa services, mobile app functionality, or evolving legal and regulatory requirements.
              </p>
              <p className="text-xs leading-relaxed text-spa-muted">
                When material changes occur, we will notify you through an in-app notice, a push notification, or by updating the &ldquo;Last Updated&rdquo; date at the top of this page. Your continued use of the USH Spa mobile app following the posting of an updated version constitutes your acceptance of the revised terms.
              </p>
            </section>

            {/* SECTION 14 */}
            <section id="contact-us" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-spa-petal/50 pb-3">
                <span className="w-7 h-7 rounded-full bg-spa-petal text-spa-cherry flex items-center justify-center font-bold text-xs">
                  14
                </span>
                <h2 className="font-lustria text-xl sm:text-2xl text-spa-text">
                  Contact Us &amp; Grievances
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-spa-muted">
                If you have questions, inquiries, feedback, or grievances regarding this Privacy Policy or our data handling practices, please contact our designated privacy desk:
              </p>

              <div className="bg-spa-cream/60 border border-spa-petal rounded-sm p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-lustria text-sm font-bold uppercase tracking-wider text-spa-text mb-3">
                      USH Spa Co.
                    </h3>
                    <div className="space-y-2 text-xs text-spa-muted">
                      <p className="flex items-start gap-2">
                        <span className="text-spa-cherry">📍</span>
                        <span>
                          Building 124, Floor 5, Office 10<br />
                          USH SPA - Mangaf, State of Kuwait
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-spa-cherry">📞</span>
                        <span>Phone / WhatsApp: <a href="tel:+96590010335" className="text-spa-text hover:text-spa-cherry font-medium">+965 90010335</a></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-spa-cherry">✉️</span>
                        <span>Email: <a href="mailto:info@ushspa.co" className="text-spa-cherry hover:underline font-medium">info@ushspa.co</a></span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-lustria text-sm font-bold uppercase tracking-wider text-spa-text mb-3">
                      Spa Hours &amp; Inquiries
                    </h3>
                    <div className="space-y-2 text-xs text-spa-muted">
                      <p className="flex items-center gap-2">
                        <span className="text-spa-cherry">⏰</span>
                        <span>Daily: 10:00 AM &ndash; 10:00 PM</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-spa-cherry">🌐</span>
                        <span>Website: <a href="https://ushspa.co" className="text-spa-cherry hover:underline">https://ushspa.co</a></span>
                      </p>
                      <p className="text-[11px] text-spa-muted pt-1">
                        Our customer service team typically responds to written privacy inquiries within 24 to 48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-spa-petal/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-spa-muted">
                    Need to delete your account now?
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="mailto:info@ushspa.co?subject=Account%20Deletion%20Request%20-%20USH%20Spa"
                      className="btn-spa btn-rose text-xs py-1.5 px-3"
                    >
                      Email Deletion Request
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

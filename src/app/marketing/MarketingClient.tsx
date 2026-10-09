'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF } from '@/lib/contact';

interface TableOfContentItem {
  id: string;
  title: string;
}

const tocItems: TableOfContentItem[] = [
  { id: 'marketing-communications', title: '1. Marketing Communications' },
  { id: 'promotional-offers', title: '2. Promotional Offers & Campaigns' },
  { id: 'loyalty-rewards', title: '3. Loyalty & Rewards Program' },
  { id: 'referral-program', title: '4. Referral Program' },
  { id: 'gift-cards', title: '5. Gift Cards' },
  { id: 'communication-channels', title: '6. Communication Channels' },
  { id: 'managing-preferences', title: '7. Managing Your Preferences' },
  { id: 'contact-us', title: '8. Contact Us' },
];

export default function MarketingClient() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const scrollToSection = (id: string) => {
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

  return (
    <div className="min-h-screen bg-[#faf5f3] text-spa-text antialiased">
      <Header />

      {/* Hero Header matching design with brand color theme */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#9c4c47] via-[#b7605a] to-[#efa697] text-white pt-32 pb-20 px-4 sm:px-6">
        {/* Soft background ambient ornaments */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-spa-blush blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Brand Logo in second attachment */}
          <div className="mb-4 relative group">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/30 bg-spa-blush p-1 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/images/company-logo.png"
                alt="USH Spa Brand Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-lustria text-sm sm:text-base tracking-[0.25em] uppercase font-bold text-white/90">
              USH SPA
            </span>
          </div>

          <h1 className="font-lustria text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Marketing Details
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-white/90 font-light leading-relaxed">
            Learn more about our promotional offers, loyalty rewards, and communication policies.
          </p>
        </div>
      </section>

      {/* Main Content White Card (Exact layout as attached image) */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 mb-16">
        <div className="bg-white rounded-t-[32px] sm:rounded-t-[40px] rounded-b-2xl shadow-xl border border-spa-petal/40 p-6 sm:p-10 md:p-12 transition-all">
          {/* Pill Badge at the top */}
          <div className="flex justify-start mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-spa-blush text-spa-cherry border border-spa-petal/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-spa-cherry animate-pulse" />
              Promotional Communications
            </span>
          </div>

          {/* Intro Description */}
          <p className="text-spa-text/90 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            At USH Spa, we love keeping you informed about our latest treatments, seasonal offers, and exclusive membership
            rewards. This Marketing Details page explains how our marketing programs work, the channels we use, and how
            you can manage your preferences at any time.
          </p>

          {/* Table of Contents Box */}
          <div className="bg-spa-cream/90 border border-spa-petal/60 rounded-xl p-5 sm:p-6 mb-10 shadow-xs">
            <h2 className="text-sm sm:text-base font-lustria font-bold text-spa-text mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-spa-cherry"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Table of Contents
            </h2>
            <ul className="space-y-1.5">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-xs sm:text-sm text-spa-cherry hover:text-spa-text hover:underline transition-colors text-left flex items-center gap-2 py-0.5 cursor-pointer font-medium"
                  >
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10 sm:space-y-12">
            {/* Section 1 */}
            <section id="marketing-communications" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Megaphone icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  1. Marketing Communications
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-3">
                We send communications to keep you up to date on everything happening at USH Spa, including:
              </p>

              <ul className="space-y-2.5 text-sm sm:text-[15px] text-spa-text/85 mb-5 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>New treatment and service launches (massages, facials, wellness therapies)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>Seasonal discounts and holiday packages (Valentine&apos;s Day, Mother&apos;s Day, New Year specials, etc.)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>Personalized birthday and anniversary gifts or treatment discounts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>Exclusive member-only promotions and early-access booking opportunities</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>Wellness tips, skincare advice, and updates from our certified therapists</span>
                </li>
              </ul>

              {/* Note callout box */}
              <div className="bg-spa-blush/80 border border-spa-petal rounded-xl p-4 sm:p-5 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-spa-cherry flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-spa-text font-medium leading-relaxed">
                  <strong className="text-spa-cherry font-semibold">Note:</strong> We will only send you marketing
                  messages if you have opted in. You can change your preferences or unsubscribe at any time.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="promotional-offers" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Tag icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  2. Promotional Offers &amp; Campaigns
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-4">
                All promotional offers and campaigns at USH Spa are subject to the following terms:
              </p>

              <div className="space-y-4 text-sm sm:text-[15px]">
                {/* 2.1 */}
                <div>
                  <h3 className="font-semibold text-spa-text text-sm sm:text-base mb-1">
                    2.1 Seasonal and Themed Campaigns
                  </h3>
                  <p className="text-spa-text/85 mb-2 leading-relaxed">
                    Campaigns run throughout the year, such as:
                  </p>
                  <ul className="space-y-1 pl-2 text-spa-text/85">
                    <li className="flex items-start gap-2.5">
                      <span className="text-spa-cherry mt-1">•</span>
                      <span>Spring Renewal (March – April)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-spa-cherry mt-1">•</span>
                      <span>Summer Glow (June – August)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-spa-cherry mt-1">•</span>
                      <span>Autumn Relaxation (September – October)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-spa-cherry mt-1">•</span>
                      <span>Winter Warmth (November – January)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-spa-cherry mt-1">•</span>
                      <span>Festive &amp; Holiday specials (various dates)</span>
                    </li>
                  </ul>
                </div>

                {/* 2.2 */}
                <div>
                  <h3 className="font-semibold text-spa-text text-sm sm:text-base mb-1">
                    2.2 First-Time Customer Offers
                  </h3>
                  <p className="text-spa-text/85 leading-relaxed">
                    New guests may receive a one-time welcome discount on their first appointment. This offer cannot be
                    combined with other discounts and is valid for single treatments only (not packages).
                  </p>
                </div>

                {/* 2.3 */}
                <div>
                  <h3 className="font-semibold text-spa-text text-sm sm:text-base mb-1">
                    2.3 Package Deals
                  </h3>
                  <p className="text-spa-text/85 leading-relaxed">
                    Discounted treatment packages (e.g., buy 5 get 1 free) must be used within the specified validity
                    period (typically 6–12 months from purchase). Unused sessions are non-refundable.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="loyalty-rewards" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Trophy / Award icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  3. Loyalty &amp; Rewards Program
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-5">
                Our loyalty program rewards our frequent guests with points that can be redeemed for free treatments,
                upgrades, and gifts.
              </p>

              {/* 2x2 Grid matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Bronze Tier */}
                <div className="bg-spa-cream/60 border border-spa-petal/70 rounded-xl p-5 hover:border-spa-rose transition-all shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">🥉</span>
                    <h3 className="font-lustria font-bold text-base text-spa-text">Bronze Tier</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-spa-text/80 leading-relaxed">
                    Earn 1 point per $1 spent. Redeem 100 points for a $10 credit.
                  </p>
                </div>

                {/* Silver Tier */}
                <div className="bg-spa-cream/60 border border-spa-petal/70 rounded-xl p-5 hover:border-spa-rose transition-all shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">🥈</span>
                    <h3 className="font-lustria font-bold text-base text-spa-text">Silver Tier</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-spa-text/80 leading-relaxed">
                    Spend $500+/year. Earn 1.25 points per $1. Complimentary upgrade on birthday.
                  </p>
                </div>

                {/* Gold Tier */}
                <div className="bg-spa-cream/60 border border-spa-petal/70 rounded-xl p-5 hover:border-spa-rose transition-all shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">🥇</span>
                    <h3 className="font-lustria font-bold text-base text-spa-text">Gold Tier</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-spa-text/80 leading-relaxed">
                    Spend $1,000+/year. Earn 1.5 points per $1. Priority booking + free 30-min add-on.
                  </p>
                </div>

                {/* Platinum Tier */}
                <div className="bg-spa-cream/60 border border-spa-petal/70 rounded-xl p-5 hover:border-spa-rose transition-all shadow-xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">💎</span>
                    <h3 className="font-lustria font-bold text-base text-spa-text">Platinum Tier</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-spa-text/80 leading-relaxed">
                    Spend $2,500+/year. Earn 2 points per $1. VIP lounge access + quarterly free treatment.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-spa-muted italic leading-relaxed">
                Points do not expire as long as your account remains active (at least one visit every 12 months). Points
                have no cash value and cannot be transferred.
              </p>
            </section>

            {/* Section 4 */}
            <section id="referral-program" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Share / Users icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  4. Referral Program
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-3">
                Share the gift of wellness with friends and family. Here is how it works:
              </p>

              <ul className="space-y-2 text-sm sm:text-[15px] text-spa-text/85 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Give $20, Get $20:</strong> When a friend books their
                    first treatment using your referral code, they receive a $20 discount on their first visit.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    Once their appointment is completed, a $20 credit is automatically applied to your account for your next booking.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    There is no limit to how many friends you can refer. Credits can be stacked toward any treatment or service.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="gift-cards" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Gift Card icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  5. Gift Cards
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-3">
                Our gift cards make the perfect present. Key terms include:
              </p>

              <ul className="space-y-2 text-sm sm:text-[15px] text-spa-text/85 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Digital &amp; Physical:</strong> Available in flexible
                    denominations ($25 to $500) online through our app/website or at our spa reception.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Expiration:</strong> Gift cards are valid for 12
                    months from the date of purchase (unless state law provides longer validity).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Non-refundable:</strong> Gift cards cannot be redeemed
                    for cash or refunded once issued.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Lost or Stolen Cards:</strong> If misplaced, contact us
                    with proof of purchase and we can reissue the digital code.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="communication-channels" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Smartphone icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  6. Communication Channels
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-3">
                We may reach out to you through the following channels based on your preferences:
              </p>

              <ul className="space-y-2 text-sm sm:text-[15px] text-spa-text/85 pl-2">
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">SMS / Text Messages:</strong> Appointment reminders,
                    limited-time flash sales, and booking confirmations (msg &amp; data rates may apply; reply STOP to opt out).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Email:</strong> Monthly newsletters, seasonal
                    catalogs, loyalty updates, and personalized offers.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Push Notifications:</strong> Real-time appointment
                    updates, last-minute availability alerts, and app-exclusive deals (managed via your device settings).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">In-App Messages:</strong> Notifications and offers
                    displayed inside the USH Spa mobile app when you open or browse.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Phone Calls:</strong> Only for urgent appointment
                    changes, confirmations, or customer care inquiries (never for cold promotional marketing).
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="managing-preferences" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Sliders icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  7. Managing Your Preferences
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-3">
                You are always in control of how and when you hear from us:
              </p>

              <ul className="space-y-2 text-sm sm:text-[15px] text-spa-text/85 pl-2 mb-5">
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">In-App:</strong> Go to Profile &gt; Notification Settings to
                    toggle email, SMS, and push notification preferences on or off.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Unsubscribe Link:</strong> Click the &apos;Unsubscribe&apos; link
                    at the bottom of any marketing email to opt out immediately.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Text STOP:</strong> Reply STOP to any marketing SMS to
                    automatically opt out of text promotions.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-spa-cherry mt-1">•</span>
                  <span>
                    <strong className="text-spa-text font-semibold">Contact Support:</strong> Email us at{' '}
                    <a href="mailto:info@ushspa.co" className="text-spa-cherry font-medium underline">
                      info@ushspa.co
                    </a>{' '}
                    with your request and we will update your preferences within 48 hours.
                  </span>
                </li>
              </ul>

              {/* Transactional Notice Box */}
              <div className="bg-spa-cream/90 border border-spa-petal/80 rounded-xl p-4 sm:p-5 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-spa-cherry flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-spa-text leading-relaxed">
                  <strong className="text-spa-cherry font-semibold">Please note:</strong> Transactional messages
                  (booking confirmations, appointment reminders, receipt receipts, security notices) will still be sent
                  even if you opt out of marketing communications.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="contact-us" className="scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-spa-blush text-spa-cherry border border-spa-petal flex items-center justify-center flex-shrink-0 shadow-xs">
                  {/* Contact / Mail icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <h2 className="font-lustria text-lg sm:text-xl font-bold text-spa-text">
                  8. Contact Us
                </h2>
              </div>

              <p className="text-sm sm:text-[15px] text-spa-text/90 leading-relaxed mb-4">
                If you have questions about our marketing practices, loyalty program, or would like to update your details:
              </p>

              {/* Contact Card */}
              <div className="bg-spa-cream/70 border border-spa-petal/80 rounded-xl p-5 sm:p-6">
                <h3 className="font-lustria font-bold text-base sm:text-lg text-spa-text mb-3">
                  USH Spa — Marketing &amp; Guest Experience Team
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-spa-text/85">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-spa-text">Email:</span>
                    <a href="mailto:info@ushspa.co" className="text-spa-cherry font-medium hover:underline">
                      info@ushspa.co
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="text-[11px] px-2 py-0.5 rounded bg-spa-blush border border-spa-petal text-spa-cherry hover:bg-spa-rose/30 transition-colors ml-1 cursor-pointer"
                    >
                      {copiedEmail ? 'Copied!' : 'Copy'}
                    </button>
                  </p>
                  <p>
                    <span className="font-semibold text-spa-text">Entity:</span> Quiet Ush Thai Spa Health Institute for Women (USH Spa)
                  </p>
                  <p>
                    <span className="font-semibold text-spa-text">Phone:</span>{' '}
                    <a href={USH_PHONE_TEL_HREF} className="text-spa-cherry hover:underline">
                      {USH_PHONE_DISPLAY}
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-spa-text">Location:</span> Al-Shuhada Street, Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman, Kuwait city, Sharq 15300, Kuwait
                  </p>
                  <p>
                    <span className="font-semibold text-spa-text">Website:</span>{' '}
                    <a href="https://ushspa.co" className="text-spa-cherry hover:underline">
                      https://ushspa.co
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Last updated footer note inside card */}
          <div className="mt-12 pt-6 border-t border-spa-petal/50 flex flex-col sm:flex-row items-center justify-between text-xs text-spa-muted gap-2">
            <span>Last updated: September 2026 • USH Spa</span>
            <div className="flex items-center gap-3">
              <Link href="/privacy-policy" className="hover:text-spa-cherry transition-colors underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-spa-cherry transition-colors cursor-pointer"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Main Website Footer */}
      <Footer />
    </div>
  );
}

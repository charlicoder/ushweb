'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppDownloadButtons from '@/components/AppDownloadButtons';
import { useApp } from '@/context/AppContext';
import { USH_PHONE_DISPLAY, USH_PHONE_E164, USH_PHONE_TEL_HREF, USH_EMAIL_DISPLAY, USH_EMAIL_MAILTO_HREF } from '@/lib/contact';

export default function ContactUsClient() {
  const { isAr } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Traditional Thai Massage',
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
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#16100d] text-spa-text dark:text-[#f7eee9] antialiased transition-colors duration-300">
      {/* Global Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#f2ece7] via-[#faf7f5] to-[#faf7f5] dark:from-[#201713] dark:via-[#1a1310] dark:to-[#16100d] border-b border-spa-petal/40 dark:border-white/10 overflow-hidden transition-colors duration-300">
        <div className="absolute top-10 right-10 w-96 h-96 bg-spa-rose/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-spa-petal/20 dark:bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#281e19] border border-spa-petal/80 dark:border-white/15 text-spa-cherry dark:text-spa-rose text-xs font-semibold tracking-wider uppercase mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-spa-rose animate-pulse" />
            {isAr ? 'جهة الاتصال الرسمية المعتمدة' : 'Official Business Contact'}
          </div>

          <h1 className="font-lustria text-3xl sm:text-5xl md:text-6xl text-spa-text dark:text-[#f7eee9] mb-4 leading-tight transition-colors duration-300">
            {isAr ? 'تواصل مع معهد أوش سبا' : 'Contact USH Spa'}
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-spa-cherry dark:text-spa-rose font-medium text-sm sm:text-base mb-2">
              {isAr
                ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                : 'Quiet Ush Thai Spa Health Institute for Women'}
            </p>
            <p className="text-spa-muted dark:text-[#b5a49c] text-sm sm:text-base leading-relaxed transition-colors duration-300">
              {isAr
                ? 'نرحب بكِ في الوجهة الرائدة الأولى في الكويت للعلاج التايلاندي الأصيل والعناية الفائقة بالبشرة والراحة النفسية. يسعد فريق الكونسيرج بخدمتكِ والإجابة على كافة استفساراتكِ.'
                : 'We welcome you to Kuwait’s premier institute for authentic Thai therapy, luxury skincare, and rejuvenating body wellness. Get in touch with our concierge team.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* 4 Contact Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Address */}
          <div className="bg-white dark:bg-[#231a16] rounded-xl p-6 border border-spa-petal/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream dark:bg-[#2e221c] flex items-center justify-center text-2xl text-spa-cherry mb-4">
                📍
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-1">
                {isAr ? 'الموقع الرسمي' : 'Official Location'}
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text dark:text-[#f7eee9] mb-2">
                {isAr ? 'عنوان المركز' : 'Business Address'}
              </h3>
              <p className="text-xs font-semibold text-spa-text dark:text-[#f7eee9] mb-1">
                {isAr
                  ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                  : 'Quiet Ush Thai Spa Health Institute for Women'}
              </p>
              <address className="not-italic text-xs text-spa-muted dark:text-[#b5a49c] leading-relaxed mb-4">
                {isAr ? (
                  <>
                    شارع الشهداء<br />
                    قطعة 04، قسيمة 32<br />
                    مبنى ناصر أحمد عبد اللطيف العثمان<br />
                    مدينة الكويت، الشرق 15300<br />
                    دولة الكويت
                  </>
                ) : (
                  <>
                    Al-Shuhada Street<br />
                    Block 04, Building 32<br />
                    Nasser Ahmed Abdul Latif Al-Othman<br />
                    Kuwait city, Sharq 15300<br />
                    State of Kuwait
                  </>
                )}
              </address>
            </div>
            <a
              href="https://maps.google.com/?q=Al-Shuhada+Street,+Sharq,+Kuwait+City"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-spa-cherry dark:text-spa-rose hover:text-spa-rose transition-colors py-2 px-3 rounded-lg bg-spa-cream/60 dark:bg-[#2d211c] hover:bg-spa-cream dark:hover:bg-[#382a24]"
            >
              {isAr ? 'فتح في خرائط جوجل ←' : 'Open in Maps →'}
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white dark:bg-[#231a16] rounded-xl p-6 border border-spa-petal/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream dark:bg-[#2e221c] flex items-center justify-center text-2xl text-spa-cherry mb-4">
                📞
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-1">
                {isAr ? 'الهاتف والواتساب' : 'Telephone & WhatsApp'}
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text dark:text-[#f7eee9] mb-2">
                {isAr ? 'رقم الاتصال المباشر' : 'Phone Number'}
              </h3>
              <p className="text-xs text-spa-muted dark:text-[#b5a49c] mb-2">
                {isAr
                  ? 'للحجوزات المباشرة، ومساعدة الكونسيرج، والاستفسارات:'
                  : 'Direct bookings, concierge assistance, and guest inquiries:'}
              </p>
              <p className="text-base font-bold text-spa-text dark:text-[#f7eee9] font-mono mb-4">
                {USH_PHONE_DISPLAY}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={USH_PHONE_TEL_HREF}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium !text-white hover:!text-white bg-spa-text dark:bg-spa-cherry hover:bg-spa-cherry transition-colors py-2 px-3 rounded-lg"
              >
                {isAr ? `اتصال ${USH_PHONE_DISPLAY}` : `Call ${USH_PHONE_DISPLAY}`}
              </a>
              <button
                type="button"
                onClick={copyPhone}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-spa-muted dark:text-[#b5a49c] hover:text-spa-text dark:hover:text-white py-1.5 px-3 rounded-lg border border-spa-petal/70 dark:border-white/15 hover:border-spa-rose transition-colors"
              >
                {copiedPhone
                  ? (isAr ? '✓ تم نسخ الرقم' : '✓ Number Copied')
                  : (isAr ? 'نسخ رقم الهاتف' : 'Copy Phone Number')}
              </button>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white dark:bg-[#231a16] rounded-xl p-6 border border-spa-petal/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream dark:bg-[#2e221c] flex items-center justify-center text-2xl text-spa-cherry mb-4">
                ✉️
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-1">
                {isAr ? 'المراسلات الرسمية' : 'Written Support'}
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text dark:text-[#f7eee9] mb-2">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </h3>
              <p className="text-xs text-spa-muted dark:text-[#b5a49c] mb-2">
                {isAr
                  ? 'للاستفسارات الرسمية وخدمة العملاء وطلبات التحقق:'
                  : 'Corporate inquiries, customer service, and verification requests:'}
              </p>
              <p className="text-base font-bold text-spa-text dark:text-[#f7eee9] font-mono mb-4 break-all">
                {USH_EMAIL_DISPLAY}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={USH_EMAIL_MAILTO_HREF}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium !text-white hover:!text-white bg-spa-text dark:bg-spa-cherry hover:bg-spa-cherry transition-colors py-2 px-3 rounded-lg"
              >
                {isAr ? 'إرسال بريد إلكتروني' : 'Send Email'}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-spa-muted dark:text-[#b5a49c] hover:text-spa-text dark:hover:text-white py-1.5 px-3 rounded-lg border border-spa-petal/70 dark:border-white/15 hover:border-spa-rose transition-colors"
              >
                {copiedEmail
                  ? (isAr ? '✓ تم نسخ البريد' : '✓ Email Copied')
                  : (isAr ? 'نسخ البريد الإلكتروني' : 'Copy Email Address')}
              </button>
            </div>
          </div>

          {/* Card 4: Hours */}
          <div className="bg-white dark:bg-[#231a16] rounded-xl p-6 border border-spa-petal/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-spa-cream dark:bg-[#2e221c] flex items-center justify-center text-2xl text-spa-cherry mb-4">
                ⏰
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-1">
                {isAr ? 'أوقات العمل' : 'Visiting Hours'}
              </span>
              <h3 className="font-lustria text-base font-bold text-spa-text dark:text-[#f7eee9] mb-2">
                {isAr ? 'جدول الاستقبال' : 'Operating Schedule'}
              </h3>
              <div className="space-y-1.5 text-xs text-spa-muted dark:text-[#b5a49c] mb-4">
                <div className="flex justify-between py-1 border-b border-spa-petal/40 dark:border-white/10">
                  <span className="font-medium text-spa-text dark:text-[#f7eee9]">{isAr ? 'طوال الأسبوع:' : 'Mon – Sun:'}</span>
                  <span>{isAr ? '10:00 ص – 10:00 م' : '10:00 AM – 10:00 PM'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-spa-petal/40 dark:border-white/10">
                  <span className="font-medium text-spa-text dark:text-[#f7eee9]">{isAr ? 'الفئة:' : 'Audience:'}</span>
                  <span>{isAr ? 'للنساء فقط' : 'Women Only'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-spa-text dark:text-[#f7eee9]">{isAr ? 'الحجز:' : 'Walk-ins:'}</span>
                  <span>{isAr ? 'مرحب به / يفضل الحجز' : 'Welcome / App Preferred'}</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-spa-cherry dark:text-spa-rose bg-spa-blush/60 dark:bg-[#2d211c] p-2.5 rounded-lg text-center font-medium">
              {isAr ? 'نوصي بحجز الموعد مسبقاً' : 'Appointments recommended'}
            </div>
          </div>
        </section>

        {/* Two-Column Section: Contact Form + Legal Business Statement */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#231a16] rounded-2xl p-8 sm:p-10 border border-spa-petal/70 dark:border-white/10 shadow-sm transition-colors duration-300">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-1">
                {isAr ? 'طلب واستفسار إلكتروني' : 'Online Inquiry'}
              </span>
              <h2 className="font-lustria text-2xl sm:text-3xl text-spa-text dark:text-[#f7eee9] mb-2 font-bold">
                {isAr ? 'أرسلي لنا رسالتكِ' : 'Send Us a Message'}
              </h2>
              <p className="text-xs sm:text-sm text-spa-muted dark:text-[#b5a49c] leading-relaxed">
                {isAr
                  ? 'لديكِ أي سؤال حول جلسات التدليك التايلاندي، أو باقات العناية، أو قسائم الهدايا؟ اتركي بياناتكِ وسيتواصل معكِ فريق الكونسيرج بكل سرور.'
                  : 'Have questions about our Thai massage therapies, special packages, or bookings? Leave your details below and our concierge team will respond promptly.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 px-4 bg-spa-cream/40 dark:bg-[#2a201b] rounded-xl border border-spa-petal/50 dark:border-white/10">
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="font-lustria text-2xl text-spa-text dark:text-[#f7eee9] mb-2 font-bold">
                  {isAr ? 'شكراً لتواصلكِ معنا!' : 'Thank You for Reaching Out!'}
                </h3>
                <p className="text-sm text-spa-muted dark:text-[#b5a49c] max-w-md mx-auto mb-6 leading-relaxed">
                  {isAr
                    ? 'تم استلام رسالتكِ بنجاح. ستقوم إحدى ممثلات معهد كوايت أوش للسبا الصحي التايلاندي للنساء بالتواصل معكِ قريباً.'
                    : 'We have received your message. A representative from Quiet Ush Thai Spa Health Institute for Women will get in touch with you shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="btn-spa btn-rose text-xs py-2.5 px-6"
                >
                  {isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-spa-text dark:text-[#f7eee9] mb-1.5">
                      {isAr ? 'الاسم بالكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: فاطمة الأحمد' : 'e.g. Fatima Al-Ahmad'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal/80 dark:border-white/10 bg-white dark:bg-[#2b201b] text-spa-text dark:text-white focus:outline-none focus:border-spa-cherry transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-spa-text dark:text-[#f7eee9] mb-1.5">
                      {isAr ? 'رقم الهاتف *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+965 XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal/80 dark:border-white/10 bg-white dark:bg-[#2b201b] text-spa-text dark:text-white focus:outline-none focus:border-spa-cherry transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-spa-text dark:text-[#f7eee9] mb-1.5">
                      {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal/80 dark:border-white/10 bg-white dark:bg-[#2b201b] text-spa-text dark:text-white focus:outline-none focus:border-spa-cherry transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-spa-text dark:text-[#f7eee9] mb-1.5">
                      {isAr ? 'الخدمة المطلوبة' : 'Service of Interest'}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal/80 dark:border-white/10 bg-white dark:bg-[#2b201b] text-spa-text dark:text-white focus:outline-none focus:border-spa-cherry transition-colors"
                    >
                      <option value="Traditional Thai Massage">{isAr ? 'المساج التايلاندي التقليدي' : 'Traditional Thai Massage'}</option>
                      <option value="Aromatherapy Body Massage">{isAr ? 'التدليك العطري المهدئ للجسم' : 'Aromatherapy Body Massage'}</option>
                      <option value="Hot Stone & Herbal Ball Therapy">{isAr ? 'علاج الأحجار الساخنة والكرات العشبية' : 'Hot Stone & Herbal Ball Therapy'}</option>
                      <option value="Facial Care & Rejuvenation">{isAr ? 'العناية بالوجه ونضارة البشرة' : 'Facial Care & Rejuvenation'}</option>
                      <option value="Body Scrub & Polishing">{isAr ? 'تقشير وتنعيم الجسم' : 'Body Scrub & Polishing'}</option>
                      <option value="Gift Card & Voucher Inquiry">{isAr ? 'استفسار عن قسائم وبطاقات الهدايا' : 'Gift Card & Voucher Inquiry'}</option>
                      <option value="General Question">{isAr ? 'استفسار عام' : 'General Question'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-spa-text dark:text-[#f7eee9] mb-1.5">
                    {isAr ? 'نص الرسالة *' : 'Your Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={isAr ? 'أخبرينا بالمواعيد المفضلة لديكِ أو أي تفاصيل ترغبين بمشاركتها معنا...' : 'Tell us about your preferred dates, party size, or specific requirements...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-spa-petal/80 dark:border-white/10 bg-white dark:bg-[#2b201b] text-spa-text dark:text-white focus:outline-none focus:border-spa-cherry transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-spa btn-rose text-xs py-3 px-8 w-full sm:w-auto uppercase tracking-wider font-semibold shadow-md"
                >
                  {isAr ? 'إرسال الاستفسار' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Business Verification & Entity Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#f5ede7] dark:bg-[#231a16] rounded-2xl p-8 border border-spa-petal/60 dark:border-white/10 transition-colors duration-300">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-1">
                {isAr ? 'إشعار التوثيق التجاري والقانوني' : 'Commercial Verification Notice'}
              </span>
              <h3 className="font-lustria text-xl font-bold text-spa-text dark:text-[#f7eee9] mb-3">
                {isAr
                  ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                  : 'Quiet Ush Thai Spa Health Institute for Women'}
              </h3>
              <p className="text-xs text-spa-muted dark:text-[#b5a49c] leading-relaxed mb-4">
                {isAr ? (
                  <>
                    هذا الموقع الإلكتروني وتطبيقات أوش سبا الذكية مملوكة وتدار بالكامل بواسطة{' '}
                    <strong className="text-spa-text dark:text-white">معهد كوايت أوش للسبا الصحي التايلاندي للنساء</strong>،
                    وهو معهد صحي تجاري مرخص ومعتمد وفقاً للقوانين التجارية واللوائح المنظمة في دولة الكويت.
                  </>
                ) : (
                  <>
                    This website and the official USH Spa mobile applications are owned and operated by{' '}
                    <strong className="text-spa-text dark:text-white">Quiet Ush Thai Spa Health Institute for Women</strong>,
                    a licensed commercial wellness institute registered and established under the commercial laws of the State of Kuwait.
                  </>
                )}
              </p>

              <div className="bg-white/80 dark:bg-[#2b201b] rounded-xl p-4 border border-spa-petal/50 dark:border-white/10 space-y-2.5 text-xs text-spa-muted dark:text-[#b5a49c] mb-6">
                <div>
                  <span className="block font-semibold text-spa-text dark:text-[#f7eee9]">
                    {isAr ? 'الاسم التجاري القانوني:' : 'Legal Business Name:'}
                  </span>
                  <span>{isAr ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء' : 'Quiet Ush Thai Spa Health Institute for Women'}</span>
                </div>
                <div>
                  <span className="block font-semibold text-spa-text dark:text-[#f7eee9]">
                    {isAr ? 'الاسم التسويقي المعتمد:' : 'Brand / Operating Name:'}
                  </span>
                  <span>USH Spa (أوش سبا)</span>
                </div>
                <div>
                  <span className="block font-semibold text-spa-text dark:text-[#f7eee9]">
                    {isAr ? 'العنوان المسجل:' : 'Registered Address:'}
                  </span>
                  <span>
                    {isAr
                      ? 'شارع الشهداء، قطعة 04، قسيمة 32، مبنى ناصر أحمد عبد اللطيف العثمان، مدينة الكويت، الشرق 15300، دولة الكويت'
                      : 'Al-Shuhada Street, Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman, Kuwait city, Sharq 15300, Kuwait'}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-spa-text dark:text-[#f7eee9]">
                    {isAr ? 'الاتصال الرسمي:' : 'Official Contact:'}
                  </span>
                  <span>{USH_EMAIL_DISPLAY} • {USH_PHONE_DISPLAY}</span>
                </div>
              </div>

              {/* Mobile App Download Card */}
              <div className="bg-white dark:bg-[#2b201b] rounded-xl p-5 border border-spa-petal/50 dark:border-white/10">
                <h4 className="font-lustria text-sm font-bold text-spa-text dark:text-[#f7eee9] mb-1">
                  {isAr ? '📱 احجزي فوراً عبر تطبيق الهاتف الذكي' : '📱 Book Instantly with the Mobile App'}
                </h4>
                <p className="text-xs text-spa-muted dark:text-[#b5a49c] mb-4">
                  {isAr
                    ? 'تصفحي العلاجات المتاحة، واختاري الأخصائية، وأتمي الحجز مباشرة عبر نظامي iOS و Android.'
                    : 'Browse treatments, choose your therapist, and book directly from iOS and Android.'}
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

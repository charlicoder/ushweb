'use client';

import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF, USH_EMAIL_DISPLAY, USH_EMAIL_MAILTO_HREF } from '@/lib/contact';
import { useState } from 'react';
import AppDownloadButtons from '@/components/AppDownloadButtons';
import { useApp } from '@/context/AppContext';

export default function BookingSection() {
    const { isAr } = useApp();
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
        <section id="booking" className="py-24 bg-[#fdf8f6] dark:bg-[#18110e] transition-colors duration-300">
            <div id="contact" className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Info */}
                    <div>
                        <span className="section-id text-spa-rose">
                            {isAr ? 'احجز الآن' : 'Book Now'}
                        </span>
                        <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-6 leading-tight transition-colors duration-300">
                            {isAr ? 'حددي موعد زيارتكِ الخاصة' : 'Schedule Your Visit'}
                        </h2>
                        <p className="text-spa-muted dark:text-[#b5a49c] leading-relaxed mb-6 transition-colors duration-300">
                            {isAr ? (
                                <>
                                    يرحب بكِ <strong className="text-spa-text dark:text-white">معهد كوايت أوش للسبا الصحي التايلاندي للنساء</strong> لتنغمسي
                                    في أروع لحظات الاسترخاء والعلاجات الطبيعية الأصيلة. احجزي جلستكِ عبر النموذج أو عبر تطبيقنا الذكي بكل سهولة وسرعة.
                                </>
                            ) : (
                                <>
                                    <strong className="text-spa-text dark:text-white">Quiet Ush Thai Spa Health Institute for Women</strong> welcomes you to experience the ultimate in
                                    relaxation and authentic wellness therapies. Book your appointment online or download our mobile app for instant reservations.
                                </>
                            )}
                        </p>

                        {/* App Download CTA - Hidden for now: can be unhidden later */}
                        {/*
                        <div className="bg-white dark:bg-[#231a16] p-6 rounded-xl shadow-spa border border-spa-petal/40 dark:border-white/10 mb-8 transition-colors duration-300">
                            <h5 className="font-lustria text-lg text-spa-text dark:text-[#f7eee9] mb-2 font-bold transition-colors duration-300">
                                {isAr ? '📱 الحجز الفوري عبر تطبيق الهاتف الذكي' : '📱 Book via Our Mobile App'}
                            </h5>
                            <p className="text-spa-muted dark:text-[#b5a49c] text-sm leading-relaxed mb-4 transition-colors duration-300">
                                {isAr
                                    ? 'حملي تطبيق أوش سبا الرسمي للحصول على حجوزات فورية، وعروض حصرية، وإمكانية اختيار الأخصائية المفضلة بكل خصوصية.'
                                    : 'Download the USH Spa app for instant booking, exclusive offers, and personalized wellness recommendations at your fingertips.'}
                            </p>
                            <AppDownloadButtons />
                        </div>
                        */}

                        {/* Contact & Legal Entity Info */}
                        <div className="flex flex-col gap-3.5 bg-spa-cream/60 dark:bg-[#231a16]/80 p-5 rounded-xl border border-spa-petal/50 dark:border-white/10 transition-colors duration-300">
                            <div>
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-spa-cherry dark:text-spa-rose block mb-0.5">
                                    {isAr ? 'الكيان القانوني والتجاري المعتمد' : 'Legal Business Entity'}
                                </span>
                                <h6 className="font-lustria font-bold text-spa-text dark:text-[#f7eee9] text-base leading-snug transition-colors duration-300">
                                    {isAr
                                        ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
                                        : 'Quiet Ush Thai Spa Health Institute for Women'}
                                </h6>
                                <p className="text-xs text-spa-muted dark:text-[#b5a49c]">
                                    {isAr ? 'يعمل تحت الاسم التجاري: أوش سبا (USH Spa)' : 'Operating as USH Spa'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-spa-muted dark:text-[#b5a49c] text-sm">
                                <span className="text-spa-rose text-lg">📞</span>
                                <a href={USH_PHONE_TEL_HREF} className="hover:text-spa-cherry dark:hover:text-white font-medium transition-colors">
                                    {USH_PHONE_DISPLAY}
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-spa-muted dark:text-[#b5a49c] text-sm">
                                <span className="text-spa-rose text-lg">✉️</span>
                                <a href={USH_EMAIL_MAILTO_HREF} className="hover:text-spa-cherry dark:hover:text-white font-medium transition-colors">
                                    {USH_EMAIL_DISPLAY}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-spa-muted dark:text-[#b5a49c] text-sm">
                                <span className="text-spa-rose text-lg mt-0.5">📍</span>
                                <div>
                                    <p className="font-medium text-spa-text dark:text-[#f7eee9]">
                                        {isAr ? 'شارع الشهداء، قطعة 04، مبنى 32' : 'Al-Shuhada Street'}
                                    </p>
                                    <p>{isAr ? 'مبنى ناصر أحمد عبد اللطيف العثمان' : 'Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman'}</p>
                                    <p>{isAr ? 'مدينة الكويت، الشرق 15300، دولة الكويت' : 'Kuwait city, Sharq 15300, Kuwait'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-white dark:bg-[#231a16] p-8 rounded-xl shadow-spa border border-spa-petal/40 dark:border-white/10 transition-colors duration-300">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">🌸</div>
                                <h4 className="font-lustria text-2xl text-spa-text dark:text-[#f7eee9] mb-3">
                                    {isAr ? 'تم استلام طلب الحجز!' : 'Booking Received!'}
                                </h4>
                                <p className="text-spa-muted dark:text-[#b5a49c] text-sm leading-relaxed max-w-sm mx-auto">
                                    {isAr
                                        ? 'شكراً لاختياركِ معهد أوش سبا. سيتواصل معكِ فريق الكونسيرج لتأكيد موعد الجلسة في أقرب وقت.'
                                        : 'Thank you for booking with USH Spa. We’ll confirm your appointment within 24 hours.'}
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-spa btn-rose mt-6 shadow-md"
                                >
                                    {isAr ? 'طلب موعد آخر' : 'Book Another'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <h4 className="font-lustria text-xl text-spa-text dark:text-[#f7eee9] mb-2 font-bold transition-colors duration-300">
                                    {isAr ? 'طلب حجز موعد جلسة' : 'Appointment Request'}
                                </h4>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-spa-muted dark:text-[#b5a49c] text-xs font-semibold mb-1.5">
                                            {isAr ? 'الاسم بالكامل *' : 'Full Name *'}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder={isAr ? 'مثال: فاطمة الأحمد' : 'Your full name'}
                                            className="w-full h-11 px-3.5 border border-spa-petal/80 dark:border-white/10 rounded-lg text-spa-text dark:text-white text-xs focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white dark:bg-[#2b201b]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-spa-muted dark:text-[#b5a49c] text-xs font-semibold mb-1.5">
                                            {isAr ? 'البريد الإلكتروني' : 'Email'}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={isAr ? 'your.email@example.com' : 'your@email.com'}
                                            className="w-full h-11 px-3.5 border border-spa-petal/80 dark:border-white/10 rounded-lg text-spa-text dark:text-white text-xs focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white dark:bg-[#2b201b]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-spa-muted dark:text-[#b5a49c] text-xs font-semibold mb-1.5">
                                        {isAr ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+965 XXXXXXXX"
                                        className="w-full h-11 px-3.5 border border-spa-petal/80 dark:border-white/10 rounded-lg text-spa-text dark:text-white text-xs focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white dark:bg-[#2b201b]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-spa-muted dark:text-[#b5a49c] text-xs font-semibold mb-1.5">
                                        {isAr ? 'ملاحظات أو رغبات خاصة للجلسة' : 'Special Requests'}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder={isAr ? 'أخبرينا بالخدمة المطلوبة أو التوقيت المفضل لديكِ...' : 'Any special requests or health considerations...'}
                                        className="w-full px-3.5 py-2.5 border border-spa-petal/80 dark:border-white/10 rounded-lg text-spa-text dark:text-white text-xs focus:outline-none focus:border-spa-rose transition-colors duration-300 bg-white dark:bg-[#2b201b] resize-none"
                                    />
                                </div>

                                <button type="submit" className="btn-spa btn-rose w-full text-xs py-3.5 mt-2 uppercase tracking-wider font-semibold shadow-md">
                                    {isAr ? 'إرسال طلب الحجز' : 'Request Appointment'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

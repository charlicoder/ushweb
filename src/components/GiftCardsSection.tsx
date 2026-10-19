'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  GiftIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface PopularGiftService {
  id: string;
  nameEn: string;
  nameAr: string;
  duration: string;
  durationAr: string;
  price: string;
  categoryEn: string;
  categoryAr: string;
  image: string;
  descEn: string;
  descAr: string;
}

const POPULAR_GIFTS: PopularGiftService[] = [
  {
    id: '953dc4fa-7328-4894-8720-0f9ff36134a7',
    nameEn: 'Royal Moroccan Bath',
    nameAr: 'الحمام المغربي الملكي',
    duration: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '22.000 KWD',
    categoryEn: 'Moroccan Ritual',
    categoryAr: 'حمام مغربي',
    image: 'https://d3q16ie8zzbnic.cloudfront.net/services/service/953dc4fa-7328-4894-8720-0f9ff36134a7/1baae7dee45640ca8bbd97a8142a44a0_medium.webp',
    descEn: 'Authentic steam, Moroccan black soap exfoliation, and pure body hydration.',
    descAr: 'بخار مغربي أصيل مع الصابون الأسود والتقشير العميق وترطيب البشرة.',
  },
  {
    id: 'ee9714f0-6022-4d8e-9148-7a805359911d',
    nameEn: 'Traditional Thai Massage',
    nameAr: 'المساج التايلاندي التقليدي',
    duration: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    categoryEn: 'Signature Massage',
    categoryAr: 'مساج أصيل',
    image: 'https://d3q16ie8zzbnic.cloudfront.net/services/service/ee9714f0-6022-4d8e-9148-7a805359911d/1ee40a8be6ca46f6b0f81d86f78f6572_medium.webp',
    descEn: 'Ancient therapeutic pressure and stretching techniques by certified Thai therapists.',
    descAr: 'تقنيات التمدد والضغط الإبري القديمة بأيدي أخصائيات تايلانديات محترفات.',
  },
  {
    id: '8fd61993-554b-4cbb-9eb8-caf9c013c1bf',
    nameEn: 'Royal Package (Private Suite)',
    nameAr: 'الباقة الملكية الفاخرة (جناح خاص)',
    duration: '180 Mins',
    durationAr: '١٨٠ دقيقة',
    price: '66.000 KWD',
    categoryEn: 'Full Day Pampering',
    categoryAr: 'باقة متكاملة',
    image: 'https://d3q16ie8zzbnic.cloudfront.net/services/service/8fd61993-554b-4cbb-9eb8-caf9c013c1bf/b77f9cf8cfbf440096ce17bb8b368735_medium.webp',
    descEn: 'The ultimate 3-hour indulgence: Moroccan bath, relaxing massage, jacuzzi, and sauna.',
    descAr: 'تجربة ملكية استثنائية: حمام مغربي، مساج كامل، جاكوزي خاص وساونا.',
  },
];

export default function GiftCardsSection() {
  const { isAr } = useApp();
  const ArrowIcon = isAr ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <section id="gift-cards" className="py-20 md:py-28 bg-[#FAF5EE] dark:bg-[#17110e] transition-colors duration-300 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#543C30]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#543C30]/10 dark:bg-white/10 text-[#543C30] dark:text-[#f5d5cf] text-xs font-bold uppercase tracking-wider mb-4 border border-[#A37854]/20">
            <GiftIcon className="w-4 h-4 text-[#C5A059]" />
            <span>{isAr ? 'قسائم الإهداء الفاخرة' : 'Luxury Spa Gift Vouchers'}</span>
          </div>

          <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-[#543C30] dark:text-[#f7eee9] font-bold tracking-tight mb-5 leading-tight">
            {isAr ? 'شاركي من تحبين لحظات من الدلال والاسترخاء' : 'Share Moments of Pure Luxury & Pampering'}
          </h2>

          <p className="text-[#8A6D5F] dark:text-[#b5a49c] text-sm sm:text-base md:text-lg leading-relaxed">
            {isAr
              ? 'أهدي من تعزين قسيمة سبا رقمية راقية مع معهد كوايت أوش للسبا التايلاندي. اختاري جلسة علاجية محددة أو رصيداً نقدياً، مع بطاقة إهداء مخصصة وتسليم فوري عبر واتساب أو رسالة نصية.'
              : 'Gift someone special a bespoke wellness experience at Quiet Ush Thai Spa. Choose any signature treatment or a flexible credit balance, personalized with a heartfelt greeting and delivered instantly.'}
          </p>
        </div>

        {/* 2-Column Showcase: Features & Live Voucher Mockup */}
        <div className="grid lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Column: 4 Distinct Gift Voucher Features */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1f1713] border border-[#A37854]/20 shadow-xs hover:border-[#A37854]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#543C30]/10 text-[#543C30] dark:text-[#f5d5cf] grid place-items-center mb-3">
                  <SparklesIcon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="font-bold text-[#543C30] dark:text-white text-base mb-1.5">
                  {isAr ? 'خدمة محددة أو رصيد نقدي' : 'Specific Service or Credit'}
                </h4>
                <p className="text-xs text-[#8A6D5F] dark:text-[#b5a49c] leading-relaxed">
                  {isAr
                    ? 'أهدي جلسة تدليك، حمام مغربي، باقة ملكية، أو اختاري مبلغاً مرناً تحددينه بنفسكِ.'
                    : 'Gift a targeted massage, Moroccan bath, full royal package, or a custom KWD voucher amount.'}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1f1713] border border-[#A37854]/20 shadow-xs hover:border-[#A37854]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#543C30]/10 text-[#543C30] dark:text-[#f5d5cf] grid place-items-center mb-3">
                  <HeartIcon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="font-bold text-[#543C30] dark:text-white text-base mb-1.5">
                  {isAr ? 'رسالة وبطاقة إهداء مخصصة' : 'Personalized Message & Theme'}
                </h4>
                <p className="text-xs text-[#8A6D5F] dark:text-[#b5a49c] leading-relaxed">
                  {isAr
                    ? 'اكتبي كلماتكِ الخاصة وأسماء الإهداء واختاري ثيم البطاقة الفاخر الذي يناسب المناسبة.'
                    : 'Add heartfelt words, sender and recipient details, and choose an exquisite greeting design.'}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1f1713] border border-[#A37854]/20 shadow-xs hover:border-[#A37854]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#543C30]/10 text-[#543C30] dark:text-[#f5d5cf] grid place-items-center mb-3">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="font-bold text-[#543C30] dark:text-white text-base mb-1.5">
                  {isAr ? 'تسليم فوري عبر واتساب / SMS' : 'Instant WhatsApp / SMS Delivery'}
                </h4>
                <p className="text-xs text-[#8A6D5F] dark:text-[#b5a49c] leading-relaxed">
                  {isAr
                    ? 'يصل الإهداء مباشرة لهاتف المستلمة برابط إلكتروني فاخر وتفاصيل الحجز في التوقيت الذي تفضلينه.'
                    : 'Delivered directly to her phone with a luxury digital certificate link and seamless appointment booking.'}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1f1713] border border-[#A37854]/20 shadow-xs hover:border-[#A37854]/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#543C30]/10 text-[#543C30] dark:text-[#f5d5cf] grid place-items-center mb-3">
                  <BuildingStorefrontIcon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="font-bold text-[#543C30] dark:text-white text-base mb-1.5">
                  {isAr ? 'مرونة الفروع وإضافات السبا' : 'Branch Flexibility & Add-ons'}
                </h4>
                <p className="text-xs text-[#8A6D5F] dark:text-[#b5a49c] leading-relaxed">
                  {isAr
                    ? 'صالحة في فرعي شرق والمنقف لمدة عام كامل، مع إمكانية إضافة الجاكوزي، الساونا، أو كاسات الهواء.'
                    : 'Valid for 12 months at Sharq and Mangaf branches, with optional luxury add-ons like jacuzzi & sauna.'}
                </p>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="p-4 rounded-2xl bg-[#EAE5DF] dark:bg-[#201814] border border-[#A37854]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#543C30] dark:text-[#f5d5cf]">
                <CheckBadgeIcon className="w-5 h-5 text-[#C5A059] shrink-0" />
                <span>
                  {isAr
                    ? 'دفع إلكتروني آمن وسريع عبر كي نت (KNET)، فيزا، ماستركارد، و Apple Pay.'
                    : 'Secure instant online checkout via KNET, Visa, Mastercard, and Apple Pay.'}
                </span>
              </div>
              <Link
                href="/gift-voucher"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#543C30] hover:bg-[#684b3d] text-white text-xs font-bold shadow-md transition whitespace-nowrap cursor-pointer"
              >
                <span className="text-white">{isAr ? 'صممي قسيمتكِ الآن' : 'Create Gift Voucher'}</span>
                <ArrowIcon className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Right Column: Realistic Luxury Gift Card Visual Preview */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Gold luxury glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#C5A059] via-[#A37854] to-[#C5A059] opacity-30 blur-lg" />

              {/* Physical/Digital Voucher Card Replica */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#543C30] via-[#463126] to-[#2e1f18] p-6 sm:p-7 text-white shadow-2xl border-2 border-[#C5A059]/40 overflow-hidden">
                {/* Decorative watermarks */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#A37854]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top: Brand and Ribbon */}
                <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-4 mb-5">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C5A059] block">
                      {isAr ? 'معهد أوش سبا الصحي للسيدات' : 'Quiet Ush Thai Spa for Women'}
                    </span>
                    <h3 className="font-lustria text-xl font-bold text-white tracking-wide">
                      {isAr ? 'قسيمة إهداء فاخرة' : 'Luxury Gift Certificate'}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#997736] p-0.5 shadow-md flex items-center justify-center">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Card Body: Interactive Sample Information */}
                <div className="space-y-3.5 mb-6">
                  <div className="flex items-center justify-between text-xs bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[#f5d5cf]/70">{isAr ? 'مُقدمة إلى:' : 'Presented To:'}</span>
                    <span className="font-bold text-[#C5A059] text-sm">
                      {isAr ? 'إلى أغلى الناس' : 'Someone Special'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[#f5d5cf]/70">{isAr ? 'التجربة المختارة:' : 'Chosen Experience:'}</span>
                    <span className="font-bold text-white">
                      {isAr ? 'حمام مغربي ملكي أو باقة استرخاء' : 'Royal Moroccan Bath / Spa Session'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 text-center">
                    <p className="text-[11px] text-[#f5d5cf] italic leading-relaxed">
                      {isAr
                        ? '«أتمنى لكِ يوماً حافلاً بالراحة والسكينة والجمال.. تستحقين كل الدلال.»'
                        : '“Wishing you a serene day of pure rejuvenation, beauty, and peace. You deserve it all.”'}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Code & Details */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#f5d5cf]/80">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-[#C5A059]">
                      {isAr ? 'رمز القسيمة' : 'Voucher Code'}
                    </div>
                    <div className="font-mono font-bold tracking-widest text-white text-xs">
                      USH-GIFT-••••
                    </div>
                  </div>
                  <div className="text-right rtl:text-left">
                    <div className="text-[9px] uppercase tracking-wider text-[#C5A059]">
                      {isAr ? 'الفروع المعتمدة' : 'Valid At'}
                    </div>
                    <div className="font-semibold text-white">
                      {isAr ? 'فرع شرق • فرع المنقف' : 'Sharq • Mangaf'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Gift Treatments with Direct Links */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-lustria text-2xl sm:text-3xl font-bold text-[#543C30] dark:text-[#f7eee9]">
                {isAr ? 'الجلسات الأكثر طلباً للإهداء' : 'Most Popular Gift Treatments'}
              </h3>
              <p className="text-xs sm:text-sm text-[#8A6D5F] dark:text-[#b5a49c] mt-1">
                {isAr
                  ? 'اختاري مباشرة إحدى جلساتنا الاستثنائية الأكثر إهداءً وضعي اسم المستلمة ورسالتكِ الخاصة.'
                  : 'Select one of our signature treatments, customize your message, and send instantly.'}
              </p>
            </div>

            <Link
              href="/gift-voucher"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#A37854] hover:text-[#543C30] dark:text-[#C5A059] transition"
            >
              <span>{isAr ? 'استعراض كافة خيارات الإهداء' : 'Explore All Gift Options'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {POPULAR_GIFTS.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl bg-white dark:bg-[#1e1612] border border-[#A37854]/20 shadow-sm hover:shadow-xl hover:border-[#A37854]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                        <CalendarDaysIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{isAr ? item.durationAr : item.duration}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#543C30]/90 backdrop-blur-md text-[#f5d5cf] text-[10px] font-bold border border-[#A37854]/40">
                        {isAr ? item.categoryAr : item.categoryEn}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h4 className="font-lustria text-lg font-bold text-[#543C30] dark:text-[#f7eee9] group-hover:text-[#A37854] transition-colors mb-2">
                      {isAr ? item.nameAr : item.nameEn}
                    </h4>
                    <p className="text-xs text-[#8A6D5F] dark:text-[#b5a49c] line-clamp-2 leading-relaxed mb-4">
                      {isAr ? item.descAr : item.descEn}
                    </p>
                  </div>
                </div>

                {/* Footer Price + Gift Action */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-[#A37854]/15 mb-4">
                    <span className="text-xs text-spa-muted font-medium">
                      {isAr ? 'قيمة القسيمة' : 'Gift Value'}
                    </span>
                    <span className="font-lustria text-xl font-bold text-[#543C30] dark:text-[#f5d5cf]">
                      {item.price}
                    </span>
                  </div>

                  <Link
                    href={`/gift-voucher?service_id=${item.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs font-bold shadow-md transition cursor-pointer"
                  >
                    <GiftIcon className="w-4 h-4 text-white shrink-0" />
                    <span className="text-white">{isAr ? 'إهداء هذه الجلسة الآن' : 'Gift This Treatment'}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
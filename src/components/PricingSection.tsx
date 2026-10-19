'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  SparklesIcon,
  ClockIcon,
  GiftIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export interface PricingServiceItem {
  id: string;
  nameEn: string;
  nameAr: string;
  durationEn: string;
  durationAr: string;
  price: string;
  category: 'massage' | 'package_bath';
  isPopular?: boolean;
}

// Full official list of all active services and exact prices from the /services page API
const INITIAL_SERVICES: PricingServiceItem[] = [
  // ─── Massages & Body Therapies ─────────────────────────────────────────────
  {
    id: 'ee9714f0-6022-4d8e-9148-7a805359911d',
    nameEn: 'Traditional Thai Massage',
    nameAr: 'المساج التايلاندي التقليدي',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    category: 'massage',
    isPopular: true,
  },
  {
    id: 'eb64ef3b-daea-43b6-a3c2-0ee5e6f9137a',
    nameEn: 'Swedish Relaxing Massage',
    nameAr: 'المساج السويدي المهدئ',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    category: 'massage',
  },
  {
    id: '89661b9a-3f0c-43bb-a0e9-b8cb4013e8ff',
    nameEn: 'Herbal Compress Massage',
    nameAr: 'مساج الأعشاب التايلاندي الدافئ',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '25.000 KWD',
    category: 'massage',
  },
  {
    id: '1308168d-5e63-41d1-a82b-641a95428cae',
    nameEn: 'Hot Stone Therapy Massage',
    nameAr: 'مساج الأحجار البركانية الساخنة',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '25.000 KWD',
    category: 'massage',
  },
  {
    id: 'b3d1dfcc-3bef-4851-be9d-6c7c2c47f78e',
    nameEn: 'Royal Massage (Private Suite)',
    nameAr: 'المساج الملكي (جناح خاص)',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '34.000 KWD',
    category: 'massage',
    isPopular: true,
  },
  {
    id: 'fa974edd-e7fb-478d-b5cf-56f48e0a5303',
    nameEn: 'Wooden Lymphatic Slimming Massage',
    nameAr: 'المساج اللمفاوي الخشبي (نحت الجسم)',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '25.000 KWD',
    category: 'massage',
  },
  {
    id: 'c27d4f90-c9f6-4d4b-b8a1-6a06b37d428f',
    nameEn: 'Stress Relief Massage',
    nameAr: 'مساج إزالة التوتر والإجهاد',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    category: 'massage',
  },
  {
    id: '2eddbc5e-7c55-4e3e-ac6c-b66fbc51ca60',
    nameEn: 'Deep Therapeutic Massage',
    nameAr: 'المساج العلاجي المكثف',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    category: 'massage',
  },
  {
    id: 'aaf89c82-a06a-4622-bea5-e385f504e29a',
    nameEn: 'Prenatal Massage (Pregnant)',
    nameAr: 'مساج الاسترخاء المخصص للحوامل',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    category: 'massage',
  },
  {
    id: '3d9e3652-790a-42fe-88e8-75f1ad876113',
    nameEn: 'Postnatal Recovery Massage',
    nameAr: 'مساج التعافي بعد الولادة',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '24.000 KWD',
    category: 'massage',
  },
  {
    id: 'fca78717-6e50-46e6-b14d-e5203c4e1b1c',
    nameEn: 'Reflexology Foot Massage',
    nameAr: 'مساج القدمين الانعكاسي',
    durationEn: '45 Mins',
    durationAr: '٤٥ دقيقة',
    price: '15.000 KWD',
    category: 'massage',
  },

  // ─── Royal Packages, Moroccan Baths & Scalp Detox ──────────────────────────
  {
    id: '8fd61993-554b-4cbb-9eb8-caf9c013c1bf',
    nameEn: 'Royal Package (Private Suite)',
    nameAr: 'الباقة الملكية الفاخرة (جناح خاص)',
    durationEn: '180 Mins',
    durationAr: '١٨٠ دقيقة',
    price: '66.000 KWD',
    category: 'package_bath',
    isPopular: true,
  },
  {
    id: 'e87ff14c-e16f-48e1-8e08-ea701d20d8d5',
    nameEn: 'Signature Package',
    nameAr: 'باقة أوش المميزة (سيجنتشر)',
    durationEn: '180 Mins',
    durationAr: '١٨٠ دقيقة',
    price: '61.000 KWD',
    category: 'package_bath',
    isPopular: true,
  },
  {
    id: '9c84ec3c-ee2b-4e2e-8f3a-9c49a2f26538',
    nameEn: 'Pampering Package',
    nameAr: 'باقة الدلال والاستجمام',
    durationEn: '120 Mins',
    durationAr: '١٢٠ دقيقة',
    price: '44.000 KWD',
    category: 'package_bath',
  },
  {
    id: '3bfc3d45-b465-4674-b456-27ab4f2a4338',
    nameEn: 'Light Luxury Package',
    nameAr: 'باقة الرفاهية والاسترخاء الخفيف',
    durationEn: '90 Mins',
    durationAr: '٩٠ دقيقة',
    price: '39.000 KWD',
    category: 'package_bath',
  },
  {
    id: '3a1b5b6e-47fe-414e-af6a-569ab585e643',
    nameEn: 'Moroccan Bath USH',
    nameAr: 'حمام كوايت أوش المغربي',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '27.000 KWD',
    category: 'package_bath',
    isPopular: true,
  },
  {
    id: '953dc4fa-7328-4894-8720-0f9ff36134a7',
    nameEn: 'Royal Moroccan Bath',
    nameAr: 'الحمام المغربي الملكي',
    durationEn: '60 Mins',
    durationAr: '٦٠ دقيقة',
    price: '22.000 KWD',
    category: 'package_bath',
  },
  {
    id: '6422fe97-902f-4fa1-91c4-8e78ff09eed3',
    nameEn: 'Japanese Hair & Scalp Detox',
    nameAr: 'ديتوكس الشعر وفروة الرأس الياباني',
    durationEn: '45 Mins',
    durationAr: '٤٥ دقيقة',
    price: '20.000 KWD',
    category: 'package_bath',
  },
];

export default function PricingSection() {
  const { isAr } = useApp();
  const ArrowIcon = isAr ? ArrowLeftIcon : ArrowRightIcon;
  const [services, setServices] = useState<PricingServiceItem[]>(INITIAL_SERVICES);

  // Optionally fetch real-time updates from /uauth/api/v1/services on client mount
  useEffect(() => {
    let isMounted = true;
    fetch('/uauth/api/v1/services?page_size=100')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json || !json.data) return;
        const apiData: any[] = json.data;

        // Map fresh prices and durations
        setServices((prev) =>
          prev.map((item) => {
            const match = apiData.find((a) => a.id === item.id || a.name?.toLowerCase() === item.nameEn.toLowerCase());
            if (match && match.base_price) {
              const numPrice = parseFloat(match.base_price);
              const formattedPrice = !isNaN(numPrice) ? `${numPrice.toFixed(3)} ${match.currency || 'KWD'}` : item.price;
              const durMinutes = match.duration_minutes || parseInt(item.durationEn);
              return {
                ...item,
                price: formattedPrice,
                durationEn: `${durMinutes} Mins`,
                durationAr: `${durMinutes} دقيقة`,
              };
            }
            return item;
          })
        );
      })
      .catch(() => {
        // Fallback to static INITIAL_SERVICES if offline or local network issue
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const massageList = services.filter((s) => s.category === 'massage');
  const packageList = services.filter((s) => s.category === 'package_bath');

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#FAF5EE] dark:bg-[#140f0c] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#543C30]/10 dark:bg-white/10 text-[#543C30] dark:text-[#f5d5cf] text-xs font-bold uppercase tracking-wider mb-4 border border-[#A37854]/20">
            <SparklesIcon className="w-4 h-4 text-[#C5A059]" />
            <span>{isAr ? 'قائمة الأسعار المعتمدة' : 'Official Spa Pricing'}</span>
          </div>

          <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-[#543C30] dark:text-[#f7eee9] font-bold tracking-tight mb-5 leading-tight">
            {isAr ? 'أسعار واضحة وباقات مدروسة' : 'Transparent Pricing'}
          </h2>

          <p className="text-[#8A6D5F] dark:text-[#b5a49c] text-sm sm:text-base md:text-lg leading-relaxed">
            {isAr
              ? 'نلتزم بالوضوح والشفافية التامة دون أي رسوم خفية. تشمل جميع جلساتنا الاستشارة الفردية، والضيافة التايلاندية الفاخرة، والعناية الفائقة بأيدي خبيرات معتمدات.'
              : 'We believe in honest, transparent pricing with no hidden charges. All sessions include private consultation, authentic hospitality, and certified professional care.'}
          </p>
        </div>

        {/* 2-Column Responsive Pricing Lists */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-14">
          {/* Column 1: Massages & Specialized Body Therapies */}
          <div className="bg-white dark:bg-[#1f1713] p-6 sm:p-8 rounded-3xl border border-[#A37854]/20 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#A37854]/15">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A37854] block">
                  {isAr ? 'جلسات الاسترخاء والعلاج' : 'Therapeutic & Relaxation'}
                </span>
                <h3 className="font-lustria text-xl sm:text-2xl font-bold text-[#543C30] dark:text-[#f7eee9]">
                  {isAr ? 'جلسات التدليك والمساج' : 'Massages & Therapies'}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#281e19] text-[#543C30] dark:text-[#f5d5cf] border border-[#A37854]/20">
                {isAr ? `${massageList.length} جلسة` : `${massageList.length} Treatments`}
              </span>
            </div>

            <ul className="divide-y divide-[#A37854]/10">
              {massageList.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#FAF5EE]/50 dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-lustria text-sm sm:text-base font-bold text-[#543C30] dark:text-[#f7eee9] group-hover:text-[#A37854] transition-colors">
                        {isAr ? item.nameAr : item.nameEn}
                      </h4>
                      {item.isPopular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#73531b] dark:text-[#f7e0a3] text-[10px] font-bold">
                          {isAr ? 'شائع' : 'Popular'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-spa-muted">
                      <ClockIcon className="w-3.5 h-3.5 text-[#A37854]" />
                      <span>{isAr ? item.durationAr : item.durationEn}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="font-lustria text-base sm:text-lg font-bold text-[#543C30] dark:text-[#f5d5cf]">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/gift-voucher?service_id=${item.id}`}
                        title={isAr ? 'إهداء كقسيمة' : 'Gift as Voucher'}
                        className="p-2 rounded-lg bg-[#C5A059] hover:bg-[#b08d47] text-white transition shadow-xs cursor-pointer"
                      >
                        <GiftIcon className="w-4 h-4 text-white" />
                      </Link>
                      <a
                        href="/#booking"
                        title={isAr ? 'حجز موعد' : 'Book Appointment'}
                        className="p-2 rounded-lg bg-[#543C30] hover:bg-[#684b3d] text-white transition shadow-xs cursor-pointer"
                      >
                        <CalendarDaysIcon className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Royal Packages & Moroccan Baths */}
          <div className="bg-white dark:bg-[#1f1713] p-6 sm:p-8 rounded-3xl border border-[#A37854]/20 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#A37854]/15">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A37854] block">
                  {isAr ? 'الباقات الفاخرة والطقوس المغربية' : 'Royal Suites & Moroccan Rituals'}
                </span>
                <h3 className="font-lustria text-xl sm:text-2xl font-bold text-[#543C30] dark:text-[#f7eee9]">
                  {isAr ? 'الباقات الملكية والحمام المغربي' : 'Royal Packages & Baths'}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF5EE] dark:bg-[#281e19] text-[#543C30] dark:text-[#f5d5cf] border border-[#A37854]/20">
                {isAr ? `${packageList.length} باقة` : `${packageList.length} Packages`}
              </span>
            </div>

            <ul className="divide-y divide-[#A37854]/10">
              {packageList.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#FAF5EE]/50 dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-lustria text-sm sm:text-base font-bold text-[#543C30] dark:text-[#f7eee9] group-hover:text-[#A37854] transition-colors">
                        {isAr ? item.nameAr : item.nameEn}
                      </h4>
                      {item.isPopular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#73531b] dark:text-[#f7e0a3] text-[10px] font-bold">
                          {isAr ? 'ملكي' : 'Royal'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-spa-muted">
                      <ClockIcon className="w-3.5 h-3.5 text-[#A37854]" />
                      <span>{isAr ? item.durationAr : item.durationEn}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="font-lustria text-base sm:text-lg font-bold text-[#543C30] dark:text-[#f5d5cf]">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/gift-voucher?service_id=${item.id}`}
                        title={isAr ? 'إهداء كقسيمة' : 'Gift as Voucher'}
                        className="p-2 rounded-lg bg-[#C5A059] hover:bg-[#b08d47] text-white transition shadow-xs cursor-pointer"
                      >
                        <GiftIcon className="w-4 h-4 text-white" />
                      </Link>
                      <a
                        href="/#booking"
                        title={isAr ? 'حجز موعد' : 'Book Appointment'}
                        className="p-2 rounded-lg bg-[#543C30] hover:bg-[#684b3d] text-white transition shadow-xs cursor-pointer"
                      >
                        <CalendarDaysIcon className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Banner: Direct Link to /services & Booking CTA */}
        <div className="bg-[#543C30] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl text-center md:text-left rtl:md:text-right">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C5A059] font-bold mb-3 border border-white/15">
              <SparklesIcon className="w-4 h-4 text-[#C5A059]" />
              <span>{isAr ? 'استكشاف شامل للخدمات' : 'Explore Full Services Directory'}</span>
            </span>
            <h3 className="font-lustria text-2xl sm:text-3xl font-bold mb-2">
              {isAr ? 'ترغبين بالاطلاع على تفاصيل الجلسات والإضافات؟' : 'Looking for complete session details & add-ons?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#f5d5cf]/90 leading-relaxed">
              {isAr
                ? 'تصفحي صفحة الخدمات الجديدة للتعرف على محتويات كل باقة، تفاصيل الحمام المغربي، خيارات الجاكوزي والساونا، والفروع المتاحة.'
                : 'Browse our dedicated Services page to view full descriptions, Moroccan bath rituals, private jacuzzi & sauna add-ons, and branch availability.'}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C5A059] hover:bg-[#b08d47] text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              <span className="text-white">{isAr ? 'عرض كافة الخدمات والتفاصيل' : 'View All Services'}</span>
              <ArrowIcon className="w-4 h-4 text-white" />
            </Link>

            <a
              href="/#booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition cursor-pointer"
            >
              <CalendarDaysIcon className="w-4 h-4 text-white" />
              <span className="text-white">{isAr ? 'حجز موعد الآن' : 'Book Appointment'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

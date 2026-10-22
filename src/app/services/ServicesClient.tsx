'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useApp } from '@/context/AppContext';
import {
  SparklesIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  GiftIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TagIcon,
  ShieldCheckIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

export interface ServiceAddon {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  price: string;
  currency: string;
  duration_minutes: number;
}

export interface ServiceBranch {
  branch_id?: string;
  id?: string;
  name: string;
  name_ar?: string;
  city?: string;
  address?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  duration_minutes: number;
  base_price: string;
  current_price?: string;
  currency: string;
  image?: string | null;
  image1?: string | null;
  primary_image?: string | null;
  price_in_points?: number;
  loyalty_points?: number;
  is_for_female?: boolean;
  is_for_male?: boolean;
  is_home_service_eligible?: boolean;
  is_featured?: boolean;
  is_packaged_services?: boolean;
  branches?: ServiceBranch[];
  addons?: ServiceAddon[];
  sort_order?: number;
}

// Arabic display translations for common service names if missing in raw data
const ARABIC_TITLES_MAP: Record<string, string> = {
  'ROYAL PACKAGE': 'الباقة الملكية الفاخرة',
  'HERBEL MASSAGE': 'مساج الأعشاب التايلاندي الدافئ',
  'Moroccan bath USH': 'حمام كوايت أوش المغربي الفاخر',
  'Royal Moroccan bath': 'الحمام المغربي الملكي التراثي',
  'LIGHT LUXURY PACKAGE': 'باقة الرفاهية والاسترخاء الخفيف',
  'Combination Massage': 'التدليك المزدوج المتكامل',
  'Special Care Solutions': 'حلول العناية المتخصصة بالبشرة',
  'Relaxing Body Treatments': 'علاجات الجسم المهدئة والمغذية',
  'Oils & Aromatherapy': 'الزيوت وجلسات الروائح العطرية',
};

export default function ServicesClient() {
  const { isAr } = useApp();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration'>('recommended');

  // Modal Detail
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Fetch Services from API: GET /uauth/api/v1/services/
  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/uauth/api/v1/services?page_size=100', {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': isAr ? 'ar' : 'en',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load services (status: ${res.status})`);
      }

      const json = await res.json();
      const rawList = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.results)
        ? json.results
        : [];

      setServices(rawList);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(
        isAr
          ? 'تعذر تحميل الخدمات حالياً. يرجى إعادة المحاولة.'
          : 'Unable to load services at this time. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [isAr]);

  // Extract unique branches
  const availableBranches = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((s) => {
      s.branches?.forEach((b) => {
        const id = b.branch_id || b.id;
        if (id && b.name) {
          map.set(id, b.name);
        }
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [services]);

  // Categorize services based on name & attributes
  const categorize = (item: ServiceItem): string => {
    const name = (item.name || '').toUpperCase();
    if (item.is_packaged_services || name.includes('PACKAGE')) return 'package';
    if (name.includes('MOROCCAN') || name.includes('BATH') || name.includes('مغربي') || name.includes('حمام')) return 'moroccan';
    if (name.includes('MASSAGE') || name.includes('مساج') || name.includes('HERBEL')) return 'massage';
    if (name.includes('FACIAL') || name.includes('SKIN') || name.includes('بشرة') || name.includes('ذهب') || name.includes('GOLD')) return 'skincare';
    return 'wellness';
  };

  // Filter & Sort
  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameEn = (s.name || s.name_en || '').toLowerCase();
          const nameAr = (s.name_ar || ARABIC_TITLES_MAP[s.name] || '').toLowerCase();
          const desc = (s.description || '').toLowerCase();
          if (!nameEn.includes(q) && !nameAr.includes(q) && !desc.includes(q)) {
            return false;
          }
        }

        // Branch filter
        if (selectedBranch !== 'all') {
          const hasBranch = s.branches?.some((b) => (b.branch_id || b.id) === selectedBranch);
          if (!hasBranch) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const cat = categorize(s);
          if (cat !== selectedCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.base_price || a.current_price || '0');
        const priceB = parseFloat(b.base_price || b.current_price || '0');
        const durA = a.duration_minutes || 60;
        const durB = b.duration_minutes || 60;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'duration') return durA - durB;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
  }, [services, searchQuery, selectedBranch, selectedCategory, sortBy]);

  // Helper for service image
  const getServiceImage = (s: ServiceItem) => {
    return (
      s.image1 ||
      s.image ||
      s.primary_image ||
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
    );
  };

  // Helper for title
  const getServiceTitle = (s: ServiceItem) => {
    if (isAr) {
      return s.name_ar || ARABIC_TITLES_MAP[s.name] || s.name;
    }
    return s.name_en || s.name;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE5DF] dark:bg-[#140f0c] text-spa-text dark:text-[#f7eee9] antialiased transition-colors duration-300">
      {/* Global Navigation Header */}
      <Header />

      {/* Hero Header Banner */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-[#543C30] via-[#63483b] to-[#543C30] text-white shadow-lg overflow-hidden">
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#A37854]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#f5d5cf] text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
            <SparklesIcon className="w-4 h-4 text-[#C5A059]" />
            <span>{isAr ? 'علاجات استثنائية للعناية والجمال' : 'Exceptional Wellness & Beauty'}</span>
          </div>

          <h1 className="font-lustria text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white mb-4 leading-tight">
            {isAr ? 'خدماتنا وتجارب السبا الفاخرة' : 'Our Signature Spa Services'}
          </h1>

          <p className="font-light text-sm sm:text-base md:text-lg text-[#f5d5cf]/90 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'معهد كوايت أوش للسبا الصحي التايلاندي للنساء — اكتشفي باقاتنا الملكية، وجلسات التدليك العلاجي، والحمام المغربي الفاخر المصممة لراحتكِ التامة.'
              : 'Quiet Ush Thai Spa Health Institute for Women — Discover our royal packages, therapeutic Thai massages, and Moroccan baths designed for your ultimate renewal.'}
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-8 pt-6 border-t border-white/15 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#C5A059]">100%</div>
              <div className="text-xs text-white/70">{isAr ? 'خصوصية تامة للسيدات' : 'Women Only Privacy'}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#C5A059]">18+</div>
              <div className="text-xs text-white/70">{isAr ? 'جلسة سبا فاخرة' : 'Signature Sessions'}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#C5A059]">2</div>
              <div className="text-xs text-white/70">{isAr ? 'فرعان في الكويت' : 'Prime Branches'}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#C5A059]">★★★★★</div>
              <div className="text-xs text-white/70">{isAr ? 'تقييم رضا العملاء' : 'Guest Satisfaction'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls Bar: Search, Category Tabs, Branch & Sorting */}
        <div className="mb-10 space-y-5">
          {/* Search + Sorting row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#1f1713] p-4 rounded-2xl shadow-sm border border-[#A37854]/20">
            {/* Search Input */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 text-spa-muted ${isAr ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحثي عن خدمة، باقة، أو علاج...' : 'Search services, packages, or treatments...'}
                className={`w-full py-2.5 bg-[#FAF5EE] dark:bg-[#281e19] text-sm text-foreground rounded-xl border border-transparent focus:border-[#A37854] focus:outline-none transition-all ${
                  isAr ? 'pr-11 pl-9' : 'pl-11 pr-9'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 p-1 text-spa-muted hover:text-foreground ${isAr ? 'left-2.5' : 'right-2.5'}`}
                  title={isAr ? 'مسح البحث' : 'Clear search'}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Branch Filter + Sort Dropdown */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <BuildingStorefrontIcon className="w-4 h-4 text-[#A37854]" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-[#FAF5EE] dark:bg-[#281e19] text-xs font-semibold py-2 px-3 rounded-xl border border-[#A37854]/20 text-foreground focus:outline-none focus:border-[#A37854] cursor-pointer"
                >
                  <option value="all">{isAr ? 'جميع الفروع' : 'All Branches'}</option>
                  {availableBranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-[#A37854]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF5EE] dark:bg-[#281e19] text-xs font-semibold py-2 px-3 rounded-xl border border-[#A37854]/20 text-foreground focus:outline-none focus:border-[#A37854] cursor-pointer"
                >
                  <option value="recommended">{isAr ? 'الترتيب: المميز' : 'Sort: Recommended'}</option>
                  <option value="price-asc">{isAr ? 'السعر: الأقل أولاً' : 'Price: Low to High'}</option>
                  <option value="price-desc">{isAr ? 'السعر: الأعلى أولاً' : 'Price: High to Low'}</option>
                  <option value="duration">{isAr ? 'المدة: الأقصر أولاً' : 'Duration: Shortest'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', labelEn: 'All Services', labelAr: 'جميع الخدمات' },
              { id: 'package', labelEn: 'Royal Packages', labelAr: 'الباقات الملكية' },
              { id: 'moroccan', labelEn: 'Moroccan Baths', labelAr: 'الحمام المغربي' },
              { id: 'massage', labelEn: 'Massages & Therapy', labelAr: 'المساج والعلاج' },
              { id: 'skincare', labelEn: 'Facials & Skincare', labelAr: 'العناية بالبشرة' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#543C30] text-white shadow-md ring-2 ring-[#C5A059]'
                    : 'bg-[#8C6D58] hover:bg-[#543C30] text-white shadow-xs'
                }`}
              >
                <span className="text-white">{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-spa-muted">
          <span>
            {isAr
              ? `عرض ${filteredServices.length} من إجمالي ${services.length} خدمة متوفرة`
              : `Showing ${filteredServices.length} of ${services.length} available services`}
          </span>

          {(searchQuery || selectedBranch !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBranch('all');
                setSelectedCategory('all');
                setSortBy('recommended');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#543C30] hover:bg-[#684b3d] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span className="text-white">{isAr ? 'إعادة ضبط التصفية' : 'Reset filters'}</span>
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1f1713] rounded-2xl border border-[#A37854]/15 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-56 bg-neutral-200 dark:bg-neutral-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-full" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-2/3" />
                  <div className="pt-4 flex justify-between items-center">
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-md w-24" />
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
            <p className="text-red-700 dark:text-red-400 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchServices}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#543C30] text-white text-xs font-semibold hover:bg-[#63483b] transition"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#1f1713] rounded-3xl border border-[#A37854]/20 p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF5EE] dark:bg-[#281e19] grid place-items-center text-[#A37854]">
              <MagnifyingGlassIcon className="w-8 h-8" />
            </div>
            <h3 className="font-lustria text-xl font-bold mb-2">
              {isAr ? 'لم نتمكن من العثور على خدمات مطابقة' : 'No matching services found'}
            </h3>
            <p className="text-sm text-spa-muted mb-6">
              {isAr
                ? 'يرجى تجربة كلمات بحث أخرى أو تغيير معايير التصفية المختارة.'
                : 'Try adjusting your search terms or clearing the selected filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBranch('all');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#543C30] text-white text-xs font-semibold hover:bg-[#63483b] transition"
            >
              {isAr ? 'عرض كافة الخدمات' : 'View All Services'}
            </button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => {
              const title = getServiceTitle(service);
              const imgUrl = getServiceImage(service);
              const priceNum = parseFloat(service.base_price || service.current_price || '0');
              const formattedPrice = priceNum.toFixed(3);

              return (
                <div
                  key={service.id}
                  className="group bg-white dark:bg-[#1e1612] rounded-2xl border border-[#A37854]/20 shadow-sm hover:shadow-xl hover:border-[#A37854]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Image with Badges */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-neutral-100 cursor-pointer"
                    onClick={() => setSelectedService(service)}
                  >
                    <img
                      src={imgUrl}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      {/* Duration Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                        <ClockIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{service.duration_minutes || 60} {isAr ? 'دقيقة' : 'mins'}</span>
                      </span>

                      {/* Loyalty Badge */}
                      {service.loyalty_points ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#543C30]/90 backdrop-blur-md text-[#f5d5cf] text-[10px] font-bold border border-[#A37854]/40">
                          <SparklesIcon className="w-3 h-3 text-[#C5A059]" />
                          <span>+{service.loyalty_points} {isAr ? 'نقطة' : 'pts'}</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Bottom Gender/Suitability Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                        {service.is_for_female && !service.is_for_male
                          ? (isAr ? 'خاص بالسيدات فقط' : 'Women Only')
                          : (isAr ? 'جلسة فاخرة' : 'Signature Session')}
                      </span>

                      {service.branches && service.branches.length > 0 && (
                        <span className="text-[10px] text-white/90">
                          {service.branches.length === 1
                            ? service.branches[0].name
                            : (isAr ? `${service.branches.length} فروع` : `${service.branches.length} Branches`)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Service Title */}
                      <h3
                        onClick={() => setSelectedService(service)}
                        className="font-lustria text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-[#A37854] transition-colors cursor-pointer line-clamp-1"
                        title={title}
                      >
                        {title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-spa-muted leading-relaxed line-clamp-2 mb-4">
                        {service.description ||
                          (isAr
                            ? 'جلسة استرخاء وعناية متكاملة مصممة بأعلى معايير الرفاهية والهدوء.'
                            : 'A luxurious wellness treatment crafted to provide deep relaxation and tranquility.')}
                      </p>

                      {/* Add-ons indicator */}
                      {service.addons && service.addons.length > 0 && (
                        <div className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-[#A37854] bg-[#FAF5EE] dark:bg-[#281e19] px-2.5 py-1 rounded-lg border border-[#A37854]/20">
                          <TagIcon className="w-3.5 h-3.5" />
                          <span>
                            {service.addons.length}{' '}
                            {isAr ? 'إضافات مخصصة متاحة' : 'Optional Add-ons Available'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-4 border-t border-border/40 mt-auto">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] text-spa-muted block uppercase tracking-wider">
                            {isAr ? 'سعر الجلسة' : 'Starting From'}
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-lustria text-xl sm:text-2xl font-bold text-[#543C30] dark:text-[#f5d5cf]">
                              {formattedPrice}
                            </span>
                            <span className="text-xs font-semibold text-spa-muted">
                              {service.currency || 'KWD'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedService(service)}
                          className="px-3.5 py-2 rounded-xl bg-[#8C6D58] hover:bg-[#543C30] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                          <span className="text-white">{isAr ? 'التفاصيل' : 'Details'}</span>
                        </button>
                      </div>

                      {/* Quick Action Button */}
                      <div>
                        <Link
                          href={`/gift-voucher?service_id=${service.id}`}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs font-bold shadow-xs transition text-center"
                        >
                          <GiftIcon className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="text-white">{isAr ? 'إهداء قسيمة' : 'Gift as Voucher'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner: Gift Vouchers */}
        <div className="mt-16 bg-gradient-to-r from-[#543C30] via-[#63483b] to-[#543C30] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl text-center md:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#C5A059] font-bold mb-3 border border-white/15">
              <GiftIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'هدية راقية لا تُنسى' : 'The Perfect Gift'}</span>
            </div>
            <h3 className="font-lustria text-2xl sm:text-3xl font-bold mb-2">
              {isAr ? 'أهدي من تحبين قسيمة سبا فاخرة' : 'Gift a Luxury Spa Voucher to Someone Special'}
            </h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'اختاري أي خدمة من خدماتنا الراقية وقدميها كقسيمة إهداء فورية مع بطاقة تهنئة إلكترونية مخصصة عبر الواتساب.'
                : 'Select any of our signature spa services and share an instant branded gift card with a personalized message.'}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              href="/gift-voucher"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C5A059] hover:bg-[#b08d47] text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>{isAr ? 'إنشاء قسيمة إهداء الآن' : 'Create Gift Voucher'}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Global Footer & Scroll to Top */}
      <Footer />
      <ScrollToTop />

      {/* ── SERVICE DETAIL POPUP MODAL ── */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedService(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#1a1310] border border-[#A37854]/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden shrink-0 bg-neutral-900">
              <img
                src={getServiceImage(selectedService)}
                alt={getServiceTitle(selectedService)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Title & Badges Overlay */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#543C30]/90 border border-[#A37854]/40 text-[#f5d5cf] text-xs font-bold">
                    <ClockIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{selectedService.duration_minutes || 60} {isAr ? 'دقيقة' : 'mins'}</span>
                  </span>

                  {selectedService.loyalty_points && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C5A059]/90 text-white text-xs font-bold">
                      <SparklesIcon className="w-3.5 h-3.5" />
                      <span>+{selectedService.loyalty_points} {isAr ? 'نقطة مكافآت' : 'Loyalty Points'}</span>
                    </span>
                  )}
                </div>

                <h2 className="font-lustria text-2xl sm:text-3xl font-bold tracking-wide">
                  {getServiceTitle(selectedService)}
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Pricing Overview */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF5EE] dark:bg-[#281e19] border border-[#A37854]/20">
                <div>
                  <span className="text-xs text-spa-muted block">
                    {isAr ? 'السعر الأساسي للجلسة' : 'Session Base Price'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-lustria text-2xl sm:text-3xl font-bold text-[#543C30] dark:text-[#f5d5cf]">
                      {parseFloat(selectedService.base_price || selectedService.current_price || '0').toFixed(3)}
                    </span>
                    <span className="text-xs font-semibold text-spa-muted">
                      {selectedService.currency || 'KWD'}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-xs text-spa-muted block">
                    {isAr ? 'الفئة المستفيدة' : 'Eligibility'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#543C30] dark:text-[#f5d5cf] mt-0.5">
                    <CheckBadgeIcon className="w-4 h-4 text-[#C5A059]" />
                    <span>
                      {selectedService.is_for_female && !selectedService.is_for_male
                        ? (isAr ? 'خاص بالسيدات فقط' : 'Women Only')
                        : (isAr ? 'متاح' : 'Available')}
                    </span>
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="font-lustria text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-[#A37854]" />
                  <span>{isAr ? 'عن هذه التجربة' : 'About This Treatment'}</span>
                </h4>
                <div className="text-xs sm:text-sm text-spa-muted leading-relaxed whitespace-pre-line bg-white dark:bg-[#201814] p-4 rounded-2xl border border-border/40">
                  {selectedService.description ||
                    (isAr
                      ? 'جلسة متكاملة توفر الاسترخاء العميق وتجديد الحيوية في أجنحة كوايت أوش الخاصة.'
                      : 'An authentic luxury spa journey designed to promote wellness, tranquility, and vital renewal in our private suites.')}
                </div>
              </div>

              {/* Available Branches */}
              {selectedService.branches && selectedService.branches.length > 0 && (
                <div>
                  <h4 className="font-lustria text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BuildingStorefrontIcon className="w-4 h-4 text-[#A37854]" />
                    <span>{isAr ? 'الفروع المتاحة' : 'Available Branches'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.branches.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#FAF5EE] dark:bg-[#281e19] border border-[#A37854]/20 flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#543C30]/10 grid place-items-center text-[#543C30] dark:text-[#f5d5cf] shrink-0">
                          <BuildingStorefrontIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{b.name}</div>
                          <div className="text-[10px] text-spa-muted truncate">{b.city || (isAr ? 'الكويت' : 'Kuwait')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons List */}
              {selectedService.addons && selectedService.addons.length > 0 && (
                <div>
                  <h4 className="font-lustria text-sm font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TagIcon className="w-4 h-4 text-[#A37854]" />
                    <span>{isAr ? 'إضافات الجلسة المتاحة' : 'Optional Treatment Add-ons'}</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedService.addons.map((addon) => (
                      <div
                        key={addon.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#201814] border border-border/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-foreground">{addon.name}</div>
                          {addon.duration_minutes > 0 && (
                            <div className="text-[10px] text-spa-muted">
                              +{addon.duration_minutes} {isAr ? 'دقيقة إضافية' : 'extra mins'}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-[#A37854] shrink-0">
                          +{parseFloat(addon.price).toFixed(3)} {addon.currency || 'KWD'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-border/40 bg-[#EAE5DF] dark:bg-[#1a1310] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2.5 rounded-xl bg-[#8C6D58] hover:bg-[#543C30] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <span className="text-white">{isAr ? 'إغلاق' : 'Close'}</span>
              </button>

              <Link
                href={`/gift-voucher?service_id=${selectedService.id}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs font-bold shadow-xs transition"
              >
                <GiftIcon className="w-4 h-4 text-white shrink-0" />
                <span className="text-white">{isAr ? 'إهداء كقسيمة' : 'Gift as Voucher'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import {
  GiftIcon,
  SparklesIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  UserIcon,
  PhoneIcon,
  EyeIcon,
  XMarkIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  PrinterIcon,
  CheckCircleIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import {
  USH_PHONE_DISPLAY,
  USH_PHONE_TEL_HREF,
  USH_WHATSAPP_HREF,
  USH_EMAIL_DISPLAY,
  USH_EMAIL_MAILTO_HREF,
} from '@/lib/contact';

// ─── Design Tokens (strictly matching ushspa mobile app) ─────────────────────
const BG_MAIN = '#EAE5DF';
const HEADER_BG = '#d6c3b5';
const CARD_BG = '#FAF5EE';
const CARD_SELECTED_BG = '#FDF8F1';
const PRIMARY_BROWN = '#543C30';
const ACCENT_BROWN = '#A37854';
const GOLD_ACCENT = '#C5A059';
const TEXT_SEC = '#8A6D5F';
const BORDER_COLOR = 'rgba(163, 120, 84, 0.22)';
const INPUT_BG = '#EAE0D6';

// ─── Supported Countries for Phone Input ─────────────────────────────────────
interface CountryEntry {
  code: string;
  dial: string;
  name_en: string;
  name_ar: string;
  flag: string;
}

// Only Kuwait is supported for now.
const COUNTRIES: CountryEntry[] = [
  { code: 'KW', dial: '+965', name_en: 'Kuwait', name_ar: 'الكويت', flag: '🇰🇼' },
];

/** Strip everything except digits; drop a pasted +965 / 00965 prefix; cap at 8 digits. */
function sanitizeKuwaitPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00965')) digits = digits.slice(5);
  else if (digits.startsWith('965') && digits.length > 8) digits = digits.slice(3);
  return digits.slice(0, 8);
}

/** Kuwait numbers: exactly 8 digits, starting with 4, 5, 6 or 9. */
function isValidKuwaitPhone(local: string): boolean {
  return /^[4569]\d{7}$/.test(local);
}

// ─── Data Types ─────────────────────────────────────────────────────────────
interface GiftCategory {
  id: string;
  code: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  short_description?: string;
  description?: string;
  price: string;
  current_price: string;
  currency: string;
  image?: string;
  sku?: string;
  category?: string;
  brand?: string;
  how_to_use?: string;
  ingredients?: string;
  benefits?: string;
}

interface Branch {
  id: string;
  branch_id?: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  address?: string;
  city?: string;
}

interface Addon {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description?: string;
  price: string;
  currency: string;
  duration_minutes?: number;
}

interface Arrangement {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  arrangement_type?: string;
  effective_price: string;
  currency: string;
  addons?: Addon[];
}

interface Service {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  duration_minutes?: number;
  currency?: string;
  base_price?: string | number;
  current_price?: string | number;
  primary_image?: string;
  extra_minutes?: number | string | null;
  price_for_extra_minutes?: string | number | null;
  is_for_female?: boolean;
  is_for_male?: boolean;
  branches?: Branch[];
  benefits?: string | Array<{ key?: string; value?: string } | string> | null;
  benefits_en?: string | Array<{ key?: string; value?: string } | string> | null;
  benefits_ar?: string | Array<{ key?: string; value?: string } | string> | null;
  customer_benefits?: string | Array<{ key?: string; value?: string } | string> | null;
  session_benefits?: string | Array<{ key?: string; value?: string } | string> | null;
  session_benefits_en?: string | Array<{ key?: string; value?: string } | string> | null;
  session_benefits_ar?: string | Array<{ key?: string; value?: string } | string> | null;
}

interface GeneratedVoucher {
  id: string;
  voucher_code: string;
  secret_code: string;
  public_token: string;
  public_url: string;
  created_at: string;
  expires_at: string;
  total_amount?: string;
  currency?: string;
  recipient_name?: string;
  recipient_phone?: string;
  sender_name?: string;
  sender_phone?: string;
}

interface MyFatoorahMethod {
  PaymentMethodId: number;
  PaymentMethodEn: string;
  PaymentMethodAr: string;
  PaymentMethodCode: string;
  ImageUrl: string;
  IsDirectPayment: boolean;
  ServiceCharge: number;
  TotalAmount: number;
  CurrencyIso: string;
}

/**
 * Filter out payment methods to only two:
 * 1. KNET
 * 2. Apple Pay (only one if multiple are returned)
 */
function filterAllowedPaymentMethods(methods: MyFatoorahMethod[]): MyFatoorahMethod[] {
  if (!Array.isArray(methods)) return [];

  // 1. KNET
  const knet = methods.find((m) => {
    const code = (m.PaymentMethodCode || '').toLowerCase().trim();
    const en = (m.PaymentMethodEn || '').toLowerCase().trim();
    const ar = (m.PaymentMethodAr || '').toLowerCase().trim();
    return (
      code === 'kn' ||
      code === 'knet' ||
      en.includes('knet') ||
      ar.includes('كي نت') ||
      ar.includes('كينت') ||
      m.PaymentMethodId === 1
    );
  });

  // 2. Apple Pay (pick only one)
  const applePayCandidates = methods.filter((m) => {
    const code = (m.PaymentMethodCode || '').toLowerCase().trim();
    const en = (m.PaymentMethodEn || '').toLowerCase().trim();
    const ar = (m.PaymentMethodAr || '').toLowerCase().trim();
    return (
      code === 'ap' ||
      code === 'applepay' ||
      en.includes('apple pay') ||
      en.includes('applepay') ||
      ar.includes('أبل') ||
      ar.includes('ابل')
    );
  });

  const applePay =
    applePayCandidates.find((m) => (m.PaymentMethodEn || '').toLowerCase().trim() === 'apple pay') ||
    applePayCandidates.find((m) => (m.PaymentMethodCode || '').toLowerCase().trim() === 'ap') ||
    applePayCandidates[0];

  const result: MyFatoorahMethod[] = [];
  if (knet) {
    result.push({
      ...knet,
      PaymentMethodEn: 'KNET',
      PaymentMethodAr: knet.PaymentMethodAr || 'كي نت',
    });
  }
  if (applePay) {
    result.push({
      ...applePay,
      PaymentMethodEn: 'Apple Pay',
      PaymentMethodAr: 'أبل باي',
    });
  }

  return result;
}

// ─── Contact Support Card Component ──────────────────────────────────────────
function SupportContactCard({
  isAr,
  title,
  message,
}: {
  isAr: boolean;
  title?: string;
  message?: string;
}) {
  const defaultTitle = isAr
    ? 'البيانات غير متوفرة حالياً'
    : 'Data is currently unavailable';
  const defaultMessage = isAr
    ? 'تعذر الاتصال بالخادم أو أن البيانات المطلوبة غير متوفرة حالياً. يسعد فريق الدعم لدينا بمساعدتك مباشرة في اختيار وتأكيد طلب الإهداء.'
    : 'Unable to reach the server or data is currently unavailable. Our support team is ready to assist you directly with your gift voucher order.';

  return (
    <div
      style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
      className="rounded-2xl p-6 sm:p-8 text-center border shadow-sm max-w-xl mx-auto my-6"
    >
      <div
        style={{ backgroundColor: 'rgba(163, 120, 84, 0.12)', color: ACCENT_BROWN }}
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <PhoneIcon className="w-7 h-7" />
      </div>

      <h3 className="font-bold text-lg sm:text-xl text-[#1A1A1A] mb-2">
        {title || defaultTitle}
      </h3>

      <p style={{ color: TEXT_SEC }} className="text-sm leading-relaxed mb-6">
        {message || defaultMessage}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={USH_PHONE_TEL_HREF}
          style={{ backgroundColor: PRIMARY_BROWN }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>{isAr ? 'اتصل بنا:' : 'Call Us:'} {USH_PHONE_DISPLAY}</span>
        </a>

        <a
          href={USH_WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#25D366' }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
          <span>{isAr ? 'واتساب الدعم' : 'WhatsApp Support'}</span>
        </a>

        <a
          href={USH_EMAIL_MAILTO_HREF}
          style={{ backgroundColor: CARD_SELECTED_BG, borderColor: BORDER_COLOR, color: PRIMARY_BROWN }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-stone-100 transition-colors"
        >
          <span>{isAr ? 'البريد الإلكتروني' : 'Email Us'}</span>
        </a>
      </div>
    </div>
  );
}

function ServiceBenefitsList({
  rawBenefits,
}: {
  rawBenefits: string | Array<{ key?: string; value?: string } | string> | null | undefined;
}) {
  if (!rawBenefits) return null;

  if (Array.isArray(rawBenefits)) {
    return (
      <ul className="space-y-2">
        {rawBenefits.map((item, idx) => {
          const text =
            typeof item === 'string'
              ? item
              : `${item.key ? item.key + ': ' : ''}${item.value || ''}`;
          if (!text.trim()) return null;
          return (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A403A] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A37854] mt-2 flex-shrink-0" />
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (typeof rawBenefits === 'string') {
    const lines = rawBenefits
      .split('\n')
      .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);

    if (lines.length > 1) {
      return (
        <ul className="space-y-2">
          {lines.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A403A] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A37854] mt-2 flex-shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p className="text-xs sm:text-sm text-[#4A403A] leading-relaxed whitespace-pre-line">
        {rawBenefits}
      </p>
    );
  }

  return null;
}

export default function GiftVoucherPage() {
  const { lang, isAr, isDark } = useApp();

  // Navigation / Phase
  // phases: 'category' | 'products' | 'services' | 'details' | 'summary' | 'make_payment' | 'completed'
  const [currentPhase, setCurrentPhase] = useState<
    'category' | 'products' | 'services' | 'details' | 'summary' | 'make_payment' | 'completed'
  >('category');
  const [flowType, setFlowType] = useState<'physical' | 'digital'>('physical');

  // Categories State
  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Products State (for physical flow)
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | 'all'>('female');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(true);
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [isLoadingServiceDetail, setIsLoadingServiceDetail] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const openServiceDetail = async (svc: Service) => {
    setDetailService(svc);
    // Enrich with detailed service info (benefits, session_benefits, full description) if missing
    if (!svc.benefits && !svc.session_benefits) {
      setIsLoadingServiceDetail(true);
      try {
        const res = await fetch(`/api/gift-voucher/services/${svc.id}?lang=${lang}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDetailService((prev) => (prev && prev.id === svc.id ? { ...prev, ...json.data } : prev));
          }
        }
      } catch (err) {
        console.warn('[openServiceDetail] failed to enrich service:', err);
      } finally {
        setIsLoadingServiceDetail(false);
      }
    }
  };

  // Arrangements & Details State
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [arrangements, setArrangements] = useState<Arrangement[]>([]);
  const [selectedArrangement, setSelectedArrangement] = useState<Arrangement | null>(null);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [selectedExtraMinutes, setSelectedExtraMinutes] = useState<number>(0);
  const [isLoadingArrangements, setIsLoadingArrangements] = useState(false);

  // Recipient, Sender & Payment State
  const [giftFrom, setGiftFrom] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderCountry, setSenderCountry] = useState<CountryEntry>(COUNTRIES[0]);
  const [recipientName, setRecipientName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryEntry>(COUNTRIES[0]);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'knet' | 'card' | 'link'>('link');
  const [formError, setFormError] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [generatedVoucher, setGeneratedVoucher] = useState<GeneratedVoucher | null>(null);

  // MyFatoorah Payment state
  const [myFatoorahMethods, setMyFatoorahMethods] = useState<MyFatoorahMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<number>(1);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [directPaymentUrl, setDirectPaymentUrl] = useState('');

  // ─── Fetch Categories ───────────────────────────────────────────────────────
  const loadCategories = async (currentLang: string = lang) => {
    setIsLoadingCategories(true);
    try {
      const res = await fetch(`/api/gift-voucher/categories?lang=${currentLang}`);
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setCategories(list);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories(lang);
  }, [lang]);

  // ─── Fetch Products (when entering physical flow) ──────────────────────────
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/gift-voucher/products');
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setProducts(list);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // ─── Fetch Services ────────────────────────────────────────────────────────
  const loadServices = async (gender: 'female' | 'male' | 'all' = selectedGender, currentLang: string = lang) => {
    setIsLoadingServices(true);
    try {
      const res = await fetch(`/api/gift-voucher/services?gender=${gender}&lang=${currentLang}`);
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : [];
      setServices(list);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Keep services refreshed whenever language or gender changes
  useEffect(() => {
    loadServices(selectedGender, lang);
  }, [lang, selectedGender]);

  // Synchronize selectedService and detailService whenever services list changes or isAr toggles
  useEffect(() => {
    if (selectedService) {
      const match = services.find((s) => s.id === selectedService.id);
      if (match) {
        setSelectedService((prev) => (prev ? { ...prev, ...match } : match));
      }
    }
    if (detailService) {
      const match = services.find((s) => s.id === detailService.id);
      if (match) {
        setDetailService((prev) => (prev ? { ...prev, ...match } : match));
      }
    }
  }, [services, isAr]);

  // Auto-enrich selectedService with benefits and full descriptions if missing
  useEffect(() => {
    if (currentPhase === 'details' && selectedService && !selectedService.benefits && !selectedService.session_benefits) {
      let isCancelled = false;
      fetch(`/api/gift-voucher/services/${selectedService.id}?lang=${lang}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (!isCancelled && json?.success && json?.data) {
            setSelectedService((prev) => (prev && prev.id === selectedService.id ? { ...prev, ...json.data } : prev));
          }
        })
        .catch((err) => console.warn('[enrich selectedService] error:', err));
      return () => {
        isCancelled = true;
      };
    }
  }, [currentPhase, selectedService?.id, lang]);

  // ─── Fetch Arrangements for Selected Service & Branch ──────────────────────
  const loadArrangements = async (serviceId: string, branchId: string) => {
    setIsLoadingArrangements(true);
    try {
      const res = await fetch(
        `/api/gift-voucher/availability?service_id=${encodeURIComponent(
          serviceId
        )}&branch_id=${encodeURIComponent(branchId)}`
      );
      const json = await res.json();
      const arrs: Arrangement[] = Array.isArray(json?.service_arrangements)
        ? json.service_arrangements
        : [];
      setArrangements(arrs);

      if (arrs.length > 0) {
        setSelectedArrangement(arrs[0]);
        // Extract addons from first arrangement
        const firstAddons = arrs[0].addons || [];
        setAvailableAddons(firstAddons);
      } else {
        setSelectedArrangement(null);
        setAvailableAddons([]);
      }
    } catch (err) {
      console.error('Error loading arrangements:', err);
    } finally {
      setIsLoadingArrangements(false);
    }
  };

  // ─── Step Calculations ─────────────────────────────────────────────────────
  const productPrice = useMemo(() => {
    if (flowType === 'physical' && selectedProduct) {
      return parseFloat(selectedProduct.current_price || selectedProduct.price || '0') || 0;
    }
    return 0;
  }, [flowType, selectedProduct]);

  const serviceBasePrice = useMemo(() => {
    if (selectedArrangement) {
      return parseFloat(selectedArrangement.effective_price || '0') || 0;
    }
    if (selectedService) {
      return parseFloat(String(selectedService.current_price || selectedService.base_price || '0')) || 0;
    }
    return 0;
  }, [selectedArrangement, selectedService]);

  const addonsPrice = useMemo(() => {
    return selectedAddonIds.reduce((sum, id) => {
      const item = availableAddons.find((a) => a.id === id);
      return sum + (item ? parseFloat(item.price || '0') || 0 : 0);
    }, 0);
  }, [selectedAddonIds, availableAddons]);

  const extraMinutesRate = useMemo(() => {
    if (selectedService?.price_for_extra_minutes) {
      return parseFloat(String(selectedService.price_for_extra_minutes)) || 15.0;
    }
    return 15.0;
  }, [selectedService]);

  // Extra time is offered only when the service defines both values (> 0)
  const hasExtraTime =
    (Number(selectedService?.extra_minutes) || 0) > 0 &&
    (Number(selectedService?.price_for_extra_minutes) || 0) > 0;

  useEffect(() => {
    if (!hasExtraTime && selectedExtraMinutes !== 0) setSelectedExtraMinutes(0);
  }, [hasExtraTime, selectedExtraMinutes]);

  const extraTimePrice = useMemo(() => {
    if (selectedExtraMinutes <= 0) return 0;
    const blocks = selectedExtraMinutes / 30;
    return blocks * extraMinutesRate;
  }, [selectedExtraMinutes, extraMinutesRate]);

  const grandTotal = useMemo(() => {
    return productPrice + serviceBasePrice + addonsPrice + extraTimePrice;
  }, [productPrice, serviceBasePrice, addonsPrice, extraTimePrice]);

  const currency = selectedService?.currency || selectedProduct?.currency || 'KWD';
  const decimals = currency === 'KWD' ? 3 : 2;

  // ─── Step Indicator Steps ──────────────────────────────────────────────────
  const stepItems = useMemo(() => {
    if (flowType === 'physical') {
      return [
        { id: 'products', stepNum: 1, labelEn: 'Products', labelAr: 'المنتجات' },
        { id: 'services', stepNum: 2, labelEn: 'Service', labelAr: 'الخدمة' },
        { id: 'details', stepNum: 3, labelEn: 'Details', labelAr: 'التفاصيل' },
        { id: 'summary', stepNum: 4, labelEn: 'Summary', labelAr: 'الملخص' },
        { id: 'payment', stepNum: 5, labelEn: 'Payment', labelAr: 'الدفع' },
      ];
    }
    return [
      { id: 'services', stepNum: 1, labelEn: 'Service', labelAr: 'الخدمة' },
      { id: 'details', stepNum: 2, labelEn: 'Details', labelAr: 'التفاصيل' },
      { id: 'summary', stepNum: 3, labelEn: 'Summary', labelAr: 'الملخص' },
      { id: 'payment', stepNum: 4, labelEn: 'Payment', labelAr: 'الدفع' },
    ];
  }, [flowType]);

  const getCurrentStepNumber = () => {
    if (currentPhase === 'category') return 0;
    if (flowType === 'physical') {
      if (currentPhase === 'products') return 1;
      if (currentPhase === 'services') return 2;
      if (currentPhase === 'details') return 3;
      if (currentPhase === 'summary') return 4;
      if (currentPhase === 'make_payment' || currentPhase === 'completed') return 5;
    } else {
      if (currentPhase === 'services') return 1;
      if (currentPhase === 'details') return 2;
      if (currentPhase === 'summary') return 3;
      if (currentPhase === 'make_payment' || currentPhase === 'completed') return 4;
    }
    return 1;
  };

  const currentStepNum = getCurrentStepNumber();

  // ─── Actions ───────────────────────────────────────────────────────────────
  const handleSelectCategory = (cat: GiftCategory) => {
    setSelectedCategory(cat);
    const code = (cat.code || '').toUpperCase();
    const titleEn = cat.title || '';
    const isDig =
      code === 'DIGITAL' ||
      titleEn.toLowerCase().includes('digital') ||
      (cat.title_ar || '').includes('رقمي');

    if (isDig) {
      setFlowType('digital');
      setSelectedProduct(null);
      loadServices(selectedGender);
      setCurrentPhase('services');
    } else {
      setFlowType('physical');
      loadProducts();
      setCurrentPhase('products');
    }
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    loadServices(selectedGender);
    setCurrentPhase('services');
  };

  const handleSelectService = (svc: Service) => {
    setSelectedService(svc);
    // Determine branches
    const bList = Array.isArray(svc.branches) && svc.branches.length > 0
      ? svc.branches
      : [
          {
            id: '8d93e387-e927-460d-91ab-4df9072f1977',
            branch_id: '8d93e387-e927-460d-91ab-4df9072f1977',
            name: 'Sharq Branch',
            name_en: 'Sharq Branch',
            name_ar: 'فرع شرق',
            address: 'Al-Shuhada Street, Block 04, Building 32',
            city: 'Kuwait City',
          },
        ];
    setBranches(bList);
    const defBranch = bList[0];
    setSelectedBranch(defBranch);
    loadArrangements(String(svc.id), defBranch.branch_id || defBranch.id);
    setCurrentPhase('details');
  };

  const handleArrangementChange = (arr: Arrangement) => {
    setSelectedArrangement(arr);
    if (arr.addons) {
      setAvailableAddons(arr.addons);
      // Keep only valid selected addons
      setSelectedAddonIds((prev) => prev.filter((id) => arr.addons?.some((a) => a.id === id)));
    }
  };

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBackNavigation = () => {
    if (currentPhase === 'completed') {
      setCurrentPhase('make_payment');
    } else if (currentPhase === 'make_payment') {
      setCurrentPhase('summary');
    } else if (currentPhase === 'summary') {
      setCurrentPhase('details');
    } else if (currentPhase === 'details') {
      setCurrentPhase('services');
    } else if (currentPhase === 'services') {
      if (flowType === 'physical') {
        setCurrentPhase('products');
      } else {
        setCurrentPhase('category');
      }
    } else if (currentPhase === 'products') {
      setCurrentPhase('category');
    } else if (currentPhase === 'category') {
      window.location.href = '/';
    }
  };

  const handleDirectStepPress = (stepNum: number) => {
    if (stepNum >= currentStepNum) return;
    if (flowType === 'physical') {
      if (stepNum === 1) setCurrentPhase('products');
      if (stepNum === 2) setCurrentPhase('services');
      if (stepNum === 3) setCurrentPhase('details');
      if (stepNum === 4) setCurrentPhase('summary');
    } else {
      if (stepNum === 1) setCurrentPhase('services');
      if (stepNum === 2) setCurrentPhase('details');
      if (stepNum === 3) setCurrentPhase('summary');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!giftFrom.trim()) {
      setFormError(isAr ? 'يرجى إدخال اسمك (المُهدِي)' : 'Please enter your name (Gift From)');
      return;
    }
    if (!isValidKuwaitPhone(senderPhone)) {
      setFormError(isAr ? 'رقم هاتفك غير صالح. يجب أن يتكون من 8 أرقام ويبدأ بـ 4 أو 5 أو 6 أو 9' : 'Your phone number is invalid. It must be 8 digits starting with 4, 5, 6 or 9');
      return;
    }
    if (!recipientName.trim()) {
      setFormError(isAr ? 'يرجى إدخال اسم المستلم' : 'Please enter the recipient full name');
      return;
    }
    if (!isValidKuwaitPhone(recipientPhone)) {
      setFormError(isAr ? 'رقم هاتف المستلم غير صالح. يجب أن يتكون من 8 أرقام ويبدأ بـ 4 أو 5 أو 6 أو 9' : "Recipient's phone number is invalid. It must be 8 digits starting with 4, 5, 6 or 9");
      return;
    }

    setIsSubmittingOrder(true);
    const fullRecipientPhone = `${selectedCountry.dial}${recipientPhone.replace(/^0+/, '').trim()}`;
    const fullSenderPhone = senderPhone.trim()
      ? `${senderCountry.dial}${senderPhone.replace(/^0+/, '').trim()}`
      : '';

    const chosenAddons = availableAddons.filter((a) => selectedAddonIds.includes(a.id));

    const payload = {
      gift_category: flowType,
      status: 'payment_pending',
      delivery_status: 'ordered',
      total_amount: grandTotal.toFixed(decimals),
      currency,
      payment_through: 'ushweb',
      payment_provider: 'MyFatoorah',
      service_id: selectedService?.id || null,
      service_data: selectedService
        ? {
            id: selectedService.id,
            name: selectedService.name_en || selectedService.name,
            name_ar: selectedService.name_ar || selectedService.name,
            duration: selectedService.duration_minutes || 60,
            price: serviceBasePrice.toFixed(decimals),
            currency,
            image1: selectedService.primary_image,
          }
        : {},
      ordered_items:
        flowType === 'physical' && selectedProduct
          ? [
              {
                item_type: 'product',
                product_id: selectedProduct.id,
                name: selectedProduct.name_en || selectedProduct.name,
                name_ar: selectedProduct.name_ar || selectedProduct.name,
                price: parseFloat(selectedProduct.current_price || selectedProduct.price).toFixed(decimals),
                currency,
                image: selectedProduct.image,
                sku: selectedProduct.sku,
                quantity: 1,
              },
            ]
          : null,
      branch_id: selectedBranch?.branch_id || selectedBranch?.id || null,
      branch_data: selectedBranch
        ? {
            id: selectedBranch.branch_id || selectedBranch.id,
            name: selectedBranch.name_en || selectedBranch.name,
            name_ar: selectedBranch.name_ar || selectedBranch.name,
            address: selectedBranch.address || '',
            city: selectedBranch.city || '',
          }
        : {},
      service_arrangement_id: selectedArrangement?.id || null,
      service_arrangement_data: selectedArrangement
        ? {
            id: selectedArrangement.id,
            name: selectedArrangement.name_en || selectedArrangement.name,
            name_ar: selectedArrangement.name_ar || selectedArrangement.name,
            effective_price: serviceBasePrice.toFixed(decimals),
          }
        : {},
      addons: chosenAddons.map((a) => ({
        addon_id: a.id,
        name: a.name_en || a.name,
        name_ar: a.name_ar || a.name,
        price: parseFloat(a.price).toFixed(decimals),
        duration: a.duration_minutes || 0,
      })),
      extra_time: selectedExtraMinutes,
      total_duration:
        (selectedService?.duration_minutes || 0) +
        chosenAddons.reduce((s, a) => s + (a.duration_minutes || 0), 0) +
        selectedExtraMinutes,
      price_for_extra_time: extraTimePrice.toFixed(decimals),
      gift_from: giftFrom.trim(),
      sender_data: {
        name: giftFrom.trim(),
        phone_number: fullSenderPhone,
        language_preference: isAr ? 'ar' : 'en',
      },
      recipient_phone: fullRecipientPhone,
      recipient_name: recipientName.trim(),
      recipient_data: {
        name: recipientName.trim(),
        phone_number: fullRecipientPhone,
      },
      gift_message: giftMessage.trim() || null,
    };

    try {
      const res = await fetch('/api/gift-voucher/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const vData = json?.data;
      if (vData) {
        const formDataToStore = {
          gift_from: giftFrom.trim(),
          recipient_name: recipientName.trim(),
          recipient_phone: fullRecipientPhone,
          sender_phone: fullSenderPhone,
          secret_code: vData.secret_code || '',
          voucher_code: vData.voucher_code || '',
          public_token: vData.public_token || '',
          public_url: vData.public_url || '',
        };
        try {
          sessionStorage.setItem('ush_gift_form_data', JSON.stringify(formDataToStore));
          localStorage.setItem('ush_gift_form_data', JSON.stringify(formDataToStore));
          if (vData.id) {
            sessionStorage.setItem(`ush_gift_form_${vData.id}`, JSON.stringify(formDataToStore));
            localStorage.setItem(`ush_gift_form_${vData.id}`, JSON.stringify(formDataToStore));
          }
        } catch {
          // ignore storage error
        }

        setGeneratedVoucher({
          id: vData.id || vData.voucher_id || 'USH-VOUCHER',
          voucher_code: vData.voucher_code || `USH-${Math.floor(100000 + Math.random() * 900000)}`,
          secret_code: vData.secret_code || `${Math.floor(1000 + Math.random() * 9000)}`,
          public_token: vData.public_token || vData.id,
          public_url: vData.public_url || `/gift/${vData.public_token || vData.id}`,
          total_amount: vData.total_amount || grandTotal.toFixed(decimals),
          currency: vData.currency || currency,
          recipient_name: recipientName.trim(),
          recipient_phone: fullRecipientPhone,
          sender_name: giftFrom.trim(),
          sender_phone: fullSenderPhone,
          created_at: vData.created_at || new Date().toISOString(),
          expires_at: vData.expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
        setPaymentError('');
        setDirectPaymentUrl('');
        setCurrentPhase('make_payment');
      } else {
        const errorDetail = json?.error?.message || json?.message;
        setFormError(
          errorDetail ||
            (isAr ? 'فشل إنشاء القسيمة، يرجى المحاولة ثانية' : 'Failed to generate voucher. Please try again.')
        );
      }
    } catch (err) {
      console.error('Order error:', err);
      setFormError(isAr ? 'حدث خطأ في الاتصال، يرجى المحاولة مجدداً' : 'Network error. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // ─── Fetch MyFatoorah Payment Methods on Make Payment Phase ───────────────
  useEffect(() => {
    if (currentPhase === 'make_payment' && generatedVoucher) {
      async function loadMyFatoorahMethods() {
        setIsLoadingMethods(true);
        setPaymentError('');
        try {
          const res = await fetch(
            `/api/gift-voucher/myfatoorah?amount=${grandTotal.toFixed(decimals)}&currency=${currency}`
          );
          const json = await res.json();
          if (json?.success && Array.isArray(json?.data?.payment_methods) && json.data.payment_methods.length > 0) {
            const filtered = filterAllowedPaymentMethods(json.data.payment_methods);
            if (filtered.length > 0) {
              setMyFatoorahMethods(filtered);
              const knet = filtered.find(
                (m: MyFatoorahMethod) =>
                  m.PaymentMethodId === 1 ||
                  m.PaymentMethodCode?.toLowerCase() === 'kn' ||
                  m.PaymentMethodEn.toLowerCase().includes('knet')
              );
              if (knet) {
                setSelectedMethodId(knet.PaymentMethodId);
              } else {
                setSelectedMethodId(filtered[0].PaymentMethodId);
              }
            } else {
              setMyFatoorahMethods([]);
              setPaymentError(
                json?.error?.message ||
                  (isAr
                    ? 'وسائل الدفع غير متوفرة حالياً. يرجى التواصل مع فريق الدعم.'
                    : 'Payment methods are currently unavailable. Please contact our support team.')
              );
            }
          } else {
            setMyFatoorahMethods([]);
            setPaymentError(
              json?.error?.message ||
                (isAr
                  ? 'وسائل الدفع غير متوفرة حالياً. يرجى التواصل مع فريق الدعم.'
                  : 'Payment methods are currently unavailable. Please contact our support team.')
            );
          }
        } catch (err) {
          console.warn('Failed to load dynamic MyFatoorah methods:', err);
          setMyFatoorahMethods([]);
          setPaymentError(
            isAr
              ? 'تعذر الاتصال ببوابة الدفع. يرجى التواصل مع فريق الدعم.'
              : 'Failed to connect to payment gateway. Please contact our support team.'
          );
        } finally {
          setIsLoadingMethods(false);
        }
      }
      loadMyFatoorahMethods();
    }
  }, [currentPhase, generatedVoucher, grandTotal, decimals, currency]);

  // ─── Execute MyFatoorah Payment ───────────────────────────────────────────
  const handleExecuteMyFatoorahPayment = async () => {
    if (!generatedVoucher) return;
    setIsProcessingPayment(true);
    setPaymentError('');
    setDirectPaymentUrl('');

    const fullRecipientPhone = `${selectedCountry.dial}${recipientPhone.replace(/^0+/, '').trim()}`;
    const fullSenderPhone = senderPhone.trim()
      ? `${senderCountry.dial}${senderPhone.replace(/^0+/, '').trim()}`
      : '';

    try {
      const formDataToStore = {
        gift_from: giftFrom.trim(),
        recipient_name: recipientName.trim(),
        recipient_phone: fullRecipientPhone,
        sender_phone: fullSenderPhone,
        secret_code: generatedVoucher.secret_code || '',
        voucher_code: generatedVoucher.voucher_code || '',
        public_token: generatedVoucher.public_token || '',
        public_url: generatedVoucher.public_url || '',
      };
      sessionStorage.setItem('ush_gift_form_data', JSON.stringify(formDataToStore));
      localStorage.setItem('ush_gift_form_data', JSON.stringify(formDataToStore));
      if (generatedVoucher.id) {
        sessionStorage.setItem(`ush_gift_form_${generatedVoucher.id}`, JSON.stringify(formDataToStore));
        localStorage.setItem(`ush_gift_form_${generatedVoucher.id}`, JSON.stringify(formDataToStore));
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/gift-voucher/myfatoorah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucher_id: generatedVoucher.id,
          voucher_code: generatedVoucher.voucher_code,
          secret_code: generatedVoucher.secret_code,
          public_token: generatedVoucher.public_token,
          payment_method_id: selectedMethodId,
          amount: grandTotal.toFixed(decimals),
          currency,
          customer_name: giftFrom || recipientName || 'Valued Guest',
          customer_phone: senderPhone || recipientPhone || '90010333',
          customer_email: 'info@ushspa.co',
          language: isAr ? 'ar' : 'en',
          gift_from: giftFrom.trim(),
          recipient_name: recipientName.trim(),
          recipient_phone: fullRecipientPhone,
        }),
      });

      const json = await res.json();
      if (json?.success && json?.data?.payment_url) {
        setDirectPaymentUrl(json.data.payment_url);
        // Direct redirect to MyFatoorah payment gateway
        window.location.href = json.data.payment_url;
      } else {
        setPaymentError(
          json?.error?.message ||
            (isAr
              ? 'تعذر الاتصال ببوابة الدفع ماي فاتورة. يرجى المحاولة مرة أخرى.'
              : 'Failed to initiate MyFatoorah payment. Please try again.')
        );
      }
    } catch (err) {
      console.error('MyFatoorah payment error:', err);
      setPaymentError(
        isAr ? 'حدث خطأ في الاتصال، يرجى المحاولة مجدداً' : 'Network error. Please try again.'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: isDark ? '#17110e' : BG_MAIN,
        minHeight: '100vh',
        color: isDark ? '#f7eee9' : '#1A1A1A',
      }}
      className="flex flex-col font-sans pt-[64px] sm:pt-[68px] transition-colors duration-300"
    >
      {/* ─── SITE MAIN HEADER MENU ─────────────────────────────────────── */}
      <Header />

      {/* ─── GIFT VOUCHER FLOW SUB-HEADER ───────────────────────────────── */}
      <div
        style={{
          backgroundColor: isDark ? '#261b16' : HEADER_BG,
          borderBottom: isDark ? '1px solid rgba(239, 166, 151, 0.15)' : '1px solid rgba(138, 109, 95, 0.2)',
        }}
        className="sticky top-[64px] sm:top-[68px] z-40 shadow-xs transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Back Button + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBackNavigation}
              aria-label="Back"
              style={{
                backgroundColor: isDark ? 'rgba(239, 166, 151, 0.15)' : 'rgba(138, 109, 95, 0.15)',
                color: isDark ? '#f7eee9' : '#3A2A22',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors flex-shrink-0"
            >
              {isAr ? (
                <ChevronRightIcon className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
            <div className="min-w-0">
              <h1
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif", color: isDark ? '#f7eee9' : '#1A1A1A' }}
                className="text-lg sm:text-xl font-bold truncate leading-tight"
              >
                {currentPhase === 'category' && (isAr ? 'قسيمة الهدايا' : 'Gift Voucher')}
                {currentPhase === 'products' && (isAr ? 'اختر المنتج للإهداء' : 'Select Gift Packaging')}
                {currentPhase === 'services' && (isAr ? 'اختر خدمة السبا' : 'Choose Spa Service')}
                {currentPhase === 'details' && (isAr ? 'تفاصيل باقة السبا' : 'Gift a Spa Service Details')}
                {currentPhase === 'summary' && (isAr ? 'ملخص الهدية' : 'Gift Summary')}
                {currentPhase === 'make_payment' && (isAr ? 'إتمام الدفع' : 'Make Payment')}
                {currentPhase === 'completed' && (isAr ? 'تم إنشاء القسيمة بنجاح' : 'Voucher Generated')}
              </h1>
              <p style={{ color: isDark ? '#b5a49c' : TEXT_SEC }} className="text-xs truncate">
                {currentPhase === 'category' && (isAr ? 'اختر الفئة المثالية لهديتك' : 'Select the perfect gift category')}
                {currentPhase === 'products' && (isAr ? 'انقر على المنتج لاختياره' : 'Tap a presentation box or hamper')}
                {currentPhase === 'services' && (isAr ? 'تجارب استرخاء ملكية لا تُنسى' : 'Select luxury treatments and packages')}
                {currentPhase === 'details' && (isAr ? 'اختر الغرفة والإضافات والوقت الإضافي' : 'Select suite, add-ons and duration')}
                {currentPhase === 'summary' && (isAr ? 'أدخل تفاصيل المستلم ورسالة الإهداء' : 'Recipient details, wishes & checkout')}
                {currentPhase === 'make_payment' && (isAr ? 'الدفع الآمن عبر ماي فاتورة لسداد القسيمة' : 'Secure payment via MyFatoorah to finalize your gift voucher')}
                {currentPhase === 'completed' && (isAr ? 'قسيمة الإهداء جاهزة للمشاركة' : 'Your gift voucher is ready to share')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MULTI-STEP BAR (Matching GiftStepBar in ushspa) ─────────────── */}
      {currentPhase !== 'category' && currentPhase !== 'completed' && (
        <div className="max-w-3xl mx-auto w-full px-4 pt-3 pb-1">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(72, 51, 41, 0.12)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            className="rounded-full px-3 py-2 border flex items-center justify-between"
          >
            {stepItems.map((item, index) => {
              const isActive = item.stepNum === currentStepNum;
              const isCompleted = item.stepNum < currentStepNum;
              const isFuture = item.stepNum > currentStepNum;

              return (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <div style={{ color: '#B8A89E' }} className="px-1 text-xs select-none">
                      {isAr ? '‹' : '›'}
                    </div>
                  )}
                  <button
                    onClick={() => handleDirectStepPress(item.stepNum)}
                    disabled={isFuture}
                    style={{
                      backgroundColor: isActive ? 'rgba(84, 60, 48, 0.08)' : 'transparent',
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-1 rounded-full transition-colors ${
                      isCompleted ? 'cursor-pointer' : isFuture ? 'cursor-not-allowed opacity-60' : ''
                    }`}
                  >
                    <span
                      style={{
                        backgroundColor: isActive || isCompleted ? PRIMARY_BROWN : 'rgba(84, 60, 48, 0.16)',
                        color: isActive || isCompleted ? '#FFFFFF' : '#8A6D5F',
                      }}
                      className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0"
                    >
                      {isCompleted ? <CheckIcon className="w-3 h-3 stroke-[3]" /> : item.stepNum}
                    </span>
                    <span
                      style={{
                        color: isActive || isCompleted ? PRIMARY_BROWN : '#8E7D73',
                        fontWeight: isActive ? 700 : 600,
                      }}
                      className="text-xs truncate hidden xs:inline sm:inline"
                    >
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT CONTAINER ─────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 sm:py-6">
        {/* ==================================================================== */}
        {/* PHASE 1: CHOOSE YOUR GIFT CATEGORY (Matching gift-categories.tsx)     */}
        {/* ==================================================================== */}
        {currentPhase === 'category' && (
          <section className="space-y-6">
            {/* Hero Banner */}
            <div className="text-center sm:text-start pt-2 pb-4">
              <div
                style={{
                  backgroundColor: PRIMARY_BROWN,
                  boxShadow: '0 4px 14px rgba(84, 60, 48, 0.35)',
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white mx-auto sm:mx-0 mb-4"
              >
                <GiftIcon className="w-7 h-7" />
              </div>
              <h2
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif", color: '#1A1A1A' }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
              >
                {isAr ? 'اختر فئة هديتك' : 'Choose Your Gift Category'}
              </h2>
              <p style={{ color: TEXT_SEC }} className="text-sm sm:text-base max-w-xl leading-relaxed">
                {isAr
                  ? 'أهدِ أحبائك لحظات من الصفاء والراحة التي لا تُنسى — اختر من مجموعتنا الفاخرة من تجارب السبا والعناية'
                  : 'Gift unforgettable moments — explore our curated collection of luxury spa & wellness experiences.'}
              </p>
              <div className="flex items-center gap-3 my-4 max-w-xl">
                <div style={{ backgroundColor: 'rgba(163, 120, 84, 0.25)', height: 1.5 }} className="flex-1" />
                <SparklesIcon style={{ color: ACCENT_BROWN }} className="w-4 h-4 flex-shrink-0" />
                <div style={{ backgroundColor: 'rgba(163, 120, 84, 0.25)', height: 1.5 }} className="flex-1" />
              </div>
            </div>

            {/* Categories List */}
            {isLoadingCategories ? (
              <div className="py-16 text-center space-y-3">
                <ArrowPathIcon
                  style={{ color: PRIMARY_BROWN }}
                  className="w-8 h-8 animate-spin mx-auto"
                />
                <p style={{ color: TEXT_SEC }} className="text-sm">
                  {isAr ? 'جاري تحميل الفئات...' : 'Loading gift categories...'}
                </p>
              </div>
            ) : categories.length === 0 ? (
              <SupportContactCard
                isAr={isAr}
                title={isAr ? 'فئات الإهداء غير متوفرة حالياً' : 'Gift categories are currently unavailable'}
                message={
                  isAr
                    ? 'تعذر تحميل فئات قسائم الهدايا أو الاتصال بالخادم. يرجى التواصل مع فريق الدعم لدينا وسنسعد بمساعدتك مباشرة في اختيار وتأكيد طلبك.'
                    : 'Unable to load gift voucher categories or connect to the server. Please contact our support team and we will be happy to assist you directly.'
                }
              />
            ) : (
              <div className="flex flex-col gap-3.5 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-6">
                {categories.map((cat) => {
                  const title = (isAr ? cat.title_ar : cat.title) || cat.title;
                  const desc = (isAr ? cat.description_ar : cat.description) || cat.description;
                  const isPhysical = cat.code === 'PHYSICAL';
                  const categoryImage = cat.image || (isPhysical
                    ? 'https://d3q16ie8zzbnic.cloudfront.net/gifts/giftcategory/1bceb079-1e61-4027-92ae-488d367a34a8/9ca1ce0bf5524c27a8641a28af4d2b76_medium.webp'
                    : 'https://d3q16ie8zzbnic.cloudfront.net/gifts/giftcategory/11ac8b5c-31e4-4c5c-92cb-de4c7f4e0b51/61bad5d33a5b43b3b0a170af400a54c2_medium.webp');

                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      style={{
                        backgroundColor: CARD_BG,
                        borderColor: BORDER_COLOR,
                      }}
                      className="group rounded-2xl sm:rounded-3xl border overflow-hidden cursor-pointer hover:shadow-xl hover:border-[#543C30] transition-all flex flex-row sm:flex-col justify-between items-center sm:items-stretch p-3 sm:p-0"
                    >
                      {/* Category Image Header / Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-full sm:h-60 rounded-xl sm:rounded-none overflow-hidden bg-stone-100 flex-shrink-0">
                        {categoryImage ? (
                          <img
                            src={categoryImage}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div
                            style={{ backgroundColor: 'rgba(163, 120, 84, 0.15)' }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            {isPhysical ? (
                              <GiftIcon style={{ color: PRIMARY_BROWN }} className="w-10 h-10 sm:w-16 sm:h-16 opacity-60" />
                            ) : (
                              <SparklesIcon style={{ color: PRIMARY_BROWN }} className="w-10 h-10 sm:w-16 sm:h-16 opacity-60" />
                            )}
                          </div>
                        )}
                        {/* Gradient overlay (desktop only) */}
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Category Type Badge (desktop only) */}
                        <div className={`hidden sm:block absolute top-4 ${isAr ? 'right-4' : 'left-4'}`}>
                          <span
                            style={{
                              backgroundColor: 'rgba(84, 60, 48, 0.88)',
                              color: '#FFFFFF',
                              borderColor: 'rgba(197, 160, 89, 0.4)',
                            }}
                            className="text-xs uppercase font-extrabold px-3 py-1 rounded-full backdrop-blur-md border shadow-sm flex items-center gap-1.5"
                          >
                            {isPhysical ? <GiftIcon className="w-3.5 h-3.5" /> : <SparklesIcon className="w-3.5 h-3.5" />}
                            {isPhysical ? (isAr ? 'هدية فيزيائية' : 'Physical Gift') : isAr ? 'هدية رقمية' : 'Digital Gift'}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-0 sm:p-6 ps-3.5 sm:ps-6 flex-1 flex flex-col justify-between self-stretch min-w-0">
                        <div>
                          {/* Mobile Category Type Badge */}
                          <div className="flex sm:hidden items-center gap-1.5 mb-1">
                            <span
                              style={{
                                backgroundColor: 'rgba(84, 60, 48, 0.1)',
                                color: PRIMARY_BROWN,
                              }}
                              className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                            >
                              {isPhysical ? <GiftIcon className="w-3 h-3" /> : <SparklesIcon className="w-3 h-3" />}
                              {isPhysical ? (isAr ? 'هدية فيزيائية' : 'Physical Gift') : isAr ? 'هدية رقمية' : 'Digital Gift'}
                            </span>
                          </div>

                          <h3
                            style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                            className="text-base sm:text-xl font-bold text-[#1A1A1A] group-hover:text-[#543C30] transition-colors mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none"
                          >
                            {title}
                          </h3>
                          <p style={{ color: TEXT_SEC }} className="text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                            {desc}
                          </p>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-2 sm:pt-2 mt-2 sm:mt-4 flex items-center justify-between border-t border-stone-200/80">
                          <span
                            style={{ color: PRIMARY_BROWN }}
                            className="text-xs sm:text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                          >
                            {isAr ? 'اختر هذه الفئة' : 'Select Category'}
                            {isAr ? (
                              <ChevronLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                            ) : (
                              <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                            )}
                          </span>
                          <div
                            style={{ backgroundColor: PRIMARY_BROWN, color: '#FFF' }}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs flex-shrink-0"
                          >
                            {isAr ? (
                              <ChevronLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                            ) : (
                              <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ==================================================================== */}
        {/* PHASE 2: PHYSICAL PRODUCTS SELECTION (gift-physical-products.tsx)     */}
        {/* ==================================================================== */}
        {currentPhase === 'products' && (
          <section className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
              <div>
                <span
                  style={{ color: ACCENT_BROWN }}
                  className="text-xs font-bold uppercase tracking-wider block"
                >
                  {isAr ? 'الخطوة الأولى' : 'Step 1: Choose Packaging'}
                </span>
                <h2
                  style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                  className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A]"
                >
                  {isAr ? 'علب وهدايا التغليف الفاخرة' : 'Signature Packaging & Hampers'}
                </h2>
              </div>
              <p style={{ color: TEXT_SEC }} className="text-xs sm:text-sm">
                {isAr
                  ? 'اختر علبة الإهداء وسنضيف الخدمة في الخطوة التالية'
                  : 'Select packaging, then pair with a spa treatment'}
              </p>
            </div>

            {isLoadingProducts ? (
              <div className="py-16 text-center space-y-3">
                <ArrowPathIcon style={{ color: PRIMARY_BROWN }} className="w-8 h-8 animate-spin mx-auto" />
                <p style={{ color: TEXT_SEC }} className="text-sm">
                  {isAr ? 'جاري تحميل المنتجات...' : 'Loading gift products...'}
                </p>
              </div>
            ) : products.length === 0 ? (
              <SupportContactCard
                isAr={isAr}
                title={isAr ? 'منتجات التغليف غير متوفرة حالياً' : 'Packaging products are currently unavailable'}
                message={
                  isAr
                    ? 'تعذر تحميل منتجات التغليف الفاخرة أو الاتصال بالخادم. يرجى التواصل مع فريق الدعم لمساعدتك في تخصيص وتأكيد طلبك.'
                    : 'Packaging products are currently unavailable. Please contact our support team to assist you with customizing your order.'
                }
              />
            ) : (
              <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
                {products.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  const name = (isAr ? prod.name_ar : prod.name_en) || prod.name;
                  const shortDesc = prod.short_description || prod.description || '';

                  return (
                    <div
                      key={prod.id}
                      style={{
                        backgroundColor: isSelected ? CARD_SELECTED_BG : CARD_BG,
                        borderColor: isSelected ? PRIMARY_BROWN : BORDER_COLOR,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      className="rounded-2xl overflow-hidden border shadow-sm flex flex-row sm:flex-col justify-between items-center sm:items-stretch transition-all hover:shadow-md p-3 sm:p-0"
                    >
                      {/* Product Image / Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-full sm:h-auto sm:aspect-video rounded-xl sm:rounded-none overflow-hidden bg-stone-200 flex-shrink-0">
                        <img
                          src={prod.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80'}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Price Badge (desktop only) */}
                        <div className="hidden sm:block absolute top-2.5 right-2.5">
                          <span
                            style={{ backgroundColor: 'rgba(84, 60, 48, 0.85)', color: '#FFF' }}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                          >
                            {prod.current_price} {prod.currency || 'KWD'}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-0 sm:p-4 ps-3 sm:ps-4 flex-1 flex flex-col justify-between self-stretch min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span style={{ color: ACCENT_BROWN }} className="text-[10px] font-bold uppercase tracking-wider truncate">
                              {prod.brand || 'USH Spa Signature'}
                            </span>
                            {/* Mobile Price Pill */}
                            <span
                              style={{ backgroundColor: 'rgba(84, 60, 48, 0.12)', color: PRIMARY_BROWN }}
                              className="sm:hidden text-[11px] font-extrabold px-2 py-0.5 rounded-md flex-shrink-0"
                            >
                              {prod.current_price} {prod.currency || 'KWD'}
                            </span>
                          </div>
                          <h3
                            style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                            className="text-sm sm:text-base font-bold text-[#2C1810] mb-1 line-clamp-1 sm:line-clamp-2"
                          >
                            {name}
                          </h3>
                          <p style={{ color: TEXT_SEC }} className="text-xs line-clamp-1 sm:line-clamp-2 leading-relaxed">
                            {shortDesc}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 sm:pt-4 mt-2 sm:mt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailProduct(prod)}
                            style={{ color: PRIMARY_BROWN }}
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold hover:underline"
                          >
                            <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {isAr ? 'عرض التفاصيل' : 'View Details'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectProduct(prod)}
                            style={{
                              backgroundColor: isSelected ? PRIMARY_BROWN : 'rgba(84, 60, 48, 0.12)',
                              color: isSelected ? '#FFFFFF' : PRIMARY_BROWN,
                            }}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-colors hover:opacity-90 flex items-center gap-1 sm:gap-1.5 flex-shrink-0"
                          >
                            {isSelected && <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />}
                            {isSelected ? (isAr ? 'مُختار ✓' : 'Selected') : isAr ? 'اختيار ومتابعة' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ==================================================================== */}
        {/* PHASE 3: SERVICES SELECTION (gift-service-selection.tsx)              */}
        {/* ==================================================================== */}
        {currentPhase === 'services' && (
          <section className="space-y-5">
            {/* Selected Product Banner (if physical flow) */}
            {flowType === 'physical' && selectedProduct && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(163, 120, 84, 0.25)',
                }}
                className="rounded-2xl p-3 sm:p-4 border flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProduct.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200'}
                    alt={selectedProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <span style={{ color: ACCENT_BROWN }} className="text-[10px] uppercase font-bold tracking-wider">
                      {isAr ? 'علبة الإهداء المختارة' : 'Selected Packaging'}
                    </span>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">
                      {(isAr ? selectedProduct.name_ar : selectedProduct.name_en) || selectedProduct.name}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: PRIMARY_BROWN }} className="font-extrabold text-sm">
                    {selectedProduct.current_price} {selectedProduct.currency || 'KWD'}
                  </span>
                  <button
                    onClick={() => setCurrentPhase('products')}
                    style={{ color: ACCENT_BROWN }}
                    className="text-xs underline hover:text-[#543C30]"
                  >
                    {isAr ? 'تغيير' : 'Change'}
                  </button>
                </div>
              </div>
            )}

            {/* Header & Gender Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
              <div>
                <h2
                  style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                  className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A]"
                >
                  {isAr ? 'اختر خدمة السبا للإهداء' : 'Select Spa Service'}
                </h2>
                <p style={{ color: TEXT_SEC }} className="text-xs sm:text-sm">
                  {isAr ? 'باقات ملكية وعلاجات تايلاندية ومغربية فاخرة' : 'Signature Thai, Moroccan, and facial rituals'}
                </p>
              </div>

              {/* Gender Filter Buttons */}
              <div
                style={{ backgroundColor: 'rgba(84, 60, 48, 0.1)' }}
                className="p-1 rounded-full flex items-center self-stretch sm:self-auto gap-1"
              >
                {(['female', 'male', 'all'] as const).map((genderOption) => {
                  const isInactive = genderOption !== 'female';
                  const isActive = selectedGender === genderOption;
                  let label = isAr ? 'للسيدات' : 'For Her';
                  if (genderOption === 'male') label = isAr ? 'للرجال' : 'For Him';
                  if (genderOption === 'all') label = isAr ? 'الكل' : 'All';

                  return (
                    <button
                      key={genderOption}
                      type="button"
                      disabled={isInactive}
                      onClick={() => {
                        if (isInactive) return;
                        setSelectedGender(genderOption);
                        loadServices(genderOption);
                      }}
                      style={{
                        backgroundColor: isActive ? PRIMARY_BROWN : 'transparent',
                        color: isActive
                          ? '#FFFFFF'
                          : isInactive
                          ? 'rgba(84, 60, 48, 0.4)'
                          : PRIMARY_BROWN,
                        cursor: isInactive ? 'not-allowed' : 'pointer',
                      }}
                      title={isInactive ? (isAr ? 'غير متاح حالياً' : 'Inactive for now') : undefined}
                      className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isInactive ? 'opacity-40 select-none' : 'hover:opacity-90'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services List */}
            {isLoadingServices ? (
              <div className="py-16 text-center space-y-3">
                <ArrowPathIcon style={{ color: PRIMARY_BROWN }} className="w-8 h-8 animate-spin mx-auto" />
                <p style={{ color: TEXT_SEC }} className="text-sm">
                  {isAr ? 'جاري تحميل الخدمات المتاحة...' : 'Loading spa treatments...'}
                </p>
              </div>
            ) : services.length === 0 ? (
              <SupportContactCard
                isAr={isAr}
                title={isAr ? 'خدمات السبا غير متوفرة حالياً' : 'Spa treatments are currently unavailable'}
                message={
                  isAr
                    ? 'تعذر تحميل قائمة الخدمات المتاحة أو الاتصال بالخادم. يرجى التواصل مع فريق الدعم لدينا لمساعدتك في حجز الخدمة المطلوبة.'
                    : 'Spa treatments are currently unavailable or the server is unreachable. Please contact our support team to assist you with booking.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc) => {
                  const name = (isAr ? svc.name_ar : svc.name_en) || svc.name;
                  const desc = (isAr ? svc.description_ar : svc.description_en) || svc.description;
                  const price = svc.current_price || svc.base_price || '0';
                  const isSelected = selectedService?.id === svc.id;

                  return (
                    <div
                      key={svc.id}
                      onClick={() => handleSelectService(svc)}
                      style={{
                        backgroundColor: isSelected ? CARD_SELECTED_BG : CARD_BG,
                        borderColor: isSelected ? PRIMARY_BROWN : BORDER_COLOR,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      className="rounded-2xl p-4 border flex items-center gap-4 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                        <img
                          src={
                            svc.primary_image ||
                            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80'
                          }
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                          className="text-sm sm:text-base font-bold text-[#1A1A1A] line-clamp-1 mb-1"
                        >
                          {name}
                        </h3>
                        <p style={{ color: TEXT_SEC }} className="text-xs line-clamp-2 leading-relaxed mb-2">
                          {desc}
                        </p>

                        {/* Badges Row */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span
                            style={{ backgroundColor: 'rgba(163, 120, 84, 0.12)', color: ACCENT_BROWN }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md"
                          >
                            <ClockIcon className="w-3.5 h-3.5" />
                            {svc.duration_minutes || 60} {isAr ? 'دقيقة' : 'mins'}
                          </span>
                          <span
                            style={{ color: PRIMARY_BROWN }}
                            className="text-xs sm:text-sm font-extrabold"
                          >
                            {price} {svc.currency || 'KWD'}
                          </span>
                        </div>

                        {/* View Details Action Link */}
                        <div className="pt-1.5 border-t border-stone-200/60">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openServiceDetail(svc);
                            }}
                            style={{ color: PRIMARY_BROWN }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold hover:underline transition-colors"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>{isAr ? 'عرض التفاصيل والمميزات' : 'View Service Details'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Select Action Icon */}
                      <div
                        style={{
                          backgroundColor: isSelected ? PRIMARY_BROWN : 'rgba(84, 60, 48, 0.1)',
                          color: isSelected ? '#FFFFFF' : PRIMARY_BROWN,
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        {isSelected ? (
                          <CheckIcon className="w-4 h-4 stroke-[3]" />
                        ) : isAr ? (
                          <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ==================================================================== */}
        {/* PHASE 4: DETAILS & ARRANGEMENT (gift-arrangement-selection.tsx)       */}
        {/* ==================================================================== */}
        {currentPhase === 'details' && selectedService && (
          <section className="space-y-6">
            {/* Service Highlight Card */}
            <div
              style={{
                backgroundColor: CARD_BG,
                borderColor: BORDER_COLOR,
              }}
              className="rounded-2xl border p-4 sm:p-5 shadow-xs relative transition-all"
            >
              {/* Top-Right Corner Action: Change Treatment */}
              <button
                type="button"
                onClick={() => setCurrentPhase('services')}
                style={{ color: ACCENT_BROWN }}
                className={`absolute top-4 sm:top-5 ${isAr ? 'left-4 sm:left-5' : 'right-4 sm:right-5'} text-xs sm:text-sm font-bold hover:underline z-10 inline-flex items-center gap-1.5 transition-colors cursor-pointer`}
              >
                <span>{isAr ? 'تغيير الخدمة' : 'Change Treatment'}</span>
                <ArrowPathIcon className="w-3.5 h-3.5 opacity-75" />
              </button>

              {/* Top Service Summary Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {selectedService.primary_image ? (
                  <img
                    src={selectedService.primary_image}
                    alt={(isAr ? selectedService.name_ar : selectedService.name_en) || selectedService.name}
                    className="w-full sm:w-28 sm:h-28 h-40 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: 'rgba(163, 120, 84, 0.12)' }}
                    className="w-full sm:w-28 sm:h-28 h-40 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <SparklesIcon style={{ color: PRIMARY_BROWN }} className="w-10 h-10 opacity-60" />
                  </div>
                )}
                <div className={`flex-1 min-w-0 ${isAr ? 'sm:pe-32' : 'sm:pe-32'}`}>
                  <span style={{ color: ACCENT_BROWN }} className="text-xs font-bold uppercase tracking-wider block">
                    {isAr ? 'الخدمة المختارة' : 'Selected Treatment'}
                  </span>
                  <h3
                    style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                    className="text-lg sm:text-xl font-bold text-[#1A1A1A] my-1"
                  >
                    {(isAr ? selectedService.name_ar : selectedService.name_en) || selectedService.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3.5 h-3.5 text-[#A37854]" />
                      {selectedService.duration_minutes || 60} {isAr ? 'دقيقة' : 'mins'}
                    </span>
                    <span>•</span>
                    <span style={{ color: PRIMARY_BROWN }} className="font-extrabold text-sm">
                      {serviceBasePrice.toFixed(decimals)} {currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accordion Details Section (kept open by default) */}
              {isServiceDetailsOpen && (
                <div className="mt-4 pt-4 border-t border-stone-200/70 space-y-4">
                  {/* Service Description */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                      {isAr ? 'وصف الخدمة' : 'Description'}
                    </span>
                    <p style={{ color: TEXT_SEC }} className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {(isAr ? selectedService.description_ar : selectedService.description_en) ||
                        selectedService.description ||
                        (isAr ? 'جلسة علاجية مميزة وفاخرة مقدمة من يو إس إتش سبا.' : 'Signature therapeutic spa treatment by USH Spa.')}
                    </p>
                  </div>

                  {/* Customer Benefits Section */}
                  {(selectedService.benefits ||
                    selectedService.customer_benefits ||
                    selectedService.benefits_ar ||
                    selectedService.benefits_en) && (
                    <div
                      style={{
                        backgroundColor: '#F5ECE3',
                        borderColor: 'rgba(163, 120, 84, 0.22)',
                      }}
                      className="rounded-2xl p-3.5 sm:p-4 border space-y-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <SparklesIcon style={{ color: ACCENT_BROWN }} className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                          {isAr ? 'فوائد ومميزات الخدمة (Customer Benefits)' : 'Customer Benefits'}
                        </span>
                      </div>
                      <ServiceBenefitsList
                        rawBenefits={
                          isAr
                            ? selectedService.benefits_ar || selectedService.benefits || selectedService.customer_benefits
                            : selectedService.benefits_en || selectedService.benefits || selectedService.customer_benefits
                        }
                      />
                    </div>
                  )}

                  {/* Session Benefits Section */}
                  {(selectedService.session_benefits ||
                    selectedService.session_benefits_ar ||
                    selectedService.session_benefits_en) && (
                    <div
                      style={{
                        backgroundColor: 'rgba(163, 120, 84, 0.08)',
                        borderColor: 'rgba(163, 120, 84, 0.22)',
                      }}
                      className="rounded-2xl p-3.5 sm:p-4 border space-y-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldCheckIcon style={{ color: ACCENT_BROWN }} className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                          {isAr ? 'نتائج وفوائد الجلسة (Session Benefits)' : 'Session Benefits'}
                        </span>
                      </div>
                      <ServiceBenefitsList
                        rawBenefits={
                          isAr
                            ? selectedService.session_benefits_ar || selectedService.session_benefits
                            : selectedService.session_benefits_en || selectedService.session_benefits
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Accordion Action with Arrow Icon at Bottom Right */}
              <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsServiceDetailsOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#543C30] hover:text-[#A37854] transition-colors cursor-pointer"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-[#A37854]" />
                  <span>
                    {isServiceDetailsOpen
                      ? (isAr ? 'إخفاء تفاصيل ومميزات الخدمة' : 'Hide Service Details')
                      : (isAr ? 'عرض تفاصيل ومميزات الخدمة' : 'Show Service Details')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsServiceDetailsOpen((prev) => !prev)}
                  aria-label={
                    isServiceDetailsOpen
                      ? (isAr ? 'إخفاء تفاصيل الخدمة' : 'Collapse Details')
                      : (isAr ? 'عرض تفاصيل الخدمة' : 'Expand Details')
                  }
                  style={{
                    backgroundColor: 'rgba(84, 60, 48, 0.08)',
                    borderColor: 'rgba(163, 120, 84, 0.25)',
                    color: PRIMARY_BROWN,
                  }}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-stone-200/80 transition-all shadow-2xs cursor-pointer flex-shrink-0"
                >
                  {isServiceDetailsOpen ? (
                    <ChevronUpIcon className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>

            {/* Branch Selection */}
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <BuildingStorefrontIcon style={{ color: PRIMARY_BROWN }} className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-bold text-base text-[#1A1A1A]">
                  {isAr ? 'فرع السبا المخصص' : 'Select Spa Branch'}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((b) => {
                  const bName = (isAr ? b.name_ar : b.name_en) || b.name;
                  const isSelected = selectedBranch?.id === b.id || selectedBranch?.branch_id === b.branch_id;

                  return (
                    <button
                      key={b.id || b.branch_id}
                      type="button"
                      onClick={() => {
                        setSelectedBranch(b);
                        loadArrangements(String(selectedService.id), b.branch_id || b.id);
                      }}
                      style={{
                        backgroundColor: isSelected ? CARD_SELECTED_BG : '#FFFFFF',
                        borderColor: isSelected ? PRIMARY_BROWN : 'rgba(163, 120, 84, 0.2)',
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      className="p-3.5 rounded-xl border text-start flex items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-sm text-[#1A1A1A]">{bName}</div>
                        <div style={{ color: TEXT_SEC }} className="text-xs mt-0.5">
                          {b.address || (isAr ? 'مدينة الكويت' : 'Kuwait City')}
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          style={{ backgroundColor: PRIMARY_BROWN, color: '#FFF' }}
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room / Arrangement Selection */}
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-[#1A1A1A]">
                  {isAr ? 'غرفة أو جناح العلاج' : 'Treatment Room / Suite'}
                </h4>
                <span style={{ color: ACCENT_BROWN }} className="text-xs font-semibold">
                  {isAr ? 'إلزامي' : 'Required'}
                </span>
              </div>

              {isLoadingArrangements ? (
                <div className="py-6 text-center text-xs" style={{ color: TEXT_SEC }}>
                  {isAr ? 'جاري تحميل الغرف...' : 'Loading arrangements...'}
                </div>
              ) : arrangements.length === 0 ? (
                <SupportContactCard
                  isAr={isAr}
                  title={isAr ? 'خيارات الغرف غير متوفرة حالياً' : 'Room arrangements are currently unavailable'}
                  message={
                    isAr
                      ? 'تعذر تحميل خيارات الغرف للفرع المحدد أو الاتصال بالخادم. يرجى التواصل مع فريق الدعم لإتمام الترتيبات.'
                      : 'Room arrangements are currently unavailable for this branch. Please contact our support team to assist you.'
                  }
                />
              ) : (
                <div className="space-y-2.5">
                  {arrangements.map((arr) => {
                    const isSelected = selectedArrangement?.id === arr.id;
                    const arrName = (isAr ? arr.name_ar : arr.name_en) || arr.name;
                    const arrDesc = (isAr ? arr.description_ar : arr.description) || arr.description;

                    return (
                      <div
                        key={arr.id}
                        onClick={() => handleArrangementChange(arr)}
                        style={{
                          backgroundColor: isSelected ? CARD_SELECTED_BG : '#FFFFFF',
                          borderColor: isSelected ? PRIMARY_BROWN : 'rgba(163, 120, 84, 0.2)',
                          borderWidth: isSelected ? 2 : 1,
                        }}
                        className="p-4 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A1A1A]">{arrName}</span>
                            <span
                              style={{ backgroundColor: 'rgba(84, 60, 48, 0.08)', color: PRIMARY_BROWN }}
                              className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                            >
                              {arr.arrangement_type || 'Suite'}
                            </span>
                          </div>
                          {arrDesc && (
                            <p style={{ color: TEXT_SEC }} className="text-xs mt-1 line-clamp-1">
                              {arrDesc}
                            </p>
                          )}
                        </div>
                        <div className="text-end flex-shrink-0">
                          <span style={{ color: PRIMARY_BROWN }} className="font-extrabold text-sm block">
                            {parseFloat(arr.effective_price || '0').toFixed(decimals)} {currency}
                          </span>
                          <span style={{ color: TEXT_SEC }} className="text-[10px]">
                            {isAr ? 'شامل الغرفة' : 'Suite rate'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Optional Luxury Add-ons */}
            {availableAddons.length > 0 && (
              <div
                style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
                className="rounded-2xl border p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-[#1A1A1A]">
                    {isAr ? 'إضافات سبا اختيارية فاخرة' : 'Optional Luxury Add-ons'}
                  </h4>
                  <span style={{ color: TEXT_SEC }} className="text-xs">
                    {isAr ? 'اختر ما يناسب هديتك' : 'Select optional extras'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableAddons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    const addName = (isAr ? addon.name_ar : addon.name_en) || addon.name;

                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        style={{
                          backgroundColor: isChecked ? CARD_SELECTED_BG : '#FFFFFF',
                          borderColor: isChecked ? PRIMARY_BROWN : 'rgba(163, 120, 84, 0.2)',
                          borderWidth: isChecked ? 2 : 1,
                        }}
                        className="p-3.5 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#543C30] focus:ring-[#543C30] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#1A1A1A] truncate">{addName}</div>
                            {addon.duration_minutes ? (
                              <div style={{ color: TEXT_SEC }} className="text-[11px]">
                                +{addon.duration_minutes} {isAr ? 'دقيقة' : 'mins'}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <span style={{ color: PRIMARY_BROWN }} className="font-bold text-xs flex-shrink-0">
                          +{parseFloat(addon.price || '0').toFixed(decimals)} {currency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extra Time Selection */}
            {hasExtraTime && (
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-[#1A1A1A]">
                  {isAr ? 'تمديد وقت الجلسة (وقت إضافي)' : 'Extra Treatment Time'}
                </h4>
                <span style={{ color: TEXT_SEC }} className="text-xs">
                  {extraMinutesRate.toFixed(decimals)} {currency} / 30 {isAr ? 'دقيقة' : 'mins'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 30, 60].map((mins) => {
                  const isSelected = selectedExtraMinutes === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSelectedExtraMinutes(mins)}
                      style={{
                        backgroundColor: isSelected ? PRIMARY_BROWN : '#FFFFFF',
                        borderColor: isSelected ? PRIMARY_BROWN : 'rgba(163, 120, 84, 0.2)',
                        color: isSelected ? '#FFFFFF' : '#1A1A1A',
                      }}
                      className="py-2.5 rounded-xl border font-bold text-xs transition-colors"
                    >
                      {mins === 0 ? (isAr ? 'بدون' : 'None') : `+${mins} ${isAr ? 'د' : 'm'}`}
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            {/* Sticky/Bottom Cost Bar */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: BORDER_COLOR,
                boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
              }}
              className="rounded-2xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <span style={{ color: TEXT_SEC }} className="text-xs block">
                  {isAr ? 'التكلفة الإجمالية حتى الآن:' : 'Current Total Investment:'}
                </span>
                <span style={{ color: PRIMARY_BROWN }} className="text-2xl font-extrabold tracking-tight">
                  {grandTotal.toFixed(decimals)} {currency}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPhase('summary')}
                style={{
                  backgroundColor: PRIMARY_BROWN,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(84, 60, 48, 0.3)',
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-95"
              >
                {isAr ? 'متابعة إلى ملخص الهدية ‹' : 'Continue to Summary ›'}
              </button>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* PHASE 5: GIFT SUMMARY & RECIPIENT DETAILS (gift-summary.tsx)          */}
        {/* ==================================================================== */}
        {currentPhase === 'summary' && (
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Order Breakdown Card */}
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-stone-200">
                <h3
                  style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                  className="font-bold text-lg text-[#1A1A1A]"
                >
                  {isAr ? 'تفاصيل باقة الإهداء' : 'Gift Package Overview'}
                </h3>
                <span
                  style={{
                    backgroundColor: 'rgba(84, 60, 48, 0.1)',
                    color: PRIMARY_BROWN,
                  }}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                >
                  {flowType === 'physical' ? (isAr ? 'هدية فيزيائية' : 'Physical Gift') : isAr ? 'هدية رقمية' : 'Digital Gift'}
                </span>
              </div>

              {/* Physical Product Row (if any) */}
              {flowType === 'physical' && selectedProduct && (
                <div className="flex items-center justify-between gap-3 text-sm py-2.5 border-b border-stone-200/60">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#A37854]/25 bg-stone-100 flex-shrink-0 shadow-xs"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: 'rgba(163, 120, 84, 0.12)' }}
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      >
                        📦
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-bold text-[#1A1A1A] block truncate text-sm">
                        {(isAr ? selectedProduct.name_ar : selectedProduct.name_en) || selectedProduct.name}
                      </span>
                      <span style={{ color: TEXT_SEC }} className="text-xs block">
                        {isAr ? 'صندوق تغليف فاخر' : 'Luxury Presentation Box'}
                        {selectedProduct.sku ? ` • SKU: ${selectedProduct.sku}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#543C30] flex-shrink-0 text-sm">
                    {productPrice.toFixed(decimals)} {currency}
                  </span>
                </div>
              )}

              {/* Service Row */}
              {selectedService && (
                <div className="flex items-center justify-between gap-3 text-sm py-2.5 border-b border-stone-200/60">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedService.primary_image ? (
                      <img
                        src={selectedService.primary_image}
                        alt={selectedService.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#A37854]/25 bg-stone-100 flex-shrink-0 shadow-xs"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: 'rgba(163, 120, 84, 0.12)' }}
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      >
                        ✨
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-bold text-[#1A1A1A] block truncate text-sm">
                        {(isAr ? selectedService.name_ar : selectedService.name_en) || selectedService.name}
                      </span>
                      <span style={{ color: TEXT_SEC }} className="text-xs block truncate">
                        {selectedBranch ? ((isAr ? selectedBranch.name_ar : selectedBranch.name_en) || selectedBranch.name) : ''}
                        {selectedArrangement ? ` • ${((isAr ? selectedArrangement.name_ar : selectedArrangement.name_en) || selectedArrangement.name)}` : ''}
                        {selectedService.duration_minutes ? ` • ${selectedService.duration_minutes} ${isAr ? 'دقيقة' : 'mins'}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#543C30] flex-shrink-0 text-sm">
                    {serviceBasePrice.toFixed(decimals)} {currency}
                  </span>
                </div>
              )}

              {/* Selected Add-ons */}
              {selectedAddonIds.length > 0 && (
                <div className="py-1 border-b border-stone-200/60 space-y-1">
                  <span style={{ color: TEXT_SEC }} className="text-xs font-bold block">
                    {isAr ? 'الإضافات المختارة:' : 'Selected Add-ons:'}
                  </span>
                  {availableAddons
                    .filter((a) => selectedAddonIds.includes(a.id))
                    .map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-stone-700">
                          + {(isAr ? a.name_ar : a.name_en) || a.name}
                        </span>
                        <span className="font-semibold text-[#543C30]">
                          +{parseFloat(a.price).toFixed(decimals)} {currency}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* Extra Minutes */}
              {selectedExtraMinutes > 0 && (
                <div className="flex items-center justify-between text-xs py-1 border-b border-stone-200/60">
                  <span className="text-stone-700">
                    {isAr ? `وقت إضافي (+${selectedExtraMinutes} دقيقة)` : `Extra Time (+${selectedExtraMinutes} mins)`}
                  </span>
                  <span className="font-semibold text-[#543C30]">
                    +{extraTimePrice.toFixed(decimals)} {currency}
                  </span>
                </div>
              )}

              {/* Total Calculation Row */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-extrabold text-base text-[#1A1A1A]">
                  {isAr ? 'المجموع الكلي للقسيمة:' : 'Total Voucher Amount:'}
                </span>
                <span style={{ color: PRIMARY_BROWN }} className="text-2xl font-black">
                  {grandTotal.toFixed(decimals)} {currency}
                </span>
              </div>
            </div>

            {/* Recipient & Sender Form */}
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 sm:p-6 space-y-5"
            >
              <h3
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                className="font-bold text-lg text-[#1A1A1A] flex items-center gap-2"
              >
                <UserIcon style={{ color: PRIMARY_BROWN }} className="w-5 h-5 flex-shrink-0" />
                {isAr ? 'بيانات المهدي والمستلم' : 'Sender & Recipient Information'}
              </h3>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Row 1: Gift From (Your Name) and Your Phone Number */}
              {/* Stacked in two rows on mobile, in one row on web & tablet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gift From */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {isAr ? 'مُهدَى من (اسمك) *' : 'Gift From (Your Name) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={giftFrom}
                    onChange={(e) => setGiftFrom(e.target.value)}
                    placeholder={isAr ? 'مثال: نورة الأحمد' : 'e.g. Sarah Al-Ahmad'}
                    style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#543C30]"
                  />
                </div>

                {/* Sender Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {isAr ? 'رقم هاتفك (المرسل) *' : 'Your Phone Number *'}
                  </label>
                  <div className="flex gap-2" dir="ltr">
                    <span
                      style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                      className="px-2.5 py-2.5 rounded-xl border text-xs font-semibold text-[#1A1A1A] flex items-center whitespace-nowrap"
                    >
                      {senderCountry.flag} {senderCountry.dial}
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={8}
                      pattern="[4569][0-9]{7}"
                      title={isAr ? '8 أرقام تبدأ بـ 4 أو 5 أو 6 أو 9' : '8 digits starting with 4, 5, 6 or 9'}
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(sanitizeKuwaitPhone(e.target.value))}
                      placeholder="5XXXXXXX"
                      style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#543C30]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Recipient Full Name and Recipient Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {isAr ? 'اسم المستلم المكرّم *' : "Recipient's Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={isAr ? 'مثال: فاطمة العلي' : 'e.g. Fatima Al-Ali'}
                    style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#543C30]"
                  />
                </div>

                {/* Recipient Phone with Country Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                    {isAr ? 'رقم هاتف المستلم (لتسليم القسيمة) *' : "Recipient's Phone Number *"}
                  </label>
                  <div className="flex gap-2" dir="ltr">
                    <span
                      style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                      className="px-2.5 py-2.5 rounded-xl border text-xs font-semibold text-[#1A1A1A] flex items-center whitespace-nowrap"
                    >
                      {selectedCountry.flag} {selectedCountry.dial}
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={8}
                      pattern="[4569][0-9]{7}"
                      title={isAr ? '8 أرقام تبدأ بـ 4 أو 5 أو 6 أو 9' : '8 digits starting with 4, 5, 6 or 9'}
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(sanitizeKuwaitPhone(e.target.value))}
                      placeholder="5XXXXXXX"
                      style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#543C30]"
                    />
                  </div>
                </div>
              </div>

              {/* Gift Message */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  {isAr ? 'رسالة الإهداء الخاصة' : 'Personal Gift Wishes / Message'}
                </label>
                <textarea
                  rows={3}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder={
                    isAr
                      ? 'اكتب رسالة من القلب ترافق قسيمتك (مثال: بمناسبة يوم ميلادكِ السعيد، نتمنى لكِ يوماً حافلاً بالاسترخاء والدلال في USH Spa)'
                      : 'Write a heartfelt message to accompany your gift voucher...'
                  }
                  style={{ backgroundColor: INPUT_BG, borderColor: BORDER_COLOR }}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#543C30] resize-none"
                />

                {/* Quick Message Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span style={{ color: TEXT_SEC }} className="text-[11px] font-semibold">
                    {isAr ? 'اقتراحات سريعة:' : 'Quick ideas:'}
                  </span>
                  {[
                    isAr ? 'عيد ميلاد سعيد وكل عام وأنتِ بخير! 🌸' : 'Happy Birthday! Enjoy pure pampering 🌸',
                    isAr ? 'شكراً لكِ على كل شيء، تستحقين كل الدلال ✨' : 'Thank you for everything! You deserve this ✨',
                    isAr ? 'ألف مبروك ومنها للأعلى دائماً 🤍' : 'Congratulations! Wishing you joy & peace 🤍',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGiftMessage(preset)}
                      style={{
                        backgroundColor: 'rgba(84, 60, 48, 0.08)',
                        color: PRIMARY_BROWN,
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full hover:bg-[#543C30] hover:text-white transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Create your Gift Voucher Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingOrder}
                style={{
                  backgroundColor: PRIMARY_BROWN,
                  color: '#FFFFFF',
                  boxShadow: '0 6px 20px rgba(84, 60, 48, 0.35)',
                }}
                className="w-full py-4 rounded-full font-bold text-base transition-opacity hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmittingOrder ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>{isAr ? 'جاري إنشاء قسيمة الإهداء...' : 'Creating your Gift Voucher...'}</span>
                  </>
                ) : (
                  <>
                    <GiftIcon className="w-5 h-5" />
                    <span>{isAr ? 'إنشاء قسيمة الإهداء الخاصة بك' : 'Create your Gift Voucher'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* PHASE: MAKE PAYMENT (MyFatoorah Payment Gateway)                     */}
        {/* ==================================================================== */}
        {currentPhase === 'make_payment' && generatedVoucher && (
          <section className="space-y-6 max-w-2xl mx-auto py-2">
            {/* Status Header */}
            <div className="text-center space-y-2">
              <div
                style={{
                  backgroundColor: 'rgba(197, 160, 89, 0.15)',
                  borderColor: 'rgba(197, 160, 89, 0.3)',
                }}
                className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto shadow-xs"
              >
                <CreditCardIcon style={{ color: PRIMARY_BROWN }} className="w-7 h-7" />
              </div>
              <h2
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif", color: PRIMARY_BROWN }}
                className="text-2xl sm:text-3xl font-extrabold"
              >
                {isAr ? 'إتمام الدفع لقسيمة الهدية' : 'Make Payment for Gift Voucher'}
              </h2>
              <p style={{ color: TEXT_SEC }} className="text-sm">
                {isAr
                  ? 'تم إنشاء القسيمة بنجاح، يُرجى اختيار وسيلة الدفع عبر بوابة ماي فاتورة الآمنة'
                  : 'Your voucher draft is created. Choose your payment method to pay securely via MyFatoorah.'}
              </p>
            </div>

            {/* Voucher Quick Summary Card */}
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 sm:p-6 space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-3 border-stone-200">
                <div>
                  <span style={{ color: TEXT_SEC }} className="text-xs uppercase font-bold tracking-wider block">
                    {isAr ? 'رقم مرجع القسيمة' : 'Voucher Reference'}
                  </span>
                  <span style={{ color: PRIMARY_BROWN }} className="font-mono font-bold text-base sm:text-lg">
                    {generatedVoucher.voucher_code}
                  </span>
                </div>
                <div className="text-end">
                  <span style={{ color: TEXT_SEC }} className="text-xs block font-bold">
                    {isAr ? 'المبلغ المستحق:' : 'Total Due:'}
                  </span>
                  <span style={{ color: PRIMARY_BROWN }} className="text-xl sm:text-2xl font-black">
                    {grandTotal.toFixed(decimals)} {currency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span style={{ color: TEXT_SEC }}>{isAr ? 'مُهدَى من: ' : 'From: '}</span>
                  <span className="font-semibold text-stone-800">{giftFrom || (isAr ? 'فاعل خير' : 'Guest')}</span>
                  {senderPhone ? <span style={{ color: TEXT_SEC }}> ({senderCountry.dial} {senderPhone})</span> : null}
                </div>
                <div>
                  <span style={{ color: TEXT_SEC }}>{isAr ? 'إلى المستلم: ' : 'To: '}</span>
                  <span className="font-semibold text-stone-800">{recipientName}</span>
                  <span style={{ color: TEXT_SEC }}> ({selectedCountry.dial} {recipientPhone})</span>
                </div>
              </div>
            </div>

            {/* MyFatoorah Payment Options Card */}
            <div
              style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
              className="rounded-2xl border p-5 sm:p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3 border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{ backgroundColor: 'rgba(84, 60, 48, 0.12)' }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <CreditCardIcon style={{ color: PRIMARY_BROWN }} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                      className="font-bold text-base text-[#1A1A1A]"
                    >
                      {isAr ? 'الدفع عبر ماي فاتورة (MyFatoorah)' : 'Pay via MyFatoorah'}
                    </h3>
                    <p style={{ color: TEXT_SEC }} className="text-xs">
                      {isAr ? 'بوابة الدفع الإلكتروني المعتمدة والمرخصة' : 'Licensed & encrypted payment gateway'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'دفع آمن ومضمون' : '100% Secure'}</span>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-700">
                  {isAr ? 'اختر وسيلة الدفع المفضلة لديك:' : 'Select your payment method:'}
                </label>

                {isLoadingMethods ? (
                  <div className="py-6 text-center space-y-2">
                    <ArrowPathIcon style={{ color: PRIMARY_BROWN }} className="w-6 h-6 animate-spin mx-auto" />
                    <p style={{ color: TEXT_SEC }} className="text-xs">
                      {isAr ? 'جاري تحميل وسائل الدفع المتاحة...' : 'Loading available payment methods...'}
                    </p>
                  </div>
                ) : myFatoorahMethods.length === 0 ? (
                  <SupportContactCard
                    isAr={isAr}
                    title={isAr ? 'وسائل الدفع غير متوفرة حالياً' : 'Payment methods are currently unavailable'}
                    message={
                      isAr
                        ? 'تعذر الاتصال ببوابة الدفع حالياً. يرجى التواصل مع فريق الدعم لمساعدتك في إتمام الدفع وتأكيد القسيمة.'
                        : 'Unable to connect to the payment gateway. Please contact our support team to help you complete the payment and confirm your voucher.'
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myFatoorahMethods.map((method) => {
                      const isSelected = selectedMethodId === method.PaymentMethodId;
                      const title = isAr ? method.PaymentMethodAr : method.PaymentMethodEn;

                      return (
                        <button
                          key={method.PaymentMethodId}
                          type="button"
                          onClick={() => setSelectedMethodId(method.PaymentMethodId)}
                          style={{
                            backgroundColor: isSelected ? CARD_SELECTED_BG : '#FFFFFF',
                            borderColor: isSelected ? PRIMARY_BROWN : 'rgba(163, 120, 84, 0.25)',
                            borderWidth: isSelected ? 2 : 1,
                          }}
                          className="flex items-center justify-between p-3.5 rounded-xl border text-start transition-all cursor-pointer hover:border-[#543C30]"
                        >
                          <div className="flex items-center gap-3">
                            {method.ImageUrl ? (
                              <img
                                src={method.ImageUrl}
                                alt={title}
                                className="w-10 h-7 object-contain rounded bg-white p-0.5 border border-stone-200"
                              />
                            ) : (
                              <CreditCardIcon className="w-8 h-8 text-stone-600" />
                            )}
                            <div>
                              <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] block">
                                {title}
                              </span>
                              <span style={{ color: TEXT_SEC }} className="text-[11px]">
                                {method.PaymentMethodCode ? method.PaymentMethodCode.toUpperCase() : 'ONLINE'}
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              backgroundColor: isSelected ? PRIMARY_BROWN : 'transparent',
                              borderColor: isSelected ? PRIMARY_BROWN : 'rgba(84, 60, 48, 0.3)',
                            }}
                            className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0"
                          >
                            {isSelected && <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Error Alert */}
              {paymentError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                  <XMarkIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Direct payment URL fallback banner */}
              {directPaymentUrl && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <p className="font-semibold">
                    {isAr
                      ? 'إذا لم يتم توجيهك تلقائياً لبوابة الدفع، اضغط الزر أدناه للمتابعة:'
                      : 'If you were not redirected automatically, click below to proceed to MyFatoorah:'}
                  </p>
                  <a
                    href={directPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: PRIMARY_BROWN, color: '#FFFFFF' }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs hover:opacity-95"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    <span>{isAr ? 'الانتقال إلى بوابة الدفع' : 'Proceed to Checkout'}</span>
                  </a>
                </div>
              )}

              {/* Pay Now Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteMyFatoorahPayment}
                  disabled={isProcessingPayment}
                  style={{
                    backgroundColor: PRIMARY_BROWN,
                    color: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(84, 60, 48, 0.3)',
                  }}
                  className="w-full py-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60"
                >
                  {isProcessingPayment ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>
                        {isAr
                          ? 'جاري التحويل إلى بوابة الدفع ماي فاتورة...'
                          : 'Redirecting to MyFatoorah secure gateway...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5" />
                      <span>
                        {isAr
                          ? `سداد الآن عبر ماي فاتورة (${grandTotal.toFixed(decimals)} ${currency})`
                          : `Pay Now via MyFatoorah (${grandTotal.toFixed(decimals)} ${currency})`}
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 mt-3">
                  <span className="flex items-center gap-1">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PCI-DSS Level 1</span>
                  </span>
                  <span>•</span>
                  <span>MyFatoorah Kuwait</span>
                  <span>•</span>
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================== */}
        {/* PHASE 6: VOUCHER SUCCESS & CERTIFICATE DISPLAY                        */}
        {/* ==================================================================== */}
        {currentPhase === 'completed' && generatedVoucher && (
          <section className="space-y-6 max-w-2xl mx-auto py-2">
            {/* Success Heading */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircleIcon className="w-10 h-10 stroke-[2.2]" />
              </div>
              <h2
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif", color: PRIMARY_BROWN }}
                className="text-2xl sm:text-3xl font-extrabold"
              >
                {isAr ? 'تم إصدار قسيمة الإهداء بنجاح!' : 'Gift Voucher Successfully Issued!'}
              </h2>
              <p style={{ color: TEXT_SEC }} className="text-sm">
                {isAr
                  ? 'تم إرسال إشعار التوصيل وسجلت القسيمة في النظام بنجاح'
                  : 'Your voucher has been registered and is ready to present or share.'}
              </p>
            </div>

            {/* Elegant Luxury Spa Voucher Certificate Card */}
            <div
              style={{
                backgroundColor: CARD_BG,
                borderColor: GOLD_ACCENT,
                borderWidth: 2,
                boxShadow: '0 10px 30px rgba(84, 60, 48, 0.15)',
              }}
              className="rounded-3xl p-6 sm:p-8 border relative overflow-hidden space-y-6"
            >
              {/* Decorative Corner Ornaments */}
              <div
                style={{ borderColor: GOLD_ACCENT }}
                className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg pointer-events-none"
              />
              <div
                style={{ borderColor: GOLD_ACCENT }}
                className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg pointer-events-none"
              />
              <div
                style={{ borderColor: GOLD_ACCENT }}
                className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg pointer-events-none"
              />
              <div
                style={{ borderColor: GOLD_ACCENT }}
                className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg pointer-events-none"
              />

              {/* Certificate Header */}
              <div className="text-center pb-4 border-b border-stone-300">
                <span
                  style={{ color: GOLD_ACCENT }}
                  className="text-xs uppercase font-extrabold tracking-widest block mb-1"
                >
                  OFFICIAL GIFT CERTIFICATE
                </span>
                <h3
                  style={{ fontFamily: "'Lustria', serif", color: PRIMARY_BROWN }}
                  className="text-2xl font-bold tracking-wider"
                >
                  QUIET USH THAI SPA
                </h3>
                <span style={{ color: TEXT_SEC }} className="text-xs block mt-0.5">
                  Health Institute for Women • Kuwait
                </span>
              </div>

              {/* Voucher Code Badge */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-100/70 p-4 rounded-2xl border border-stone-200">
                <div>
                  <span style={{ color: TEXT_SEC }} className="text-[11px] font-bold uppercase tracking-wider block">
                    {isAr ? 'رمز القسيمة المعتمد' : 'VOUCHER CODE'}
                  </span>
                  <span style={{ color: PRIMARY_BROWN }} className="text-xl font-black tracking-widest">
                    {generatedVoucher.voucher_code}
                  </span>
                </div>
                <div className="text-end">
                  <span style={{ color: TEXT_SEC }} className="text-[11px] font-bold uppercase tracking-wider block">
                    {isAr ? 'الرمز السري للاستلام' : 'SECRET CODE'}
                  </span>
                  <span className="text-lg font-mono font-bold text-stone-800">
                    {generatedVoucher.secret_code}
                  </span>
                </div>
              </div>

              {/* Service & Recipient Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                  <span style={{ color: TEXT_SEC }}>{isAr ? 'المستلم المكرّم:' : 'Presented To:'}</span>
                  <span className="font-extrabold text-stone-900 text-base">{recipientName}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                  <span style={{ color: TEXT_SEC }}>{isAr ? 'مُهدَى من:' : 'Gifted From:'}</span>
                  <span className="font-bold text-stone-800">
                    {giftFrom || (isAr ? 'مُهدَى بكل حب' : 'With Love')}
                  </span>
                </div>

                {selectedService && (
                  <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                    <span style={{ color: TEXT_SEC }}>{isAr ? 'الباقة أو الخدمة:' : 'Spa Experience:'}</span>
                    <span className="font-bold text-[#543C30]">
                      {(isAr ? selectedService.name_ar : selectedService.name_en) || selectedService.name}
                    </span>
                  </div>
                )}

                {flowType === 'physical' && selectedProduct && (
                  <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                    <span style={{ color: TEXT_SEC }}>{isAr ? 'علبة التغليف:' : 'Presentation Box:'}</span>
                    <span className="font-semibold text-stone-800">
                      {(isAr ? selectedProduct.name_ar : selectedProduct.name_en) || selectedProduct.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                  <span style={{ color: TEXT_SEC }}>{isAr ? 'القيمة الإجمالية:' : 'Total Value:'}</span>
                  <span style={{ color: PRIMARY_BROWN }} className="font-extrabold text-base">
                    {grandTotal.toFixed(decimals)} {currency}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                  <span style={{ color: TEXT_SEC }}>{isAr ? 'صلاحية القسيمة:' : 'Validity Period:'}</span>
                  <span className="font-semibold text-stone-700">
                    {isAr ? 'سارية لمدة 12 شهراً' : 'Valid for 12 months from issue'}
                  </span>
                </div>
              </div>

              {/* Personal Message Quote */}
              {giftMessage && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(163, 120, 84, 0.3)',
                  }}
                  className="p-4 rounded-2xl border text-center italic text-stone-700 text-sm shadow-xs"
                >
                  &ldquo;{giftMessage}&rdquo;
                </div>
              )}

              {/* Footer Stamp */}
              <div className="text-center pt-2">
                <span style={{ color: TEXT_SEC }} className="text-[11px] block">
                  {isAr
                    ? 'يمكن استخدام هذه القسيمة في أي من فروع Quiet Ush Spa في الكويت'
                    : 'Redeemable at USH Spa Kuwait. Please present voucher code upon arrival.'}
                </span>
              </div>
            </div>

            {/* Actions: View Online Voucher & Print */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={generatedVoucher.public_url}
                style={{
                  backgroundColor: PRIMARY_BROWN,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(84, 60, 48, 0.3)',
                }}
                className="w-full sm:flex-1 py-3.5 rounded-full font-bold text-sm text-center transition-opacity hover:opacity-95"
              >
                {isAr ? 'عرض صفحة القسيمة الإلكترونية' : 'Open Online Voucher Page'}
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: PRIMARY_BROWN,
                  color: PRIMARY_BROWN,
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-sm border hover:bg-stone-50 flex items-center justify-center gap-2"
              >
                <PrinterIcon className="w-4 h-4" />
                {isAr ? 'طباعة القسيمة' : 'Print Certificate'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentPhase('category');
                  setSelectedProduct(null);
                  setSelectedService(null);
                  setSelectedArrangement(null);
                  setSelectedAddonIds([]);
                  setSelectedExtraMinutes(0);
                  setRecipientName('');
                  setRecipientPhone('');
                  setGiftMessage('');
                  setGeneratedVoucher(null);
                }}
                style={{
                  backgroundColor: 'rgba(84, 60, 48, 0.1)',
                  color: PRIMARY_BROWN,
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-sm hover:bg-black/10 transition-colors"
              >
                {isAr ? 'إهداء قسيمة أخرى' : 'Gift Another'}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ─── PRODUCT DETAILS MODAL (Matching ushspa product details popup) ──── */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            onClick={() => setDetailProduct(null)}
            className="absolute inset-0 cursor-pointer"
          />
          <div
            style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 z-10 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span style={{ color: ACCENT_BROWN }} className="text-xs font-bold uppercase tracking-wider">
                {detailProduct.brand || 'USH Spa Signature'}
              </span>
              <button
                onClick={() => setDetailProduct(null)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-200">
              <img
                src={detailProduct.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80'}
                alt={detailProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Title & Price */}
            <div>
              <h3
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                className="text-lg font-bold text-[#1A1A1A]"
              >
                {(isAr ? detailProduct.name_ar : detailProduct.name_en) || detailProduct.name}
              </h3>
              <span style={{ color: PRIMARY_BROWN }} className="text-base font-extrabold mt-1 block">
                {detailProduct.current_price} {detailProduct.currency || 'KWD'}
              </span>
            </div>

            {/* Modal Description */}
            <p style={{ color: TEXT_SEC }} className="text-sm leading-relaxed">
              {detailProduct.description || detailProduct.short_description}
            </p>

            {/* Extra details if available */}
            {detailProduct.benefits && (
              <div className="pt-2 border-t border-stone-200/80">
                <span className="text-xs font-bold text-[#1A1A1A] block mb-1">
                  {isAr ? 'المميزات والفوائد:' : 'Benefits & Inclusions:'}
                </span>
                <p style={{ color: TEXT_SEC }} className="text-xs leading-relaxed">
                  {detailProduct.benefits}
                </p>
              </div>
            )}

            {/* Select button from modal */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  const p = detailProduct;
                  setDetailProduct(null);
                  handleSelectProduct(p);
                }}
                style={{
                  backgroundColor: PRIMARY_BROWN,
                  color: '#FFFFFF',
                }}
                className="w-full py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-95"
              >
                {isAr ? 'اختيار هذا المنتج والمتابعة' : 'Select This Product & Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SERVICE DETAILS MODAL (Description, Customer Benefits, Session Benefits) ──── */}
      {detailService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            onClick={() => setDetailService(null)}
            className="absolute inset-0 cursor-pointer"
          />
          <div
            style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 z-10 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span style={{ color: ACCENT_BROWN }} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4" />
                {isAr ? 'تفاصيل الخدمة ومميزاتها' : 'Spa Treatment Details'}
              </span>
              <button
                type="button"
                onClick={() => setDetailService(null)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-200 shadow-inner">
              <img
                src={
                  detailService.primary_image ||
                  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
                }
                alt={(isAr ? detailService.name_ar : detailService.name_en) || detailService.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Title & Price / Duration */}
            <div>
              <h3
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif" }}
                className="text-lg sm:text-xl font-bold text-[#1A1A1A]"
              >
                {(isAr ? detailService.name_ar : detailService.name_en) || detailService.name}
              </h3>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span
                  style={{ backgroundColor: 'rgba(163, 120, 84, 0.12)', color: ACCENT_BROWN }}
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                >
                  <ClockIcon className="w-3.5 h-3.5" />
                  {detailService.duration_minutes || 60} {isAr ? 'دقيقة' : 'mins'}
                </span>
                <span style={{ color: PRIMARY_BROWN }} className="text-base font-extrabold">
                  {detailService.current_price || detailService.base_price || '0'} {detailService.currency || 'KWD'}
                </span>
              </div>
            </div>

            {/* Modal Description */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                {isAr ? 'وصف الخدمة' : 'Description'}
              </span>
              <p style={{ color: TEXT_SEC }} className="text-sm leading-relaxed whitespace-pre-line">
                {(isAr ? detailService.description_ar : detailService.description_en) ||
                  detailService.description ||
                  (isAr ? 'جلسة علاجية مميزة وفاخرة مقدمة من يو إس إتش سبا.' : 'Signature therapeutic spa treatment by USH Spa.')}
              </p>
            </div>

            {/* Customer Benefits Section */}
            {(detailService.benefits ||
              detailService.customer_benefits ||
              detailService.benefits_ar ||
              detailService.benefits_en) && (
              <div
                style={{
                  backgroundColor: '#F5ECE3',
                  borderColor: 'rgba(163, 120, 84, 0.22)',
                }}
                className="rounded-2xl p-4 border space-y-2"
              >
                <div className="flex items-center gap-1.5">
                  <SparklesIcon style={{ color: ACCENT_BROWN }} className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    {isAr ? 'فوائد ومميزات الخدمة (Customer Benefits)' : 'Customer Benefits'}
                  </span>
                </div>
                <ServiceBenefitsList
                  rawBenefits={
                    isAr
                      ? detailService.benefits_ar || detailService.benefits || detailService.customer_benefits
                      : detailService.benefits_en || detailService.benefits || detailService.customer_benefits
                  }
                />
              </div>
            )}

            {/* Session Benefits Section */}
            {(detailService.session_benefits ||
              detailService.session_benefits_ar ||
              detailService.session_benefits_en) && (
              <div
                style={{
                  backgroundColor: 'rgba(163, 120, 84, 0.08)',
                  borderColor: 'rgba(163, 120, 84, 0.22)',
                }}
                className="rounded-2xl p-4 border space-y-2"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon style={{ color: ACCENT_BROWN }} className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    {isAr ? 'نتائج وفوائد الجلسة (Session Benefits)' : 'Session Benefits'}
                  </span>
                </div>
                <ServiceBenefitsList
                  rawBenefits={
                    isAr
                      ? detailService.session_benefits_ar || detailService.session_benefits
                      : detailService.session_benefits_en || detailService.session_benefits
                  }
                />
              </div>
            )}

            {/* Loading indicator if fetching more details */}
            {isLoadingServiceDetail && (
              <div className="flex items-center justify-center gap-2 py-1 text-xs text-stone-500">
                <ArrowPathIcon className="w-3.5 h-3.5 animate-spin text-[#A37854]" />
                <span>{isAr ? 'جاري تحميل تفاصيل الخدمة...' : 'Loading full service details...'}</span>
              </div>
            )}

            {/* Modal Action button */}
            <div className="pt-2">
              {currentPhase === 'services' ? (
                <button
                  type="button"
                  onClick={() => {
                    const s = detailService;
                    setDetailService(null);
                    handleSelectService(s);
                  }}
                  style={{
                    backgroundColor: PRIMARY_BROWN,
                    color: '#FFFFFF',
                  }}
                  className="w-full py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-4 h-4 stroke-[3]" />
                  <span>{isAr ? 'اختيار هذه الخدمة والمتابعة' : 'Select This Treatment & Continue'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDetailService(null)}
                  style={{
                    backgroundColor: PRIMARY_BROWN,
                    color: '#FFFFFF',
                  }}
                  className="w-full py-3 rounded-full font-bold text-sm transition-opacity hover:opacity-95 shadow-md"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

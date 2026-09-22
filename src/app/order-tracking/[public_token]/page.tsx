'use client';

import React, { use, useEffect, useState, useRef } from 'react';

/* ── Allowed Luxury Spa Palette: #543C30, #D3C0B1, #4E2712, #EBE5DE, #FFFFFF ── */

/* ── Types ── */
type Lang = 'en' | 'ar';

interface OrderItem {
  id?: string;
  name?: string;
  product_name?: string;
  product_name_ar?: string;
  product_image_url?: string;
  image?: string;
  quantity: number;
  unit_price?: string | number;
  price?: string | number;
  line_total?: string | number;
  currency?: string;
}

interface StatusHistoryItem {
  from_status?: string;
  from_status_label?: string;
  to_status?: string;
  to_status_label?: string;
  note?: string;
  created_at?: string;
}

interface ServiceData {
  id?: string;
  name?: string;
  name_ar?: string;
  image?: string | null;
  image1?: string | null;
  currency?: string;
  price?: string;
  duration?: number;
  duration_minutes?: number;
}

interface BranchData {
  id?: string;
  name?: string;
  name_ar?: string;
  city?: string;
  address?: string;
}

interface OrderData {
  id?: string | number;
  order_number?: string;
  voucher_number?: string;
  voucher_no?: string;
  voucher_code?: string;
  status?: string;
  delivery_status?: string;
  delivery_status_label?: string;
  delivery_status_label_ar?: string;
  payment_status?: string;
  gift_category?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  gift_from?: string;
  sender_data?: { name?: string; phone_number?: string };
  recipient_data?: { name?: string; email?: string; phone_number?: string; avatar?: string | null };
  recipient_phone?: string;
  gift_message?: string;
  service?: string;
  service_name?: string;
  service_data?: ServiceData;
  branch_data?: BranchData;
  date?: string;
  scheduled_date?: string;
  appointment_date?: string;
  created_at?: string;
  time?: string;
  scheduled_time?: string;
  appointment_time?: string;
  duration?: number;
  therapist?: string;
  location?: string;
  notes?: string;
  total?: string | number;
  amount?: string | number;
  currency?: string;
  items?: OrderItem[];
  ordered_items?: OrderItem[];
  status_history?: StatusHistoryItem[];
  [key: string]: unknown;
}

/* ── Logo component ── */
function Logo({ size = 40, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <img
      src="/images/app-logo.jpg"
      alt="USH Spa"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        objectFit: 'cover',
        display: 'block',
        ...style,
      }}
    />
  );
}

/* ── Language Switcher Component ── */
function LanguageSwitcher({ lang, onToggle }: { lang: Lang; onToggle: (l: Lang) => void }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.14)',
        borderRadius: 20,
        padding: '2px',
        border: '1px solid rgba(211,192,177,0.4)',
      }}
    >
      <button
        id="lang-switch-en"
        type="button"
        onClick={() => onToggle('en')}
        style={{
          background: lang === 'en' ? '#FFFFFF' : 'transparent',
          color: lang === 'en' ? '#4E2712' : '#FFFFFF',
          border: 'none',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 200ms ease',
          lineHeight: 1.2,
        }}
      >
        EN
      </button>
      <button
        id="lang-switch-ar"
        type="button"
        onClick={() => onToggle('ar')}
        style={{
          background: lang === 'ar' ? '#FFFFFF' : 'transparent',
          color: lang === 'ar' ? '#4E2712' : '#FFFFFF',
          border: 'none',
          borderRadius: 16,
          padding: '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 200ms ease',
          fontFamily: "'Cairo', 'Segoe UI', sans-serif",
          lineHeight: 1.2,
        }}
      >
        عربي
      </button>
    </div>
  );
}

/* ── Delivery Step Helper ── */
function getDeliveryStep(status?: string): number {
  const s = (status ?? '').toLowerCase();
  if (s === 'received' || s.includes('received') || s.includes('completed')) return 4;
  if (s === 'delivered' || s.includes('delivered')) return 3;
  if (
    s === 'on_the_way' ||
    s.includes('on_the_way') ||
    s.includes('on the way') ||
    s.includes('transit') ||
    s.includes('shipped') ||
    s.includes('out_for_delivery')
  ) return 2;
  if (
    s === 'ready_to_go' ||
    s.includes('ready_to_go') ||
    s.includes('ready to go') ||
    s.includes('processing') ||
    s.includes('preparing') ||
    s.includes('confirmed')
  ) return 1;
  return 0; // ordered
}

/* ─────────────────────────── Main Page ─────────────────────── */
export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ public_token: string }>;
}) {
  const { public_token } = use(params);

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [copied, setCopied] = useState(false);

  /* Modal state for delivery receipt confirmation */
  const [modalOpen, setModalOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Load stored language preference */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ush_order_lang') || localStorage.getItem('ush_gift_lang');
      if (saved === 'en' || saved === 'ar') {
        setLang(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem('ush_order_lang', l);
      localStorage.setItem('ush_gift_lang', l);
    } catch {
      /* ignore */
    }
  };

  /* ── Fetch order details ── */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/track/${encodeURIComponent(public_token)}`,
          { cache: 'no-store' }
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errMsg =
            data?.error?.message ||
            data?.detail ||
            data?.message ||
            `Error ${res.status}: Failed to load order`;
          throw new Error(errMsg);
        }

        const raw = data?.data ?? data?.result ?? data?.order ?? data;
        setOrder(raw);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to retrieve order details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [public_token]);

  /* Focus input on modal open */
  useEffect(() => {
    if (modalOpen && !submitSuccess) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [modalOpen, submitSuccess]);

  /* ── Submit receipt confirmation ── */
  const handleReceivedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(
        `/api/track/${encodeURIComponent(public_token)}/received`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tracking_code: trackingCode.trim() }),
        }
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        let errorMsg = lang === 'ar' ? 'فشل إرسال رمز التتبع.' : 'Failed to submit tracking code.';
        if (body?.error?.detail && Array.isArray(body.error.detail) && body.error.detail[0]?.msg) {
          errorMsg = body.error.detail[0].msg;
        } else if (body?.error?.message) {
          errorMsg = body.error.message;
        } else if (body?.detail) {
          errorMsg = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
        } else if (body?.message) {
          errorMsg = body.message;
        }
        throw new Error(errorMsg);
      }

      setSubmitSuccess(true);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              delivery_status: 'received',
              delivery_status_label: 'Received',
              delivery_status_label_ar: 'تم الاستلام',
            }
          : null
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : (lang === 'ar' ? 'حدث خطأ ما.' : 'Something went wrong.'));
    } finally {
      setSubmitting(false);
    }
  };

  const isAr = lang === 'ar';

  /* ── Field Resolution with Fallbacks Matching Design Reference ── */
  const voucherNumber =
    order?.voucher_number ||
    (order as unknown as { voucher_no?: string })?.voucher_no ||
    (order as unknown as { voucher_code?: string })?.voucher_code ||
    order?.order_number ||
    (order?.id ? String(order.id) : '') ||
    'V260921003';

  const serviceName =
    (isAr && order?.service_data?.name_ar) ||
    order?.service_data?.name ||
    order?.service_name ||
    order?.service ||
    order?.items?.[0]?.product_name ||
    order?.items?.[0]?.name ||
    (isAr ? 'جلسة الذهب عيار 24 الفاخرة لتجديد البشرة' : '24K Gold Luxury Rejuvenating Facial');

  const serviceDuration =
    order?.service_data?.duration ||
    order?.service_data?.duration_minutes ||
    order?.duration ||
    (isAr ? '1 ساعة' : '1 hr');

  const formattedDuration =
    typeof serviceDuration === 'number'
      ? serviceDuration >= 60
        ? `${Math.floor(serviceDuration / 60)} ${isAr ? 'ساعة' : 'hr'}${serviceDuration % 60 > 0 ? ` ${serviceDuration % 60} ${isAr ? 'دقيقة' : 'min'}` : ''}`
        : `${serviceDuration} ${isAr ? 'دقيقة' : 'min'}`
      : String(serviceDuration);

  const serviceLocation =
    (isAr && order?.branch_data?.name_ar) ||
    order?.branch_data?.name ||
    order?.location ||
    (isAr ? 'صالة كويت سيتي لكبار الشخصيات' : 'Kuwait City VIP Lounge');

  const serviceImg =
    order?.service_data?.image1 ||
    order?.service_data?.image ||
    order?.items?.[0]?.product_image_url ||
    order?.items?.[0]?.image ||
    '/images/serv-14.jpg';

  const itemsList = order?.ordered_items || order?.items || [];

  const rawStatus = order?.delivery_status ?? order?.status;
  const currentStep = getDeliveryStep(rawStatus);
  const isDelivered = currentStep === 3;
  const isReceived = currentStep === 4;
  const hasDeliveryTracking = Boolean(order?.delivery_status || order?.status);

  /* Copy Voucher Number */
  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(voucherNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const STEPS = [
    { key: 'ordered',     label: isAr ? 'تم الطلب' : 'Ordered',        icon: '📋' },
    { key: 'ready_to_go', label: isAr ? 'جاهز للانطلاق' : 'Ready To Go', icon: '📦' },
    { key: 'on_the_way',  label: isAr ? 'في الطريق' : 'On The Way',    icon: '🚚' },
    { key: 'delivered',   label: isAr ? 'تم التوصيل' : 'Delivered',    icon: '📬' },
    { key: 'received',    label: isAr ? 'تم الاستلام' : 'Received',    icon: '✓'  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cairo:wght@400;500;600;700;800&family=Lustria&family=Roboto:wght@300;400;500;600;700&display=swap');

        .order-outer {
          min-height: 100vh;
          background: #543C30;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 0;
          font-family: ${isAr ? "'Cairo', sans-serif" : "'Roboto', sans-serif"};
        }
        .order-shell {
          width: 100%;
          max-width: 430px;
          min-height: 100vh;
          background: #D3C0B2;
          box-shadow: 0 0 60px rgba(0,0,0,0.55), -12px 0 35px rgba(0,0,0,0.35), 12px 0 35px rgba(0,0,0,0.35);
          position: relative;
          overflow-x: hidden;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="order-outer" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="order-shell">

          {/* ── Top Bar (Logo + Lang Switcher + Digital Gift Badge) ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              background: '#543C30',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              boxShadow: '0 4px 20px rgba(78,39,18,0.25)',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Logo size={38} />
            </div>

            {/* Language Switcher in Center */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LanguageSwitcher lang={lang} onToggle={handleSetLang} />
            </div>

            {/* Order Tracking Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 20,
                  padding: '5px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: isAr ? 0 : 1,
                  border: '1.5px solid #D3C0B1',
                  fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                  whiteSpace: 'nowrap',
                }}
              >
                {order?.gift_category === 'digital'
                  ? (isAr ? '🎁 هدية رقمية' : '🎁 DIGITAL GIFT')
                  : (isAr ? '📦 تتبع الطلب' : '📦 ORDER TRACKING')}
              </div>
            </div>
          </div>

          {/* ── Loading State ── */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '120px 20px' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '46px',
                  height: '46px',
                  border: '3.5px solid #EBE5DE',
                  borderTop: '3.5px solid #543C30',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  marginBottom: '18px',
                }}
              />
              <p
                style={{
                  color: '#543C30',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                }}
              >
                {isAr ? 'جاري استرجاع تفاصيل الطلب…' : 'Retrieving order status…'}
              </p>
            </div>
          )}

          {/* ── Error State ── */}
          {!loading && error && (
            <div style={{ padding: '40px 18px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 24,
                  padding: '36px 24px',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(78,39,18,0.08)',
                  border: '1px solid #EBE5DE',
                }}
              >
                <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>📦</div>
                <h2
                  style={{
                    fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#543C30',
                    marginBottom: '8px',
                  }}
                >
                  {isAr ? 'إشعار تتبع الطلب' : 'Order Tracking Notice'}
                </h2>
                <p
                  style={{
                    color: '#543C30',
                    opacity: 0.75,
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    marginBottom: '22px',
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '10px 28px',
                    background: '#543C30',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 999,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                  }}
                >
                  {isAr ? 'إعادة المحاولة' : 'Try Again'}
                </button>
              </div>
            </div>
          )}

          {/* ── Loaded Content ── */}
          {!loading && (
            <div style={{ paddingBottom: '30px' }}>

              {/* ── Card 1: Voucher Number Bar ── */}
              <div
                style={{
                  margin: '16px 18px 0',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FBF9F7 100%)',
                  borderRadius: 20,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  border: '1.5px solid #D3C0B1',
                  boxShadow: '0 8px 24px rgba(78,39,18,0.09)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #543C30 0%, #4E2712 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      color: '#FFFFFF',
                      flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(84,60,48,0.25)',
                    }}
                  >
                    🎟️
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.66rem',
                        color: '#543C30',
                        fontWeight: 700,
                        letterSpacing: isAr ? 0 : 2,
                        textTransform: 'uppercase',
                        marginBottom: 3,
                        opacity: 0.8,
                        fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                      }}
                    >
                      {order?.voucher_number
                        ? (isAr ? 'رقم القسيمة' : 'VOUCHER NUMBER')
                        : (isAr ? 'رقم الطلب' : 'ORDER NUMBER')}
                    </div>
                    <div
                      dir="ltr"
                      style={{
                        fontFamily: "'Lustria', serif",
                        fontSize: '1.18rem',
                        fontWeight: 700,
                        color: '#4E2712',
                        letterSpacing: '1.5px',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {voucherNumber}
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  id="copy-voucher-number-btn"
                  type="button"
                  onClick={handleCopy}
                  title={isAr ? 'نسخ رقم القسيمة' : 'Copy Voucher Number'}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 12,
                    border: copied ? '1.5px solid #543C30' : '1.5px solid #D3C0B1',
                    background: copied ? '#543C30' : '#EBE5DE',
                    color: copied ? '#FFFFFF' : '#4E2712',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                    transition: 'all 200ms ease',
                    boxShadow: copied ? '0 4px 12px rgba(84,60,48,0.25)' : 'none',
                    fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!copied) e.currentTarget.style.background = '#D3C0B1';
                  }}
                  onMouseLeave={(e) => {
                    if (!copied) e.currentTarget.style.background = '#EBE5DE';
                  }}
                >
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>

              {/* ── Order Items Card ── */}
              <div
                style={{
                  margin: '16px 18px 0',
                  background: '#FFFFFF',
                  borderRadius: 24,
                  boxShadow: '0 6px 24px rgba(78,39,18,0.06)',
                  border: '1px solid #EBE5DE',
                  overflow: 'hidden',
                }}
              >
                {/* Two-Tone Header (Beige Part) */}
                <div
                  style={{
                    padding: '16px 20px 14px',
                    borderBottom: '1px solid #EBE5DE',
                    background: '#EBE5DE',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: '#543C30',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(84,60,48,0.2)',
                      flexShrink: 0,
                    }}
                  >
                    🛍️
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                        fontWeight: 700,
                        color: '#4E2712',
                        fontSize: '1.05rem',
                      }}
                    >
                      {isAr ? 'عناصر الطلب' : 'Order Items'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#4E2712',
                        opacity: 0.7,
                        fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                      }}
                    >
                      {itemsList.length > 0
                        ? (isAr ? `المنتجات المطلوبة (${itemsList.length})` : `${itemsList.length} ${itemsList.length === 1 ? 'Product' : 'Products'}`)
                        : (isAr ? 'تفاصيل الطلب' : 'Order Details')}
                    </div>
                  </div>
                </div>

                {/* Body (White Part) */}
                <div style={{ padding: '16px 20px' }}>
                  {/* Physical Product Items */}
                  {itemsList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {itemsList.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            padding: '10px 14px',
                            background: '#EBE5DE',
                            borderRadius: 14,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            {(item.product_image_url || item.image) && (
                              <img
                                src={item.product_image_url || item.image}
                                alt={item.product_name || item.name || 'Item'}
                                style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                              />
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                                  fontSize: '0.92rem',
                                  fontWeight: 700,
                                  color: '#4E2712',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.product_name || item.name}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#4E2712', opacity: 0.7, marginTop: 2 }}>
                                {isAr ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4E2712', flexShrink: 0 }}>
                            {item.line_total || item.price || item.unit_price} {item.currency || order?.currency || 'KWD'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback only if single service with no itemized products */
                    Boolean(order?.service_data?.name || order?.service) && (
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <img
                          src={serviceImg}
                          alt={serviceName}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/serv-14.jpg';
                          }}
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 16,
                            objectFit: 'cover',
                            flexShrink: 0,
                            border: '1px solid #D3C0B1',
                            display: 'block',
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                              fontWeight: 700,
                              color: '#4E2712',
                              fontSize: '1.05rem',
                              lineHeight: 1.3,
                            }}
                          >
                            {serviceName}
                          </div>

                          {formattedDuration && (
                            <div
                              style={{
                                fontSize: '0.82rem',
                                color: '#4E2712',
                                opacity: 0.7,
                                marginTop: 4,
                                fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                              }}
                            >
                              ⏱ {formattedDuration}
                            </div>
                          )}

                          {serviceLocation && (
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: '#4E2712',
                                opacity: 0.7,
                                marginTop: 4,
                                fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                              }}
                            >
                              📍 {serviceLocation}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ── Optional Delivery Progress & Confirm Receipt (if order tracking status exists) ── */}
              {hasDeliveryTracking && (
                <div
                  style={{
                    margin: '16px 18px 0',
                    background: '#FFFFFF',
                    borderRadius: 24,
                    padding: '22px 20px',
                    boxShadow: '0 6px 24px rgba(78,39,18,0.06)',
                    border: '1px solid #EBE5DE',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                        fontWeight: 700,
                        color: '#4E2712',
                        fontSize: '1rem',
                      }}
                    >
                      {isAr ? 'مراحل التوصيل' : 'Delivery Progress'}
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: '#EBE5DE',
                        color: '#4E2712',
                        fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                      }}
                    >
                      {STEPS[currentStep]?.label}
                    </span>
                  </div>

                  {/* Progress Line and Circles */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '18px',
                        left: '8%',
                        right: '8%',
                        height: '2px',
                        background: '#EBE5DE',
                      }}
                    />
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '18px',
                        left: isAr ? 'auto' : '8%',
                        right: isAr ? '8%' : 'auto',
                        width: `${(currentStep / (STEPS.length - 1)) * 84}%`,
                        height: '2px',
                        background: '#543C30',
                        transition: 'width 400ms ease',
                      }}
                    />

                    {STEPS.map((step, idx) => {
                      const done = idx <= currentStep;
                      const current = idx === currentStep;
                      return (
                        <div
                          key={step.key}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 6,
                            position: 'relative',
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: done ? '#543C30' : '#EBE5DE',
                              color: done ? '#FFFFFF' : '#8A7468',
                              border: current ? '2.5px solid #D3C0B1' : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              boxShadow: current ? '0 4px 12px rgba(84,60,48,0.25)' : 'none',
                              zIndex: 1,
                              transition: 'all 250ms ease',
                            }}
                          >
                            {step.icon}
                          </div>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: current ? 700 : 500,
                              color: done ? '#543C30' : '#8A7468',
                              textAlign: 'center',
                              lineHeight: 1.2,
                              fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                            }}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>



                  {isReceived && (
                    <div
                      style={{
                        marginTop: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        background: '#dcfce7',
                        color: '#16a34a',
                        borderRadius: 14,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: '1px solid #bbf7d0',
                        fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                      }}
                    >
                      <span>✓</span>
                      <span>{isAr ? 'تم تأكيد استلام الطلب بنجاح' : 'Order Marked as Received'}</span>
                    </div>
                  )}
                </div>
              )}



              {/* ── Footer ── */}
              <div
                style={{
                  marginTop: '44px',
                  textAlign: 'center',
                  color: '#4E2712',
                  opacity: 0.85,
                  fontSize: '0.8rem',
                  padding: '0 20px 48px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Logo size={36} />
                </div>
                <p style={{ lineHeight: 1.7, fontFamily: isAr ? "'Cairo', sans-serif" : undefined }}>
                  {isAr ? 'شكراً لكونك جزءاً من عائلة USH Spa.' : 'Thank you for being with us.'}<br />
                  <span style={{ color: '#543C30', fontSize: '0.74rem', fontWeight: 600 }}>
                    {isAr ? `معرف الطلب: ${voucherNumber}` : `Reference ID: ${voucherNumber}`}
                  </span>
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── Confirm Receipt Modal ── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(40,24,18,0.7)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal Box */}
          <div
            style={{
              position: 'relative',
              background: '#FFFFFF',
              borderRadius: 24,
              width: '100%',
              maxWidth: 420,
              padding: '36px 28px',
              boxShadow: '0 24px 64px rgba(78,39,18,0.3)',
              border: '1.5px solid #D3C0B1',
              animation: 'modalIn 0.25s ease',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              id="close-modal-btn"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 16,
                right: isAr ? 'auto' : 16,
                left: isAr ? 16 : 'auto',
                background: '#EBE5DE',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#543C30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>

            {submitSuccess ? (
              <div>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 16px',
                    color: '#16a34a',
                  }}
                >
                  ✓
                </div>
                <h3
                  id="modal-title"
                  style={{
                    fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#543C30',
                    marginBottom: 8,
                  }}
                >
                  {isAr ? 'تم تأكيد الاستلام!' : 'Delivery Confirmed!'}
                </h3>
                <p
                  style={{
                    color: '#543C30',
                    opacity: 0.8,
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    marginBottom: 20,
                    fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                  }}
                >
                  {isAr
                    ? 'شكراً لك! تم تسجيل استلام طلبك بنجاح.'
                    : 'Thank you! Your package has been marked as received.'}
                </p>
                <button
                  id="close-success-btn"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '10px 32px',
                    background: '#543C30',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 999,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                  }}
                >
                  {isAr ? 'تم' : 'Done'}
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#543C30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    margin: '0 auto 16px',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(84,60,48,0.25)',
                  }}
                >
                  📦
                </div>

                <h3
                  id="modal-title"
                  style={{
                    fontFamily: isAr ? "'Cairo', sans-serif" : "'Lustria', serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#543C30',
                    marginBottom: 6,
                  }}
                >
                  {isAr ? 'تأكيد استلام الطلب' : 'Confirm Delivery'}
                </h3>
                <p
                  style={{
                    color: '#543C30',
                    opacity: 0.75,
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    marginBottom: 22,
                    fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                  }}
                >
                  {isAr
                    ? 'يرجى إدخال رمز التتبع الخاص بك لتأكيد الاستلام.'
                    : 'Please enter your tracking code below to verify receipt of your order.'}
                </p>

                <form onSubmit={handleReceivedSubmit} noValidate>
                  <input
                    id="tracking-code-input"
                    ref={inputRef}
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    placeholder={isAr ? 'مثال: TRK123456' : 'e.g. TRK123456'}
                    required
                    dir="ltr"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: submitError ? '1.5px solid #dc2626' : '1.5px solid #D3C0B1',
                      fontSize: '1rem',
                      color: '#4E2712',
                      outline: 'none',
                      background: '#EBE5DE',
                      textAlign: 'center',
                      letterSpacing: '1px',
                      fontFamily: "'Lustria', serif",
                      marginBottom: submitError ? 10 : 20,
                    }}
                  />

                  {submitError && (
                    <div
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontSize: '0.8rem',
                        marginBottom: 16,
                        lineHeight: 1.4,
                      }}
                    >
                      {submitError}
                    </div>
                  )}

                  <button
                    id="submit-tracking-btn"
                    type="submit"
                    disabled={submitting || !trackingCode.trim()}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: submitting || !trackingCode.trim() ? '#D3C0B1' : '#543C30',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 14,
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: submitting || !trackingCode.trim() ? 'not-allowed' : 'pointer',
                      transition: 'all 200ms',
                      boxShadow: submitting || !trackingCode.trim() ? 'none' : '0 4px 14px rgba(84,60,48,0.25)',
                      fontFamily: isAr ? "'Cairo', sans-serif" : undefined,
                    }}
                  >
                    {submitting
                      ? (isAr ? 'جاري التأكيد…' : 'Submitting…')
                      : (isAr ? 'تأكيد الاستلام' : 'Submit & Confirm')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

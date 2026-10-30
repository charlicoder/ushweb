'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackPurchase } from '@/lib/fbpixel';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import {
  GiftIcon,
  CheckCircleIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  HomeIcon,
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleBottomCenterTextIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

const PRIMARY_BROWN = '#543C30';
const CARD_BG = '#FAF5EE';
const BORDER_COLOR = 'rgba(163, 120, 84, 0.25)';
const TEXT_SEC = '#8A6D5F';
const GOLD_ACCENT = '#C5A059';

interface VoucherData {
  id: string;
  voucher_number?: string;
  gift_category?: string;
  total_amount?: string;
  currency?: string;
  status?: string;
  secret_code?: string;
  public_token?: string;
  public_url?: string;
  gift_from?: string;
  gift_message?: string;
  sender_name?: string;
  sender_data?: { name?: string; phone_number?: string };
  sender_details?: { name?: string; phone_number?: string };
  recipient_name?: string;
  recipient_phone?: string;
  recipient_data?: { name?: string; phone_number?: string };
  recipient_details?: { name?: string; phone_number?: string };
  service_data?: { name?: string; name_ar?: string; duration?: number };
  branch_data?: { name?: string; name_ar?: string };
  expire_date?: string;
  created_at?: string;
}

export default function GiftVoucherPaymentSuccessClient() {
  const searchParams = useSearchParams();

  const voucherId =
    searchParams.get('voucher_id') || searchParams.get('target_id') || searchParams.get('id') || '';
  const paymentId =
    searchParams.get('paymentId') ||
    searchParams.get('Id') ||
    searchParams.get('payment_id') ||
    '';
  const invoiceId = searchParams.get('InvoiceId') || searchParams.get('invoice_id') || '';
  const amountParam = searchParams.get('amount') || '';
  const rawCurrencyParam =
    searchParams.get('currency') ||
    searchParams.get('Currency') ||
    searchParams.get('CurrencyIso') ||
    searchParams.get('currencyIso') ||
    '';
  const currencyParam =
    rawCurrencyParam.toUpperCase() === 'KD' || !rawCurrencyParam
      ? 'KWD'
      : rawCurrencyParam.toUpperCase();

  // Overwrite values directly from URL parameters sent at payment initiation
  const paramGiftFrom = searchParams.get('gift_from') || '';
  const paramRecipientName = searchParams.get('recipient_name') || '';
  const paramRecipientPhone = searchParams.get('recipient_phone') || '';

  const { lang, isAr, isDark } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [voucher, setVoucher] = useState<VoucherData | null>(null);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Stored form data saved before gateway redirect
  const [storedFormData, setStoredFormData] = useState<Record<string, any> | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw =
        sessionStorage.getItem('ush_gift_form_data') ||
        localStorage.getItem('ush_gift_form_data');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const keysToTry = [
        voucherId ? `ush_gift_form_${voucherId}` : null,
        voucher?.id ? `ush_gift_form_${voucher?.id}` : null,
        voucher?.voucher_number ? `ush_gift_form_${voucher?.voucher_number}` : null,
        'ush_gift_form_data',
      ].filter(Boolean) as string[];

      for (const k of keysToTry) {
        const raw = sessionStorage.getItem(k) || localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              setStoredFormData((prev) => ({ ...parsed, ...(prev || {}) }));
              break;
            }
          } catch {}
        }
      }
    } catch {
      // ignore storage error
    }
  }, [voucherId, voucher?.id, voucher?.voucher_number]);

  useEffect(() => {
    let isMounted = true;

    async function activateVoucherAndLoad() {
      if (!voucherId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Send API request to update voucher status (similar to ushdesk)
        const updateRes = await fetch(`/api/vouchers/${encodeURIComponent(voucherId)}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'active',
            payment_id: paymentId || invoiceId || undefined,
            payment_data: {
              payment_id: paymentId,
              invoice_id: invoiceId,
              gateway: 'MyFatoorah',
              paid_at: new Date().toISOString(),
            },
            payment_provider: 'MyFatoorah',
            payment_through: 'ushweb',
          }),
        });

        const json = await updateRes.json().catch(() => ({}));

        if (isMounted) {
          if (json?.data) {
            setVoucher(json.data);
            setStatusUpdated(true);
            const rawVoucherCurrency = json.data.currency || currencyParam || 'KWD';
            const finalCurrency =
              rawVoucherCurrency.toUpperCase() === 'KD' ? 'KWD' : rawVoucherCurrency.toUpperCase();

            trackPurchase({
              value: Number(amountParam) || Number(json.data.total_amount) || 0,
              currency: finalCurrency,
              transactionId: paymentId || invoiceId || voucherId,
              contentName: 'Gift Voucher',
            });
            setShowShareModal(true); // Automatically show share popup window
          }
        }
      } catch (err) {
        console.warn('Error activating voucher:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    activateVoucherAndLoad();

    return () => {
      isMounted = false;
    };
  }, [voucherId, paymentId, invoiceId]);

  // Priority rule: recipient_name and sender_name must come from the form data not coming from database.
  // For example:
  // - gift_from from form data replaces sender name if not null/empty
  // - To (from ushspa) / Recipient's Full Name * (from ushweb) replaces recipient_name if not null/empty
  const formRecipientName =
    paramRecipientName?.trim() ||
    searchParams.get('to')?.trim() ||
    searchParams.get('recipient')?.trim() ||
    storedFormData?.recipient_name?.trim() ||
    storedFormData?.to?.trim() ||
    storedFormData?.recipient_full_name?.trim() ||
    storedFormData?.recipientName?.trim() ||
    '';

  const recipientName =
    formRecipientName ||
    voucher?.recipient_data?.name?.trim() ||
    voucher?.recipient_name?.trim() ||
    voucher?.recipient_details?.name?.trim() ||
    (isAr ? 'المستلمة الكريمة' : 'Recipient');

  const formSenderName =
    paramGiftFrom?.trim() ||
    searchParams.get('sender_name')?.trim() ||
    searchParams.get('from')?.trim() ||
    storedFormData?.gift_from?.trim() ||
    storedFormData?.giftFrom?.trim() ||
    storedFormData?.sender_name?.trim() ||
    storedFormData?.senderName?.trim() ||
    '';

  const senderName =
    formSenderName ||
    voucher?.gift_from?.trim() ||
    voucher?.sender_data?.name?.trim() ||
    voucher?.sender_name?.trim() ||
    voucher?.sender_details?.name?.trim() ||
    (isAr ? 'مُهدَى بكل حب' : 'Guest');

  const formRecipientPhone =
    paramRecipientPhone?.trim() ||
    searchParams.get('phone')?.trim() ||
    storedFormData?.recipient_phone?.trim() ||
    storedFormData?.recipientPhone?.trim() ||
    '';

  const recipientPhone =
    formRecipientPhone ||
    voucher?.recipient_phone?.trim() ||
    voucher?.recipient_data?.phone_number?.trim() ||
    voucher?.recipient_details?.phone_number?.trim() ||
    '';

  const senderPhone =
    storedFormData?.sender_phone?.trim() ||
    voucher?.sender_data?.phone_number?.trim() ||
    '';

  const totalAmount = voucher?.total_amount || amountParam || '0.000';
  const currency = voucher?.currency || currencyParam || 'KWD';
  const voucherCode =
    voucher?.voucher_number ||
    searchParams.get('voucher_code') ||
    storedFormData?.voucher_code ||
    voucherId.slice(0, 8);
  const secretCode =
    voucher?.secret_code ||
    searchParams.get('secret_code') ||
    storedFormData?.secret_code ||
    '';
  const voucherCodeDisplay = secretCode || voucherCode;

  // Public gift page URL
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://ushspa.co';
  const publicToken =
    voucher?.public_token ||
    searchParams.get('public_token') ||
    storedFormData?.public_token;
  const publicVoucherUrl = publicToken
    ? `${origin}/gift/${publicToken}`
    : voucher?.public_url
    ? (voucher.public_url.startsWith('http') ? voucher.public_url : `${origin}${voucher.public_url}`)
    : voucherId
    ? `${origin}/gift/${voucherId}`
    : `${origin}/gift-voucher`;

  const cleanRecipientPhone = recipientPhone.replace(/\D+/g, '');

  // Preloaded message format matching exact specification
  const preloadedShareMessage =
    `A Gift of Serenity ✨\n\n` +
    `${recipientName} العزيزة،\n` +
    `أُعدّ لكِ هذا الإهداء من ${senderName}، لتنعمي \n` +
    `بتجربة من الرفاهية والاسترخاء \n` +
    `في ush wellness .. \n\n` +
    `Gift Code: ${voucherCodeDisplay}\n` +
    `للاطلاع على تفاصيل الإهداء\n\n` +
    `${publicVoucherUrl}\n\n` +
    `لحظاتٌ لكِ وحدكِ، \n` +
    `من الهدوء والعناية والدلال 🤍`;

  const whatsappUrl = cleanRecipientPhone
    ? `https://wa.me/${cleanRecipientPhone}?text=${encodeURIComponent(preloadedShareMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(preloadedShareMessage)}`;

  const smsUrl = cleanRecipientPhone
    ? `sms:${cleanRecipientPhone}?&body=${encodeURIComponent(preloadedShareMessage)}`
    : `sms:?&body=${encodeURIComponent(preloadedShareMessage)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicVoucherUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(preloadedShareMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleCopyCode = () => {
    if (!secretCode) return;
    navigator.clipboard.writeText(secretCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: isDark ? '#17110e' : '#EAE5DF',
        minHeight: '100vh',
        color: isDark ? '#f7eee9' : '#1A1A1A',
      }}
      className="flex flex-col font-sans pt-[64px] sm:pt-[68px] transition-colors duration-300"
    >
      <Header />

      {/* Top Banner */}
      <div
        style={{
          backgroundColor: isDark ? '#261b16' : '#d6c3b5',
          borderColor: isDark ? 'rgba(239, 166, 151, 0.15)' : 'rgba(84, 60, 48, 0.15)',
        }}
        className="border-b py-3 px-4 sm:px-8 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: isDark ? '#f7eee9' : '#543C30' }}>
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{isAr ? 'تأكيد السداد وتفعيل القسيمة' : 'Payment Confirmed & Voucher Active'}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-2xl mx-auto w-full space-y-6">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <ArrowPathIcon style={{ color: PRIMARY_BROWN }} className="w-8 h-8 animate-spin mx-auto" />
            <p style={{ color: TEXT_SEC }} className="text-sm font-semibold">
              {isAr ? 'جاري تفعيل القسيمة في النظام...' : 'Activating your voucher in database...'}
            </p>
          </div>
        ) : (
          <>
            {/* Success Heading */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircleIcon className="w-10 h-10 stroke-[2.2]" />
              </div>
              <h1
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif", color: PRIMARY_BROWN }}
                className="text-2xl sm:text-3xl font-extrabold"
              >
                {isAr ? 'تم استلام الدفع وتفعيل القسيمة بنجاح!' : 'Payment Received & Voucher Activated!'}
              </h1>
              <p style={{ color: TEXT_SEC }} className="text-xs sm:text-sm max-w-md mx-auto">
                {isAr
                  ? 'تم تسجيل الدفع عبر بوابة ماي فاتورة وتحديث حالة القسيمة إلى نشطة (Active)'
                  : 'Payment processed via MyFatoorah and voucher status updated to Active.'}
              </p>
            </div>

            {/* Voucher Certificate Card */}
            <div
              style={{
                backgroundColor: CARD_BG,
                borderColor: GOLD_ACCENT,
                borderWidth: 2,
                boxShadow: '0 12px 30px rgba(84, 60, 48, 0.08)',
              }}
              className="rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Gold Ribbon Badge */}
              <div className="flex items-center justify-between border-b pb-4 border-stone-200">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: 'rgba(197, 160, 89, 0.2)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#543C30]"
                  >
                    <GiftIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm uppercase tracking-wider font-bold text-[#543C30] block">
                      {isAr ? 'شهادة هدية فاخرة - أوش سبا' : 'USH Spa Luxury Gift Certificate'}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    {isAr ? 'نشطة ومفعلة' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Amount & Voucher Code Block */}
              <div
                style={{ backgroundColor: '#FDF8F1', borderColor: BORDER_COLOR }}
                className="p-4 rounded-2xl border grid grid-cols-2 gap-4 text-center"
              >
                <div>
                  <span style={{ color: TEXT_SEC }} className="text-xs block font-bold">
                    {isAr ? 'قيمة القسيمة' : 'Voucher Value'}
                  </span>
                  <span style={{ color: PRIMARY_BROWN }} className="text-2xl font-black block mt-0.5">
                    {totalAmount} {currency}
                  </span>
                </div>

                <div className="border-s border-stone-200 ps-4">
                  <span style={{ color: TEXT_SEC }} className="text-xs block font-bold">
                    {isAr ? 'كود القسيمة' : 'Voucher Code'}
                  </span>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="font-mono font-black text-xl text-emerald-800 tracking-wider">
                      {secretCode || '••••••'}
                    </span>
                    {secretCode && (
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                        title={isAr ? 'نسخ كود القسيمة' : 'Copy Voucher Code'}
                      >
                        {copiedCode ? (
                          <CheckIcon className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1">
                  <span style={{ color: TEXT_SEC }} className="block font-bold">
                    {isAr ? 'مُهدَى من (المرسل):' : 'Gifted From (Sender):'}
                  </span>
                  <span className="font-bold text-stone-800 text-sm block">{senderName}</span>
                  {senderPhone && <span style={{ color: TEXT_SEC }}>{senderPhone}</span>}
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1">
                  <span style={{ color: TEXT_SEC }} className="block font-bold">
                    {isAr ? 'إلى المستلم:' : 'Gifted To (Recipient):'}
                  </span>
                  <span className="font-bold text-stone-800 text-sm block">{recipientName}</span>
                  {recipientPhone && <span style={{ color: TEXT_SEC }}>{recipientPhone}</span>}
                </div>
              </div>

              {/* Message if present */}
              {voucher?.gift_message && (
                <div className="p-3.5 bg-white/70 rounded-xl border border-stone-200 text-xs text-stone-700 italic">
                  &ldquo;{voucher.gift_message}&rdquo;
                </div>
              )}

              {/* Payment Receipt Info */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200 text-stone-500">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheckIcon className="w-4 h-4" />
                  {isAr ? 'مدفوع وموثق عبر ماي فاتورة' : 'Verified via MyFatoorah'}
                </span>
                <span>{voucher?.created_at ? new Date(voucher.created_at).toLocaleDateString() : 'Today'}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                }}
                className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <ShareIcon className="w-5 h-5" />
                <span>{isAr ? 'خيارات مشاركة القسيمة (واتساب / SMS)' : 'Share Voucher Options (WhatsApp / SMS)'}</span>
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
                  className="py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:opacity-95"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                <a
                  href={smsUrl}
                  style={{ backgroundColor: '#0284c7', color: '#FFFFFF' }}
                  className="py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:opacity-95"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  <span>{isAr ? 'رسالة SMS' : 'SMS'}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
                  className="py-3 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 hover:bg-white cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>{isAr ? 'تم نسخ الرسالة!' : 'Message Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-stone-600" />
                      <span>{isAr ? 'نسخ نص SMS' : 'Copy SMS'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
                  className="py-3 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 hover:bg-white cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>{isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="w-4 h-4 text-stone-600" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handlePrint}
                  style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR }}
                  className="py-3 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 hover:bg-white cursor-pointer"
                >
                  <PrinterIcon className="w-4 h-4 text-stone-600" />
                  <span>{isAr ? 'طباعة الشهادة' : 'Print Certificate'}</span>
                </button>

                <Link
                  href="/"
                  style={{ backgroundColor: PRIMARY_BROWN, color: '#FFFFFF' }}
                  className="py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:opacity-95"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ==================================================================== */}
      {/* POPUP MODAL: SHARE WITH RECIPIENT                                     */}
      {/* ==================================================================== */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            style={{ backgroundColor: '#FAF5EE', borderColor: GOLD_ACCENT, borderWidth: 2 }}
            className="w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative animate-scaleUp"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300 flex items-center justify-center text-stone-600 cursor-pointer"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 pt-1">
              <div
                style={{ backgroundColor: 'rgba(197, 160, 89, 0.2)' }}
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-[#543C30]"
              >
                <GiftIcon className="w-8 h-8 text-[#543C30]" />
              </div>
              <h3
                style={{ fontFamily: isAr ? 'inherit' : "'Lustria', serif", color: PRIMARY_BROWN }}
                className="text-xl sm:text-2xl font-black"
              >
                {isAr
                  ? 'تم استلام الدفع بنجاح! هل ترغب في مشاركة القسيمة مع المستلم؟'
                  : 'Payment Successful! Would you like to share this voucher with the recipient?'}
              </h3>
              <p style={{ color: TEXT_SEC }} className="text-xs sm:text-sm">
                {isAr
                  ? `أرسل القسيمة وكود القسيمة مباشرة إلى ${recipientName} للاحتفال بهديتك.`
                  : `Send the voucher and voucher code directly to ${recipientName} to celebrate your gift.`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* WhatsApp Share CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareModal(false)}
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                }}
                className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>{isAr ? 'مشاركة فورية عبر واتساب (WhatsApp)' : 'Share Instantly via WhatsApp'}</span>
              </a>

              {/* SMS Share CTA */}
              <a
                href={smsUrl}
                onClick={() => setShowShareModal(false)}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                }}
                className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <DevicePhoneMobileIcon className="w-5 h-5" />
                <span>{isAr ? 'مشاركة عبر رسالة نصية (SMS)' : 'Share via SMS'}</span>
              </a>

              {/* Copy Preloaded SMS Message */}
              <button
                type="button"
                onClick={handleCopyMessage}
                style={{ backgroundColor: '#FFFFFF', borderColor: BORDER_COLOR }}
                className="w-full py-3 rounded-full border text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {copiedMessage ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">{isAr ? 'تم نسخ نص الرسالة الجاهزة بنجاح!' : 'SMS Message Copied Successfully!'}</span>
                  </>
                ) : (
                  <>
                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-stone-600" />
                    <span>{isAr ? 'نسخ نص الرسالة الجاهزة (SMS)' : 'Copy Preloaded SMS Message'}</span>
                  </>
                )}
              </button>

              {/* Copy Shareable Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                style={{ backgroundColor: '#FFFFFF', borderColor: BORDER_COLOR }}
                className="w-full py-3 rounded-full border text-xs sm:text-sm font-bold text-stone-800 flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">{isAr ? 'تم نسخ الرابط بنجاح!' : 'Link Copied Successfully!'}</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="w-4 h-4 text-stone-600" />
                    <span>{isAr ? 'نسخ رابط القسيمة' : 'Copy Voucher Link'}</span>
                  </>
                )}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer text-center"
              >
                {isAr ? 'المشاركة لاحقاً • إغلاق' : 'Share Later • Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

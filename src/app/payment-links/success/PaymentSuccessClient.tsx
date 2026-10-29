'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackPurchase } from '@/lib/fbpixel';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  HomeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  USH_PHONE_DISPLAY,
  USH_PHONE_E164,
  USH_PHONE_TEL_HREF,
  USH_EMAIL_DISPLAY,
} from '@/lib/contact';

export default function PaymentSuccessClient() {
  const { isAr, t } = useApp();
  const searchParams = useSearchParams();

  // Extract query parameters
  const paymentId =
    searchParams.get('paymentId') ||
    searchParams.get('Id') ||
    searchParams.get('payment_id') ||
    searchParams.get('id') ||
    '';

  const invoiceId =
    searchParams.get('invoiceId') ||
    searchParams.get('invoice_id') ||
    searchParams.get('InvoiceId') ||
    '';

  const invoiceNumber =
    searchParams.get('invoice_number') ||
    searchParams.get('inv') ||
    '';

  const bookingId =
    searchParams.get('booking_id') ||
    searchParams.get('target_id') ||
    '';

  const amount = searchParams.get('amount') || '';
  const currency = searchParams.get('currency') || 'KWD';
  const customMessage = searchParams.get('message') || '';

  useEffect(() => {
    trackPurchase({
      value: Number(amount),
      currency,
      transactionId: paymentId || invoiceId || invoiceNumber || bookingId,
      contentName: 'Payment Link',
    });
  }, [amount, currency, paymentId, invoiceId, invoiceNumber, bookingId]);

  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      setFormattedDate(
        now.toLocaleDateString(isAr ? 'ar-KW' : 'en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [isAr]);

  const handleCopyId = () => {
    if (!paymentId) return;
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappHref = `https://wa.me/${USH_PHONE_E164.replace('+', '')}?text=${encodeURIComponent(
    `Hello USH Spa, I have completed payment for reference: ${paymentId || 'N/A'}`
  )}`;

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#151210] text-spa-text dark:text-[#EBE5DE] antialiased flex flex-col justify-between transition-colors duration-300">
      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Decorative Ambient Ornaments */}
        <div className="absolute top-16 right-10 w-96 h-96 bg-spa-rose/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-spa-petal/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-emerald-100/15 via-spa-blush/30 to-amber-100/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Card Box */}
          <div
            className="bg-white/95 dark:bg-[#2A221E]/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#D3C0B1]/40 dark:border-white/10 transition-all duration-300"
            style={{
              boxShadow: '0 20px 50px rgba(84, 60, 48, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Top Brand Tag */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-spa-rose" />
              <span className="font-lustria text-xs uppercase tracking-[0.25em] font-semibold text-[#543C30] dark:text-[#D3C0B1]">
                {t('Quiet Ush Thai Spa', 'معهد كوايت أوش للسبا التايلاندي')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-spa-rose" />
            </div>

            {/* Success Icon Badge */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-50 to-emerald-100 border-2 border-emerald-200/80 flex items-center justify-center shadow-inner">
                  <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
                </div>
                <div className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping pointer-events-none opacity-20" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-6">
              <h1 className="font-lustria text-2xl sm:text-3xl font-bold text-spa-text dark:text-[#EBE5DE] tracking-tight mb-1">
                {t('Payment Successful', 'تم الدفع بنجاح')}
              </h1>
              <span className="block text-xs font-medium text-spa-cherry dark:text-spa-petal tracking-wide mb-3">
                {t('Your transaction has been processed', 'تم تأكيد وإتمام العملية بنجاح')}
              </span>
              <p className="text-spa-muted dark:text-[#D3C0B1]/80 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                {customMessage ||
                  t(
                    'Thank you for choosing USH Spa. Your payment has been received and verified.',
                    'شكراً لاختياركِ أوش سبا. تم استلام وتأكيد دفعتكِ بنجاح.'
                  )}
              </p>
            </div>

            {/* Transaction Details Box */}
            <div className="bg-[#fdf8f6] dark:bg-[#1E1917] rounded-2xl p-4 sm:p-5 border border-spa-petal/60 dark:border-white/10 space-y-3 mb-6">
              {/* Status Row */}
              <div className="flex items-center justify-between py-1 border-b border-spa-petal/30 dark:border-white/10 text-xs sm:text-sm">
                <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                  {t('Transaction Status', 'حالة العملية')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {t('Confirmed', 'مؤكد')}
                </span>
              </div>

              {/* Payment ID Row */}
              {paymentId && (
                <div className="flex items-center justify-between py-1 border-b border-spa-petal/30 dark:border-white/10 text-xs sm:text-sm">
                  <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                    {t('Payment Reference', 'رقم العملية المرجعي')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium text-spa-text dark:text-[#EBE5DE] text-xs sm:text-[13px] bg-white dark:bg-[#2A221E] px-2 py-0.5 rounded border border-spa-petal/40 dark:border-white/10">
                      {paymentId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      aria-label="Copy Payment Reference"
                      className="p-1 text-spa-muted dark:text-[#D3C0B1] hover:text-spa-cherry rounded hover:bg-spa-blush dark:hover:bg-white/10 transition-colors"
                      title={t('Copy Payment ID', 'نسخ رقم الدفع')}
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Invoice Number if available */}
              {(invoiceNumber || invoiceId) && (
                <div className="flex items-center justify-between py-1 border-b border-spa-petal/30 dark:border-white/10 text-xs sm:text-sm">
                  <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                    {t('Invoice No.', 'رقم الفاتورة')}
                  </span>
                  <span className="font-medium text-spa-text dark:text-[#EBE5DE]">
                    {invoiceNumber || invoiceId}
                  </span>
                </div>
              )}

              {/* Booking Reference if available */}
              {bookingId && (
                <div className="flex items-center justify-between py-1 border-b border-spa-petal/30 dark:border-white/10 text-xs sm:text-sm">
                  <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                    {t('Booking Reference', 'مرجع الحجز')}
                  </span>
                  <span className="font-mono text-xs font-medium text-spa-text dark:text-[#EBE5DE] truncate max-w-[180px]">
                    {bookingId}
                  </span>
                </div>
              )}

              {/* Amount if available */}
              {amount && (
                <div className="flex items-center justify-between py-1 border-b border-spa-petal/30 dark:border-white/10 text-xs sm:text-sm">
                  <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                    {t('Amount Paid', 'المبلغ المدفوع')}
                  </span>
                  <span className="font-bold text-spa-cherry dark:text-spa-petal text-sm sm:text-base">
                    {amount} {currency}
                  </span>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex items-center justify-between py-1 border-b border-spa-petal/30 dark:border-white/10 text-xs sm:text-sm">
                <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                  {t('Date & Time', 'التاريخ والوقت')}
                </span>
                <span className="text-spa-text dark:text-[#EBE5DE] font-medium text-xs sm:text-[13px]">
                  {formattedDate || t('Verified', 'تم التحقق')}
                </span>
              </div>

              {/* Security confirmation */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-spa-muted dark:text-[#D3C0B1]/70">
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  {t('Verified via MyFatoorah', 'تم التحقق عبر ماي فاتورة')}
                </span>
                <span>PCI-DSS Secured</span>
              </div>
            </div>

            {/* Concierge Info Callout */}
            <div className="rounded-xl bg-spa-blush/60 dark:bg-white/5 border border-spa-petal/40 dark:border-white/10 p-3.5 text-center mb-6">
              <p className="text-[11px] sm:text-xs text-spa-text/90 dark:text-[#EBE5DE]/90 leading-relaxed">
                {t(
                  'A confirmation has been recorded with our concierge. You will receive appointment details and receipt updates via SMS or WhatsApp shortly.',
                  'تم تسجيل التأكيد لدى خدمة العملاء والاستقبال. ستصلكِ تفاصيل الموعد وتحديثات الإيصال عبر الرسائل النصية أو واتساب قريباً.'
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#543C30] hover:bg-[#4E2712] text-white font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <HomeIcon className="w-4 h-4" />
                {t('Return to USH Spa Home', 'العودة للصفحة الرئيسية لأوش سبا')}
              </Link>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-spa-petal dark:border-white/10 hover:border-spa-cherry/40 bg-white dark:bg-[#1E1917] hover:bg-spa-blush dark:hover:bg-white/10 text-spa-text dark:text-[#EBE5DE] font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
                  {t('WhatsApp', 'واتساب')}
                </a>

                <a
                  href={USH_PHONE_TEL_HREF}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-spa-petal dark:border-white/10 hover:border-spa-cherry/40 bg-white dark:bg-[#1E1917] hover:bg-spa-blush dark:hover:bg-white/10 text-spa-text dark:text-[#EBE5DE] font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <PhoneIcon className="w-4 h-4 text-spa-cherry dark:text-spa-petal" />
                  {t('Call Us', 'اتصل بنا')}
                </a>
              </div>
            </div>

            {/* Footer Support Assistance */}
            <div className="text-center mt-6 pt-4 border-t border-spa-petal/40 dark:border-white/10 text-[11px] text-spa-muted dark:text-[#D3C0B1]/70">
              {t('Need assistance?', 'هل تحتاجين لمساعدة؟')} {t('Phone:', 'الهاتف:')} {USH_PHONE_DISPLAY} &bull; {t('Email:', 'البريد:')} {USH_EMAIL_DISPLAY}
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}


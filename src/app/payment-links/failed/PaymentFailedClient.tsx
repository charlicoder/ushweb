'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackPaymentFailed } from '@/lib/fbpixel';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import {
  XCircleIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  HomeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  USH_PHONE_DISPLAY,
  USH_PHONE_E164,
  USH_PHONE_TEL_HREF,
  USH_EMAIL_DISPLAY,
} from '@/lib/contact';

export default function PaymentFailedClient() {
  const { isAr, t } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query parameters
  const paymentId =
    searchParams.get('paymentId') ||
    searchParams.get('Id') ||
    searchParams.get('payment_id') ||
    searchParams.get('id') ||
    '';

  const rawError =
    searchParams.get('error') ||
    searchParams.get('message') ||
    searchParams.get('err') ||
    searchParams.get('msg') ||
    searchParams.get('Error') ||
    '';

  const invoiceNumber =
    searchParams.get('invoice_number') ||
    searchParams.get('invoiceId') ||
    searchParams.get('inv') ||
    '';

  useEffect(() => {
    trackPaymentFailed({ transactionId: paymentId || invoiceNumber, reason: rawError });
  }, [paymentId, invoiceNumber, rawError]);

  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      setFormattedDate(
        now.toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
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

  const handleTryAgain = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const whatsappHref = `https://wa.me/${USH_PHONE_E164.replace('+', '')}?text=${encodeURIComponent(
    isAr
      ? `مرحباً معهد أوش سبا، واجهت مشكلة في إتمام عملية الدفع${
          paymentId ? ` (رقم المرجع: ${paymentId})` : ''
        }. هل يمكنكم مساعدتي؟`
      : `Hello USH Spa Concierge, I encountered an issue completing my payment${
          paymentId ? ` (Ref: ${paymentId})` : ''
        }. Could you please assist me?`
  )}`;

  // Human-readable error message
  const displayError =
    rawError ||
    t(
      'The transaction could not be completed. It may have been cancelled, expired, or declined by the issuing card bank.',
      'تعذر إتمام المعاملة بنجاح. قد تكون العملية أُلغيت أو انتهت صلاحيتها أو تم رفضها من قبل البنك المصدر للبطاقة.'
    );

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#151210] text-spa-text dark:text-[#EBE5DE] antialiased flex flex-col justify-between transition-colors duration-300">
      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Decorative Ambient Ornaments */}
        <div className="absolute top-16 right-10 w-96 h-96 bg-rose-200/20 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-spa-cherry/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-rose-100/20 via-spa-blush/30 to-amber-100/15 dark:from-rose-950/10 dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />

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
              <span className="w-1.5 h-1.5 rounded-full bg-spa-cherry" />
              <span className="font-lustria text-xs uppercase tracking-[0.25em] font-semibold text-[#543C30] dark:text-[#D3C0B1]">
                {t('Quiet Ush Thai Spa', 'معهد كوايت أوش للسبا التايلاندي')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-spa-cherry" />
            </div>

            {/* Failed Icon Badge */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/40 border-2 border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center shadow-inner">
                  <XCircleIcon className="w-12 h-12 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="absolute inset-0 rounded-full border border-rose-400/30 animate-pulse pointer-events-none opacity-20" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-6">
              <h1 className="font-lustria text-2xl sm:text-3xl font-bold text-spa-text dark:text-[#EBE5DE] tracking-tight mb-1">
                {t('Payment Failed', 'تعذر إتمام الدفع')}
              </h1>
              <span className="block text-xs font-medium text-rose-700 dark:text-rose-400 tracking-wide mb-3">
                {t('Transaction could not be completed', 'لم يتم خصم أي مبالغ من بطاقتك')}
              </span>
              <p className="text-spa-muted dark:text-[#D3C0B1]/80 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                {t(
                  'We were unable to complete your transaction. No funds were debited from your card.',
                  'تعذر إتمام العملية في الوقت الحالي. نؤكد لكِ أنه لم يتم خصم أي مبالغ مالية من حسابك.'
                )}
              </p>
            </div>

            {/* Error Details Box */}
            <div className="bg-[#fff7f6] dark:bg-[#1E1917] rounded-2xl p-4 sm:p-5 border border-rose-200/60 dark:border-white/10 space-y-3 mb-6">
              {/* Status Row */}
              <div className="flex items-center justify-between py-1 border-b border-rose-200/40 dark:border-white/10 text-xs sm:text-sm">
                <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                  {t('Transaction Status', 'حالة العملية')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
                  {t('Unsuccessful', 'غير مكتمل')}
                </span>
              </div>

              {/* Reason Row */}
              <div className="py-1 border-b border-rose-200/40 dark:border-white/10 text-xs sm:text-sm">
                <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal block mb-1">
                  {t('Reason / Note', 'السبب / الملاحظة')}
                </span>
                <div className="flex items-start gap-2 bg-white/80 dark:bg-[#251E1A] p-2.5 rounded-lg border border-rose-200/50 dark:border-white/10">
                  <ExclamationTriangleIcon className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-900 dark:text-rose-200 leading-snug break-words">
                    {displayError}
                  </p>
                </div>
              </div>

              {/* Payment ID Row if available */}
              {paymentId && (
                <div className="flex items-center justify-between py-1 border-b border-rose-200/40 dark:border-white/10 text-xs sm:text-sm">
                  <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                    {t('Payment Reference', 'مرجع الدفع')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium text-spa-text dark:text-[#EBE5DE] text-xs sm:text-[13px] bg-white dark:bg-[#251E1A] px-2 py-0.5 rounded border border-rose-200/60 dark:border-white/10">
                      {paymentId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      aria-label="Copy Payment Reference"
                      className="p-1 text-spa-muted hover:text-spa-cherry rounded hover:bg-rose-100/50 dark:hover:bg-white/10 transition-colors"
                      title={t('Copy Reference ID', 'نسخ رقم المرجع')}
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
              {invoiceNumber && (
                <div className="flex items-center justify-between py-1 border-b border-rose-200/40 dark:border-white/10 text-xs sm:text-sm">
                  <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                    {t('Invoice No.', 'رقم الفاتورة')}
                  </span>
                  <span className="font-medium text-spa-text dark:text-[#EBE5DE]">
                    {invoiceNumber}
                  </span>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                <span className="text-spa-muted dark:text-[#D3C0B1]/75 font-normal">
                  {t('Attempted At', 'وقت المحاولة')}
                </span>
                <span className="text-spa-text dark:text-[#EBE5DE] font-medium text-xs sm:text-[13px]">
                  {formattedDate || t('Recent', 'حديثاً')}
                </span>
              </div>
            </div>

            {/* Helpful Troubleshooting Steps */}
            <div className="rounded-xl bg-[#faf7f5] dark:bg-[#1E1917] border border-spa-petal/40 dark:border-white/10 p-4 mb-6">
              <span className="block font-semibold text-xs text-[#543C30] dark:text-[#D3C0B1] mb-2">
                {t('Suggested Next Steps:', 'الحلول والخطوات المقترحة:')}
              </span>
              <ul className="text-[11px] sm:text-xs text-spa-text/80 dark:text-[#D3C0B1]/80 space-y-1.5 list-disc list-inside">
                <li>
                  {t(
                    'Verify your card balance and online purchasing limit.',
                    'التأكد من توفر الرصيد الكافي وحد الشراء عبر الإنترنت في البطاقة.'
                  )}
                </li>
                <li>
                  {t(
                    'Ensure the OTP (One-Time Password) from your bank is entered accurately.',
                    'التأكد من إدخال رمز التحقق (OTP) المرسل من البنك بدقة.'
                  )}
                </li>
                <li>
                  {t(
                    'Try another payment card (KNET debit or Visa/MasterCard).',
                    'تجربة بطاقة دفع أخرى (كي نت أو فيزا / ماستركارد).'
                  )}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleTryAgain}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#543C30] hover:bg-[#4E2712] text-white font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <ArrowPathIcon className="w-4 h-4" />
                {t('Try Payment Again', 'إعادة محاولة الدفع')}
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-spa-petal hover:border-spa-cherry/40 dark:border-white/10 bg-white dark:bg-[#251E1A] hover:bg-spa-blush dark:hover:bg-white/10 text-spa-text dark:text-[#EBE5DE] font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
                  {t('WhatsApp Concierge', 'واتساب خدمة العملاء')}
                </a>

                <a
                  href={USH_PHONE_TEL_HREF}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-spa-petal hover:border-spa-cherry/40 dark:border-white/10 bg-white dark:bg-[#251E1A] hover:bg-spa-blush dark:hover:bg-white/10 text-spa-text dark:text-[#EBE5DE] font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <PhoneIcon className="w-4 h-4 text-spa-cherry dark:text-spa-rose" />
                  {t('Call Concierge', 'الاتصال مباشرة')}
                </a>
              </div>

              <div className="text-center pt-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-spa-muted dark:text-[#D3C0B1]/70 hover:text-[#543C30] dark:hover:text-white transition-colors"
                >
                  <HomeIcon className="w-3.5 h-3.5" />
                  {t('Return to USH Spa Home', 'العودة للصفحة الرئيسية')}
                </Link>
              </div>
            </div>

            {/* Footer Support Assistance */}
            <div className="text-center mt-6 pt-4 border-t border-spa-petal/40 dark:border-white/10 text-[11px] text-spa-muted dark:text-[#D3C0B1]/60">
              {t(
                'Quiet Ush Thai Spa Health Institute for Women',
                'معهد كوايت أوش للسبا الصحي التايلاندي للنساء'
              )}{' '}
              &bull; {USH_PHONE_DISPLAY} &bull; {USH_EMAIL_DISPLAY}
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

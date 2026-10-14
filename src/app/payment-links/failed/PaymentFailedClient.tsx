'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

  const [copied, setCopied] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      setFormattedDate(
        now.toLocaleDateString('en-GB', {
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
  }, []);

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
    `Hello USH Spa Concierge, I encountered an issue completing my payment${
      paymentId ? ` (Ref: ${paymentId})` : ''
    }. Could you please assist me?`
  )}`;

  // Human-readable error message
  const displayError =
    rawError ||
    'The transaction could not be completed. It may have been cancelled, expired, or declined by the issuing card bank.';

  return (
    <div className="min-h-screen bg-[#faf7f5] text-spa-text antialiased flex flex-col justify-between">
      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Decorative Ambient Ornaments */}
        <div className="absolute top-16 right-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-spa-cherry/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-rose-100/20 via-spa-blush/30 to-amber-100/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Card Box */}
          <div
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#D3C0B1]/40 transition-all duration-300"
            style={{
              boxShadow: '0 20px 50px rgba(84, 60, 48, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Top Brand Tag */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-spa-cherry" />
              <span className="font-lustria text-xs uppercase tracking-[0.25em] font-semibold text-[#543C30]">
                Quiet Ush Thai Spa
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-spa-cherry" />
            </div>

            {/* Failed Icon Badge */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-50 to-rose-100 border-2 border-rose-200/80 flex items-center justify-center shadow-inner">
                  <XCircleIcon className="w-12 h-12 text-rose-600" />
                </div>
                <div className="absolute inset-0 rounded-full border border-rose-400/30 animate-pulse pointer-events-none opacity-20" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-6">
              <h1 className="font-lustria text-2xl sm:text-3xl font-bold text-spa-text tracking-tight mb-1">
                Payment Failed
              </h1>
              <span className="block text-xs font-medium text-rose-700 tracking-wide mb-3">
                تعذر إتمام عملية الدفع
              </span>
              <p className="text-spa-muted text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                We were unable to complete your transaction. No funds were debited from your card.
              </p>
            </div>

            {/* Error Details Box */}
            <div className="bg-[#fff7f6] rounded-2xl p-4 sm:p-5 border border-rose-200/60 space-y-3 mb-6">
              {/* Status Row */}
              <div className="flex items-center justify-between py-1 border-b border-rose-200/40 text-xs sm:text-sm">
                <span className="text-spa-muted font-normal">Transaction Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  Unsuccessful / غير مكتمل
                </span>
              </div>

              {/* Reason Row */}
              <div className="py-1 border-b border-rose-200/40 text-xs sm:text-sm">
                <span className="text-spa-muted font-normal block mb-1">Reason / الملاحظة</span>
                <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-200/50">
                  <ExclamationTriangleIcon className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-900 leading-snug break-words">
                    {displayError}
                  </p>
                </div>
              </div>

              {/* Payment ID Row if available */}
              {paymentId && (
                <div className="flex items-center justify-between py-1 border-b border-rose-200/40 text-xs sm:text-sm">
                  <span className="text-spa-muted font-normal">Payment Reference</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium text-spa-text text-xs sm:text-[13px] bg-white px-2 py-0.5 rounded border border-rose-200/60">
                      {paymentId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      aria-label="Copy Payment Reference"
                      className="p-1 text-spa-muted hover:text-spa-cherry rounded hover:bg-rose-100/50 transition-colors"
                      title="Copy Reference ID"
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
                <div className="flex items-center justify-between py-1 border-b border-rose-200/40 text-xs sm:text-sm">
                  <span className="text-spa-muted font-normal">Invoice No.</span>
                  <span className="font-medium text-spa-text">
                    {invoiceNumber}
                  </span>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                <span className="text-spa-muted font-normal">Attempted At</span>
                <span className="text-spa-text font-medium text-xs sm:text-[13px]">
                  {formattedDate || 'Recent'}
                </span>
              </div>
            </div>

            {/* Helpful Troubleshooting Steps */}
            <div className="rounded-xl bg-[#faf7f5] border border-spa-petal/40 p-4 mb-6">
              <span className="block font-semibold text-xs text-[#543C30] mb-2">
                Suggested Next Steps / الحلول المقترحة:
              </span>
              <ul className="text-[11px] sm:text-xs text-spa-text/80 space-y-1.5 list-disc list-inside">
                <li>Verify your card balance and online purchasing limit.</li>
                <li>Ensure the OTP (One-Time Password) from your bank is entered accurately.</li>
                <li>Try another payment card (KNET debit or Visa/MasterCard).</li>
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
                Try Payment Again
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-spa-petal hover:border-spa-cherry/40 bg-white hover:bg-spa-blush text-spa-text font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
                  WhatsApp Concierge
                </a>

                <a
                  href={USH_PHONE_TEL_HREF}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-spa-petal hover:border-spa-cherry/40 bg-white hover:bg-spa-blush text-spa-text font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <PhoneIcon className="w-4 h-4 text-spa-cherry" />
                  Call Concierge
                </a>
              </div>

              <div className="text-center pt-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-spa-muted hover:text-[#543C30] transition-colors"
                >
                  <HomeIcon className="w-3.5 h-3.5" />
                  Return to USH Spa Home
                </Link>
              </div>
            </div>

            {/* Footer Support Assistance */}
            <div className="text-center mt-6 pt-4 border-t border-spa-petal/40 text-[11px] text-spa-muted">
              Quiet Ush Thai Spa Health Institute for Women &bull; Phone: {USH_PHONE_DISPLAY} &bull; Email: {USH_EMAIL_DISPLAY}
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

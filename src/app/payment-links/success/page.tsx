import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import PaymentSuccessClient from './PaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Payment Successful | Quiet Ush Thai Spa Health Institute for Women (USH Spa)',
  description:
    'Your payment has been successfully received and verified by Quiet Ush Thai Spa Health Institute for Women.',
  robots: {
    index: false,
    follow: false,
  },
};

function PaymentSuccessFallback() {
  return (
    <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/95 rounded-3xl p-10 border border-[#D3C0B1]/40 shadow-md text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-emerald-300" />
        </div>
        <h2 className="font-lustria text-xl font-bold text-spa-text mb-2">
          Verifying Payment...
        </h2>
        <p className="text-spa-muted text-sm">
          Please wait while we load your transaction receipt.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessClient />
    </Suspense>
  );
}

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import PaymentFailedClient from './PaymentFailedClient';

export const metadata: Metadata = {
  title: 'Payment Failed | Quiet Ush Thai Spa Health Institute for Women (USH Spa)',
  description:
    'Payment could not be completed for Quiet Ush Thai Spa Health Institute for Women.',
  robots: {
    index: false,
    follow: false,
  },
};

function PaymentFailedFallback() {
  return (
    <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/95 rounded-3xl p-10 border border-[#D3C0B1]/40 shadow-md text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-rose-300" />
        </div>
        <h2 className="font-lustria text-xl font-bold text-spa-text mb-2">
          Loading Payment Status...
        </h2>
        <p className="text-spa-muted text-sm">
          Please wait while we load transaction details.
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<PaymentFailedFallback />}>
      <PaymentFailedClient />
    </Suspense>
  );
}

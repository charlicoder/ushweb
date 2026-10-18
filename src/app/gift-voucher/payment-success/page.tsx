import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import GiftVoucherPaymentSuccessClient from './GiftVoucherPaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Gift Voucher Payment Confirmed | USH Spa',
  description:
    'Your USH Spa Gift Voucher payment has been verified and your luxury voucher is now active.',
  robots: {
    index: false,
    follow: false,
  },
};

function Fallback() {
  return (
    <div className="min-h-screen bg-[#EAE5DF] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF5EE] rounded-3xl p-8 border border-[#543C30]/20 shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto animate-pulse">
          <div className="w-8 h-8 rounded-full bg-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-[#543C30]">
          Verifying Gift Voucher Payment...
        </h2>
        <p className="text-[#8A6D5F] text-xs">
          Please wait while we activate your voucher and load your receipt.
        </p>
      </div>
    </div>
  );
}

export default function GiftVoucherPaymentSuccessPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <GiftVoucherPaymentSuccessClient />
    </Suspense>
  );
}

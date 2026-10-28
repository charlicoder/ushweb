import React from 'react';
import type { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const metadata: Metadata = {
  title: 'Share Your Experience | Quiet Ush Thai Spa Health Institute for Women (USH Spa)',
  description: 'Tell us about your visit to USH Spa — your feedback helps us make every visit special.',
  robots: { index: false, follow: false },
};

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ public_token: string }>;
}) {
  const { public_token } = await params;
  return <FeedbackClient token={public_token} />;
}


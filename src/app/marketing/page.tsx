import type { Metadata } from 'next';
import MarketingClient from './MarketingClient';

export const metadata: Metadata = {
  title: 'Marketing Details | USH Spa',
  description:
    'Learn about USH Spa promotional offers, loyalty rewards tiers, referral program, gift cards, and communication preferences.',
  alternates: {
    canonical: 'https://ushspa.co/marketing',
  },
  openGraph: {
    title: 'Marketing Details - USH Spa',
    description:
      'Learn about USH Spa promotional offers, loyalty rewards, referral programs, and marketing communication policies.',
    url: 'https://ushspa.co/marketing',
    siteName: 'USH Spa',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketing Details | USH Spa',
    description:
      'Learn about USH Spa promotional offers, loyalty rewards, referral programs, and communication policies.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingPage() {
  return <MarketingClient />;
}

import type { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | USH Spa Mobile App',
  description:
    'Official Privacy Policy for the USH Spa mobile application (iOS & Android). Understand how we collect, process, and protect your appointment bookings, personal data, and account deletion options.',
  alternates: {
    canonical: 'https://ushspa.co/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy - USH Spa Mobile Application',
    description:
      'Official Privacy Policy for the USH Spa mobile app. Learn how we protect your personal data, secure appointments, and manage account deletion.',
    url: 'https://ushspa.co/privacy-policy',
    siteName: 'USH Spa',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | USH Spa Mobile App',
    description:
      'Learn how USH Spa protects your appointment bookings and personal data across iOS and Android apps.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}

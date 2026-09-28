import type { Metadata } from 'next';
import DeleteRequestClient from './DeleteRequestClient';

export const metadata: Metadata = {
  title: 'Request Account Deletion | USH Spa Mobile App',
  description:
    'Official page to request permanent deletion of your USH Spa mobile app account and associated personal data. Review deletion steps, data retention policies, and submit your request.',
  alternates: {
    canonical: 'https://ushspa.co/customers/delete-request/',
  },
  openGraph: {
    title: 'Request Account & Data Deletion - USH Spa Mobile App',
    description:
      'Official portal for USH Spa mobile app users to request account deletion and data erasure. Compliant with Google Play Store User Data guidelines.',
    url: 'https://ushspa.co/customers/delete-request/',
    siteName: 'USH Spa',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request Account Deletion | USH Spa',
    description:
      'Submit a request to delete your USH Spa mobile app account and associated personal records.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DeleteRequestPage() {
  return <DeleteRequestClient />;
}

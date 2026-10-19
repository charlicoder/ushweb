import React from 'react';
import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Our Services | Quiet Ush Thai Spa Health Institute for Women (USH Spa)',
  description:
    'Discover our signature spa treatments, authentic Thai massages, royal Moroccan baths, and rejuvenating facials at Quiet Ush Thai Spa Health Institute for Women in Kuwait.',
  openGraph: {
    title: 'Our Services | Quiet Ush Thai Spa Health Institute for Women',
    description:
      'Explore luxury wellness services, therapeutic Thai massage, and private suite spa packages at USH Spa Kuwait.',
    url: 'https://ushspa.co/services',
    siteName: 'Quiet Ush Thai Spa Health Institute for Women',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}

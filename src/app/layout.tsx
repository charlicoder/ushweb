import { USH_PHONE_DISPLAY, USH_EMAIL_DISPLAY } from '@/lib/contact';
import React from 'react';
import type { Metadata, Viewport } from 'next';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Quiet Ush Thai Spa Health Institute for Women | USH Spa',
  description: 'Quiet Ush Thai Spa Health Institute for Women (operating as USH Spa) offers premier wellness treatments, authentic Thai massages, skincare, and beauty therapy in Kuwait.',
  keywords: [
    'Quiet Ush Thai Spa Health Institute for Women',
    'USH Spa',
    'Thai Spa Kuwait',
    'Women Spa Kuwait',
    'Massage Therapy Sharq',
    'Kuwait Wellness Center',
  ],
  openGraph: {
    title: 'Quiet Ush Thai Spa Health Institute for Women | USH Spa',
    description: 'Premier destination for luxury spa treatments, authentic Thai wellness therapies, and transformative beauty experiences.',
    siteName: 'Quiet Ush Thai Spa Health Institute for Women',
    url: 'https://ushspa.co',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Quiet Ush Thai Spa Health Institute for Women',
  legalName: 'Quiet Ush Thai Spa Health Institute for Women',
  alternateName: 'USH Spa',
  url: 'https://ushspa.co',
  telephone: USH_PHONE_DISPLAY,
  email: USH_EMAIL_DISPLAY,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Al-Shuhada Street, Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman',
    addressLocality: 'Kuwait city, Sharq',
    postalCode: '15300',
    addressCountry: 'KW',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '22:00',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fushspa8296back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}

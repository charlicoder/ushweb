import { USH_PHONE_DISPLAY, USH_EMAIL_DISPLAY } from '@/lib/contact';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from '@/context/AppContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-TCEYFNDWNQ';

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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1894803201693914');
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel Code */}
      </head>
      <body suppressHydrationWarning>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://www.facebook.com/tr?id=1894803201693914&ev=PageView&noscript=1"
          />
        </noscript>
        <AppProvider>
          {children}
        </AppProvider>

        {/* Google tag (gtag.js) */}
        <Script
          id="ga-gtag-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script id="ga-gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fushspa8296back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}

import { USH_PHONE_DISPLAY, USH_BUSINESS_PHONE_DISPLAY, USH_EMAIL_DISPLAY, USH_ADDRESS } from '@/lib/contact';
import React from 'react';
import type { Metadata } from 'next';
import ContactUsClient from './ContactUsClient';

export const metadata: Metadata = {
  title: 'Contact Us | Quiet Ush Thai Spa Health Institute for Women (USH Spa)',
  description:
    `Contact Quiet Ush Thai Spa Health Institute for Women (USH Spa) located at ${USH_ADDRESS.buildingEn}, ${USH_ADDRESS.streetEn}, Block ${USH_ADDRESS.block}, Plot ${USH_ADDRESS.plot}, ${USH_ADDRESS.areaEn}, ${USH_ADDRESS.governorateEn}, Kuwait (${USH_ADDRESS.unitsEn}). Call Center: ${USH_PHONE_DISPLAY}, Business Contact: ${USH_BUSINESS_PHONE_DISPLAY}, Email: ${USH_EMAIL_DISPLAY}.`,
  openGraph: {
    title: 'Contact Us | Quiet Ush Thai Spa Health Institute for Women',
    description:
      'Official contact details, location, phone number, and booking inquiries for Quiet Ush Thai Spa Health Institute for Women (USH Spa) in Kuwait.',
    url: 'https://ushspa.co/contact-us',
    siteName: 'Quiet Ush Thai Spa Health Institute for Women',
  },
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}

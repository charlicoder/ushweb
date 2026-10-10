import { USH_PHONE_DISPLAY, USH_EMAIL_DISPLAY } from '@/lib/contact';
import React from 'react';
import type { Metadata } from 'next';
import ContactUsClient from './ContactUsClient';

export const metadata: Metadata = {
  title: 'Contact Us | Quiet Ush Thai Spa Health Institute for Women (USH Spa)',
  description:
    `Contact Quiet Ush Thai Spa Health Institute for Women (USH Spa) located at Al-Shuhada Street, Block 04, Building 32, Nasser Ahmed Abdul Latif Al-Othman, Sharq, Kuwait City. Phone: ${USH_PHONE_DISPLAY}, Email: ${USH_EMAIL_DISPLAY}.`,
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

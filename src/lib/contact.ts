/**
 * Official USH Spa contact configuration.
 * Reads from environment variables (NEXT_PUBLIC_CONTACT_PHONE, CONTACT_PHONE,
 * NEXT_PUBLIC_CONTACT_EMAIL, CONTACT_EMAIL) with robust defaults.
 */
const rawPhone =
  process.env.NEXT_PUBLIC_CONTACT_PHONE ||
  process.env.CONTACT_PHONE ||
  "+965 900103335";

export const USH_PHONE_DISPLAY = rawPhone.trim();
export const USH_PHONE_E164 = USH_PHONE_DISPLAY.replace(/[^\d+]/g, "");
export const USH_PHONE_TEL_HREF = `tel:${USH_PHONE_E164}`;

const rawEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
  process.env.CONTACT_EMAIL ||
  "info@ushspa.co";

export const USH_EMAIL_DISPLAY = rawEmail.trim();
export const USH_EMAIL_MAILTO_HREF = `mailto:${USH_EMAIL_DISPLAY}`;

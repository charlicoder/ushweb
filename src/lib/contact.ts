/**
 * Official USH Spa contact configuration.
 * Reads from environment variables (NEXT_PUBLIC_CONTACT_PHONE, CONTACT_PHONE,
 * NEXT_PUBLIC_CONTACT_EMAIL, CONTACT_EMAIL, NEXT_PUBLIC_BUSINESS_PHONE, BUSINESS_PHONE)
 * with robust defaults.
 */

// ── Customer Support & Call Center ──────────────────────────────────────────
const rawPhone =
  process.env.NEXT_PUBLIC_CONTACT_PHONE ||
  process.env.CONTACT_PHONE ||
  "+965 900103335";

export const USH_PHONE_DISPLAY = rawPhone.trim();
export const USH_PHONE_E164 = USH_PHONE_DISPLAY.replace(/[^\d+]/g, "");
export const USH_PHONE_TEL_HREF = `tel:${USH_PHONE_E164}`;
export const USH_WHATSAPP_HREF = `https://wa.me/${USH_PHONE_E164.replace(/^\+/, '')}`;

export const USH_SUPPORT_PHONE_DISPLAY = USH_PHONE_DISPLAY;
export const USH_SUPPORT_PHONE_E164 = USH_PHONE_E164;
export const USH_SUPPORT_PHONE_TEL_HREF = USH_PHONE_TEL_HREF;
export const USH_SUPPORT_WHATSAPP_HREF = USH_WHATSAPP_HREF;

// ── Owner / Business Contact ────────────────────────────────────────────────
const rawBusinessPhone =
  process.env.NEXT_PUBLIC_BUSINESS_PHONE ||
  process.env.BUSINESS_PHONE ||
  "+965 55555564";

export const USH_BUSINESS_PHONE_DISPLAY = rawBusinessPhone.trim();
export const USH_BUSINESS_PHONE_E164 = USH_BUSINESS_PHONE_DISPLAY.replace(/[^\d+]/g, "");
export const USH_BUSINESS_PHONE_TEL_HREF = `tel:${USH_BUSINESS_PHONE_E164}`;
export const USH_BUSINESS_WHATSAPP_HREF = `https://wa.me/${USH_BUSINESS_PHONE_E164.replace(/^\+/, '')}`;

// ── Email ───────────────────────────────────────────────────────────────────
const rawEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
  process.env.CONTACT_EMAIL ||
  "info@ushspa.co";

export const USH_EMAIL_DISPLAY = rawEmail.trim();
export const USH_EMAIL_MAILTO_HREF = `mailto:${USH_EMAIL_DISPLAY}`;

/**
 * Official Registered Address Information:
 * The business is registered across 5 units at the following location:
 * Governorate: Al-Ahmadi (الأحمدي)
 * Area / District: Al-Mangaf (المنقف)
 * Block: 004
 * Plot / Parcel: 001604
 * Street: Nayef Hamad Al-Dabbous Street (شارع نايف حمد الدبوس)
 * Building Name: Al-Habdan General Trading & Contracting Company Building (شركة الهبدان للتجارة العامة والمقاولات)
 * Total Units: 5 Apartments / Flats on the 1st Floor (Floor 01)
 */
export const USH_ADDRESS = {
  governorateEn: 'Al-Ahmadi',
  governorateAr: 'الأحمدي',
  areaEn: 'Al-Mangaf',
  areaAr: 'المنقف',
  block: '004',
  plot: '001604',
  streetEn: 'Nayef Hamad Al-Dabbous Street',
  streetAr: 'شارع نايف حمد الدبوس',
  buildingEn: 'Al-Habdan General Trading & Contracting Company Building',
  buildingAr: 'شركة الهبدان للتجارة العامة والمقاولات',
  unitsEn: '5 Apartments / Flats on the 1st Floor (Floor 01)',
  unitsAr: '5 شقق / وحدات في الدور الأول (الدور 01)',
  countryEn: 'State of Kuwait',
  countryAr: 'دولة الكويت',
  mapsUrl: 'https://maps.google.com/?q=Nayef+Hamad+Al-Dabbous+Street,+Al-Mangaf,+Kuwait',
};

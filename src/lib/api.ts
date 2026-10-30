/**
 * API configuration and helpers for ushweb.
 * Reads BASE_API / NEXT_PUBLIC_BASE_API from .env with fallbacks.
 */

export function getBaseApiUrl(): string {
  const url = (
    process.env.BASE_API ||
    process.env.NEXT_PUBLIC_BASE_API ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.BASE_TRACE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
    'http://127.0.0.1:8000'
  )
    .trim()
    .replace(/\/+$/, '');

  return url;
}

export function getUshToken(): string {
  return (
    process.env.USH_TOKEN ||
    process.env.NEXT_PUBLIC_USH_TOKEN ||
    process.env.API_APP_TOKEN ||
    'hello-world'
  ).trim();
}

/**
 * Sanitizes customer name strictly for MyFatoorah gateway.
 * MyFatoorah rejects:
 * - Numbers (0-9)
 * - Punctuation and symbols (., -, ', :, /, @, #, $, %, &, *, _, etc.)
 * - Emojis and pictographs
 * - Arabic tatweel / kashida (ـ) and diacritics
 * It strictly accepts only alphabetical letters (Arabic and Latin) and spaces.
 */
export function sanitizeCustomerName(name: unknown, fallback = 'Valued Guest'): string {
  if (typeof name !== 'string') {
    return fallback;
  }
  const cleaned = name
    // Strip Arabic tatweel (ـ) and diacritics / tashkeel
    .replace(/[\u0640\u064B-\u065F\u0670]/g, '')
    // Replace all non-letter characters (including numbers, dots, hyphens, colons, emojis, etc.) with space
    .replace(/[^\p{L}\s]/gu, ' ')
    // Collapse multiple whitespace characters into a single space
    .replace(/\s+/g, ' ')
    .trim();

  // If there are no letters left or length is < 2, fallback to a safe valid name
  if (!cleaned || cleaned.length < 2 || !/\p{L}/u.test(cleaned)) {
    return fallback;
  }

  // MyFatoorah max length for CustomerName is 50
  return cleaned.slice(0, 50);
}

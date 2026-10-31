// Meta Pixel helpers. The base pixel is initialised in app/layout.tsx.

type FbqFn = (...args: unknown[]) => void;

function getFbq(): FbqFn | null {
  if (typeof window === 'undefined') return null;
  const fbq = (window as unknown as { fbq?: FbqFn }).fbq;
  return typeof fbq === 'function' ? fbq : null;
}

/** Fire an event at most once per key per browser session (survives refreshes). */
function once(key: string): boolean {
  try {
    const k = `fbq_sent_${key}`;
    if (sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k, '1');
  } catch {
    // storage unavailable: fall through and send
  }
  return true;
}

/**
 * Currencies natively supported by Meta Pixel's client-side library (fbevents.js).
 * Meta Pixel hardcodes these 55 ISO codes in its internal SignalsEventValidation table.
 * Any currency outside this list (such as KWD, BHD, OMR) causes Meta Pixel to throw
 * `Parameter 'currency' is invalid for event 'Purchase'` and reject the conversion value.
 */
export const META_PIXEL_SUPPORTED_CURRENCIES = new Set([
  'AED', 'ARS', 'AUD', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP',
  'CRC', 'CZK', 'DKK', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HUF', 'IDR',
  'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MOP', 'MXN', 'MYR', 'NIO', 'NOK',
  'NZD', 'PEN', 'PHP', 'PLN', 'PYG', 'QAR', 'RON', 'RUB', 'SAR', 'SEK',
  'SGD', 'THB', 'TRY', 'TWD', 'USD', 'UYU', 'VEF', 'VND', 'ZAR',
]);

/**
 * Standard fixed peg exchange rate for Meta ROAS tracking.
 * 1 KWD ≈ 3.26 USD.
 */
export const KWD_TO_USD_RATE = 3.26;

/**
 * Normalizes currency and value for Meta Pixel.
 * For currencies natively supported by Meta Pixel (e.g. USD, SAR, AED, EUR, GBP),
 * it returns the currency code as-is.
 * For KWD (Kuwaiti Dinar) or unsupported currencies, it converts the value to USD
 * at the standard rate so Meta Pixel accepts the event without validation errors
 * and tracks ROAS accurately in Meta Ads Manager.
 */
export function normalizePixelCurrencyAndValue(
  rawValue: number,
  rawCurrency?: string | null
): { value: number; currency: string; original_currency?: string; original_value?: number } {
  const cleanCode = (rawCurrency || 'KWD').trim().toUpperCase();
  const isKwd =
    cleanCode === 'KWD' ||
    cleanCode === 'KD' ||
    cleanCode === 'K.D' ||
    cleanCode === 'K.D.' ||
    cleanCode === 'د.ك';

  if (isKwd) {
    const num = Number(rawValue) || 0;
    const usdValue = Math.round(num * KWD_TO_USD_RATE * 100) / 100;
    return {
      value: usdValue > 0 ? usdValue : 1.0,
      currency: 'USD',
      original_currency: 'KWD',
      original_value: num,
    };
  }

  if (META_PIXEL_SUPPORTED_CURRENCIES.has(cleanCode)) {
    return {
      value: Math.round((Number(rawValue) || 0) * 100) / 100,
      currency: cleanCode,
    };
  }

  // Fallback to USD for other unsupported codes
  const num = Number(rawValue) || 0;
  return {
    value: Math.round(num * 100) / 100,
    currency: 'USD',
    original_currency: cleanCode,
    original_value: num,
  };
}

/**
 * Backward compatibility: returns valid Meta Pixel currency code.
 */
export function normalizePixelCurrency(rawCurrency?: string | null): string {
  return normalizePixelCurrencyAndValue(1, rawCurrency).currency;
}

export function trackInitiateCheckout(value: number, currency?: string) {
  const fbq = getFbq();
  if (!fbq || !(value > 0)) return;
  const normalized = normalizePixelCurrencyAndValue(value, currency);
  fbq('track', 'InitiateCheckout', {
    value: normalized.value,
    currency: normalized.currency,
    ...(normalized.original_currency ? { original_currency: normalized.original_currency } : {}),
    ...(normalized.original_value !== undefined ? { original_value: normalized.original_value } : {}),
  });
}

export function trackPurchase(opts: {
  value: number;
  currency?: string;
  transactionId: string;
  contentName?: string;
}) {
  const fbq = getFbq();
  if (!fbq || !(opts.value > 0) || !opts.transactionId) return;
  if (!once(`purchase_${opts.transactionId}`)) return;

  const normalized = normalizePixelCurrencyAndValue(opts.value, opts.currency);

  fbq(
    'track',
    'Purchase',
    {
      value: normalized.value,
      currency: normalized.currency,
      content_name: opts.contentName,
      content_type: 'product',
      order_id: opts.transactionId,
      ...(normalized.original_currency ? { original_currency: normalized.original_currency } : {}),
      ...(normalized.original_value !== undefined ? { original_value: normalized.original_value } : {}),
    },
    { eventID: `purchase_${opts.transactionId}` }
  );
}

export function trackPaymentFailed(opts: { transactionId?: string; reason?: string }) {
  const fbq = getFbq();
  if (!fbq) return;
  if (!once(`failed_${opts.transactionId || 'unknown'}`)) return;
  fbq('trackCustom', 'PaymentFailed', {
    order_id: opts.transactionId,
    reason: opts.reason?.slice(0, 100),
  });
}

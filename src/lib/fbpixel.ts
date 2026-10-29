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

export function trackInitiateCheckout(value: number, currency: string) {
  const fbq = getFbq();
  if (!fbq || !(value > 0)) return;
  fbq('track', 'InitiateCheckout', { value, currency: currency || 'KWD' });
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
  fbq(
    'track',
    'Purchase',
    {
      value: opts.value,
      currency: opts.currency || 'KWD',
      content_name: opts.contentName,
      content_type: 'product',
      order_id: opts.transactionId,
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

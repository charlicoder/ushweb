/**
 * src/lib/notifications.ts
 * ────────────────────────
 * Server-side notification utilities for ushweb.
 * Dispatches alerts to managers (e.g. physical gift voucher product orders).
 */

import { getBaseApiUrl, getUshToken } from './api';

// Track already notified voucher IDs to avoid duplicate SMS on page refresh / re-render
const notifiedVoucherIds = new Set<string>();

export interface PhysicalVoucherItem {
  item_type?: string;
  name?: string;
  name_en?: string;
  name_ar?: string;
  price?: string | number;
  quantity?: number;
  [key: string]: unknown;
}

export interface VoucherNotificationData {
  id?: string;
  voucher_id?: string;
  voucher_number?: string;
  order_number?: string;
  gift_category?: string;
  status?: string;
  total_amount?: string | number;
  currency?: string;
  gift_from?: string;
  sender_name?: string;
  sender_phone?: string;
  sender_data?: {
    name?: string;
    phone_number?: string;
    [key: string]: unknown;
  };
  recipient_name?: string;
  recipient_phone?: string;
  recipient_data?: {
    name?: string;
    phone_number?: string;
    [key: string]: unknown;
  };
  ordered_items?: PhysicalVoucherItem[] | null;
  payment_id?: string;
  delivery_address?: string | Record<string, unknown> | null;
  [key: string]: unknown;
}

/**
 * Checks whether the voucher represents a physical product order.
 */
export function isPhysicalVoucher(voucher: VoucherNotificationData): boolean {
  if (!voucher) return false;

  const category = String(voucher.gift_category || '').trim().toLowerCase();
  if (category === 'physical') return true;

  if (Array.isArray(voucher.ordered_items) && voucher.ordered_items.length > 0) {
    return voucher.ordered_items.some(
      (item) => !item.item_type || item.item_type === 'product'
    );
  }

  return false;
}

/**
 * Dispatches an SMS alert to the manager when a physical gift voucher is purchased and paid.
 * Recipient number is read from GV_MANAGER_NUMBER in .env.
 */
export async function notifyManagerPhysicalOrder(
  voucher: VoucherNotificationData
): Promise<boolean> {
  try {
    if (!voucher) return false;

    // Check if it is a physical voucher
    if (!isPhysicalVoucher(voucher)) {
      return false;
    }

    const voucherId = String(voucher.id || voucher.voucher_id || '').trim();
    if (voucherId) {
      if (notifiedVoucherIds.has(voucherId)) {
        console.log(`[manager-notify] Voucher ${voucherId} already notified or notification in flight, skipping.`);
        return false;
      }
      // Synchronously mark as notified to prevent concurrent async duplicate sends
      notifiedVoucherIds.add(voucherId);
    }

    // Retrieve manager number from environment variable
    const managerNumber = (
      process.env.GV_MANAGER_NUMBER ||
      process.env.NEXT_PUBLIC_GV_MANAGER_NUMBER ||
      ''
    ).trim();

    if (!managerNumber) {
      console.warn('[manager-notify] GV_MANAGER_NUMBER is not configured in .env, skipping alert.');
      return false;
    }

    // Extract product descriptions
    let productsDesc = 'Physical Gift Voucher Product';
    if (Array.isArray(voucher.ordered_items) && voucher.ordered_items.length > 0) {
      productsDesc = voucher.ordered_items
        .map((p) => {
          const name = p.name_en || p.name || p.name_ar || 'Product';
          const qty = p.quantity && p.quantity > 1 ? ` (x${p.quantity})` : '';
          return `${name}${qty}`;
        })
        .join(', ');
    }

    const voucherNumber = voucher.voucher_number || voucherId || 'N/A';
    const orderNumber =
      voucher.order_number ||
      voucher.payment_id ||
      voucherId ||
      voucherNumber;

    const senderName =
      voucher.sender_data?.name ||
      voucher.gift_from ||
      voucher.sender_name ||
      'Customer';
    const senderPhone =
      voucher.sender_data?.phone_number ||
      voucher.sender_phone ||
      '';

    const recipientName =
      voucher.recipient_data?.name ||
      voucher.recipient_name ||
      '';
    const recipientPhone =
      voucher.recipient_data?.phone_number ||
      voucher.recipient_phone ||
      '';

    const totalAmount = voucher.total_amount ? String(voucher.total_amount) : '';
    const currency = String(voucher.currency || 'KWD').toUpperCase();

    // Compose notification message
    const lines = [
      '📦 USH Spa - New Product Order Alert!',
      `You have a new physical gift voucher product order.`,
      `Order No: ${orderNumber}`,
      `Voucher No: ${voucherNumber}`,
      `Products: ${productsDesc}`,
      senderPhone ? `Customer: ${senderName} (${senderPhone})` : `Customer: ${senderName}`,
    ];

    if (recipientName || recipientPhone) {
      lines.push(
        recipientPhone
          ? `Recipient: ${recipientName || 'Recipient'} (${recipientPhone})`
          : `Recipient: ${recipientName}`
      );
    }

    if (totalAmount) {
      lines.push(`Amount: ${totalAmount} ${currency}`);
    }

    const messageContent = lines.join('\n');

    // Build endpoints to call ushauth SMS API
    const baseUrl = getBaseApiUrl();
    const ushToken = getUshToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-USHSPA-TOKEN': ushToken,
      'USHSPA-TOKEN': ushToken,
      'USH_TOKEN': ushToken,
    };

    const smsPayload = {
      phone_numbers: [managerNumber],
      phone_number: managerNumber,
      content: messageContent,
      language: 'en',
      sender: 'USHSPA',
    };

    const candidateUrls = [
      `${baseUrl}/uauth/api/v1/sms/`,
      `${baseUrl}/api/v1/sms/`,
    ];
    if (baseUrl.includes(':8000')) {
      candidateUrls.push('http://127.0.0.1:8002/api/v1/sms/');
    }

    let sent = false;
    for (const endpoint of candidateUrls) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(smsPayload),
          cache: 'no-store',
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
          sent = true;
          console.log(`[manager-notify] SMS successfully sent to manager (${managerNumber}) via ${endpoint}`);
          break;
        } else {
          const errBody = await res.text().catch(() => '');
          console.warn(`[manager-notify] Endpoint ${endpoint} returned HTTP ${res.status}:`, errBody);
        }
      } catch (err) {
        console.warn(`[manager-notify] Connection failed to ${endpoint}:`, err instanceof Error ? err.message : err);
      }
    }

    if (!sent && voucherId) {
      // Revert reservation if sending failed on all endpoints
      notifiedVoucherIds.delete(voucherId);
    }

    return sent;
  } catch (err) {
    console.error('[manager-notify] Unexpected error sending manager notification:', err);
    return false;
  }
}


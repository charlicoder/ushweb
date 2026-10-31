import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const baseUrl = getBaseApiUrl();
    const ushToken = getUshToken();
    const authHeader =
      request.headers.get('Authorization') || request.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-USHSPA-TOKEN': ushToken,
      'USHSPA-TOKEN': ushToken,
      'USH_TOKEN': ushToken,
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Explicitly structure and sanitize sender, recipient, and voucher metadata
    const senderName = (body.sender_data?.name || body.gift_from || '').trim() || 'Valued Guest';
    const senderPhone = (body.sender_data?.phone_number || body.sender_phone || '').trim();

    const recipientName = (body.recipient_data?.name || body.recipient_name || '').trim();
    const recipientPhone = (body.recipient_phone || body.recipient_data?.phone_number || '').trim();

    const sanitizedPayload = {
      gift_category: body.gift_category || 'service',
      total_amount: String(body.total_amount),
      currency: body.currency || 'KWD',
      status: body.status || 'payment_pending',
      delivery_status: body.delivery_status || 'ordered',
      payment_through: 'ushweb',
      payment_provider: body.payment_provider || 'MyFatoorah',
      service_id: body.service_id || null,
      service_data:
        body.service_data && typeof body.service_data === 'object' ? body.service_data : {},
      branch_id: body.branch_id || null,
      branch_data:
        body.branch_data && typeof body.branch_data === 'object' ? body.branch_data : {},
      service_arrangement_id: body.service_arrangement_id || null,
      service_arrangement_data:
        body.service_arrangement_data && typeof body.service_arrangement_data === 'object'
          ? body.service_arrangement_data
          : {},
      addons: Array.isArray(body.addons) ? body.addons : [],
      ordered_items: Array.isArray(body.ordered_items) ? body.ordered_items : null,
      extra_time: Number(body.extra_time) || 0,
      price_for_extra_time:
        body.price_for_extra_time != null ? String(body.price_for_extra_time) : null,
      gift_from: senderName,
      sender_data: {
        name: senderName,
        phone_number: senderPhone,
        language_preference: body.sender_data?.language_preference || 'en',
      },
      recipient_phone: recipientPhone,
      recipient_name: recipientName,
      recipient_data: {
        name: recipientName,
        phone_number: recipientPhone,
        email: body.recipient_data?.email || '',
      },
      gift_message: (body.gift_message || '').trim() || null,
      gift_template: body.gift_template || null,
      delivery_mode: body.delivery_mode || 'on_activation',
      scheduled_delivery_at: body.scheduled_delivery_at || null,
    };

    // Candidate upstream endpoints (primary gateway + direct fallback if gateway is unresponsive)
    const primaryUrl = `${baseUrl}/booknpay/api/v1/vouchers/`;
    const candidateUrls: string[] = [primaryUrl];

    if (baseUrl.includes(':8000')) {
      // In local Docker environment, Kong is on 8000 and ushbooknpay is directly on 8003
      candidateUrls.push('http://127.0.0.1:8003/api/v1/vouchers/');
    } else {
      candidateUrls.push(`${baseUrl}/api/v1/vouchers/`);
    }

    let lastErrorData: any = null;
    let lastStatus = 502;

    for (let i = 0; i < candidateUrls.length; i++) {
      const targetUrl = candidateUrls[i];
      try {
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(sanitizedPayload),
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }

        lastStatus = res.status;
        lastErrorData = await res.json().catch(() => ({}));

        // If gateway returned 502/503/504, try the next fallback URL
        if ((res.status === 502 || res.status === 503 || res.status === 504) && i < candidateUrls.length - 1) {
          console.warn(`[gift-create-voucher] Endpoint ${targetUrl} failed with ${res.status}, trying fallback...`);
          continue;
        }

        console.error('[gift-create-voucher] Upstream rejected voucher creation:', res.status, lastErrorData);
        return NextResponse.json(
          lastErrorData.error
            ? lastErrorData
            : {
                success: false,
                error: {
                  code: 'UPSTREAM_ERROR',
                  message: lastErrorData.message || 'Failed to create gift voucher in database.',
                  detail: lastErrorData,
                },
              },
          { status: res.status }
        );
      } catch (networkErr) {
        console.warn(`[gift-create-voucher] Network error connecting to ${targetUrl}:`, networkErr);
        if (i < candidateUrls.length - 1) {
          continue;
        }
        throw networkErr;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: lastErrorData?.message || 'Failed to connect to voucher service.',
          detail: lastErrorData,
        },
      },
      { status: lastStatus }
    );
  } catch (error) {
    console.error('[gift-create-voucher] Unhandled error creating voucher:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Internal error creating voucher' },
      },
      { status: 500 }
    );
  }
}

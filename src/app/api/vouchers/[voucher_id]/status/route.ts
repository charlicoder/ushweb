import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';
import { notifyManagerPhysicalOrder } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

// In-flight request coalescing to prevent concurrent identical requests
const inFlightRequests = new Map<string, Promise<{ status: number; data: any }>>();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ voucher_id: string }> }
) {
  try {
    const { voucher_id } = await params;
    const body = await request.json().catch(() => ({}));

    const baseUrl = getBaseApiUrl();
    const ushToken = getUshToken();
    const authHeader =
      request.headers.get('Authorization') || request.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-USHSPA-TOKEN': ushToken,
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const payload = {
      status: body.status || 'active',
      payment_id: body.payment_id ? String(body.payment_id) : undefined,
      payment_data: body.payment_data || null,
      payment_provider: body.payment_provider || 'MyFatoorah',
      payment_through: body.payment_through || 'ushweb',
    };

    const targetUrl = `${baseUrl}/booknpay/api/v1/vouchers/${encodeURIComponent(voucher_id)}/status/`;

    const inFlightKey = `${voucher_id}_${payload.status}`;
    let executePromise = inFlightRequests.get(inFlightKey);

    if (!executePromise) {
      executePromise = (async () => {
        let res: Response | null = null;
        try {
          res = await fetch(targetUrl, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(payload),
            cache: 'no-store',
          });
        } catch (fetchErr) {
          console.warn('[voucher-status] Primary gateway fetch error:', fetchErr);
        }

        if ((!res || !res.ok) && (baseUrl.includes(':8000') || !res)) {
          const fallbackUrl = `http://127.0.0.1:8003/api/v1/vouchers/${encodeURIComponent(voucher_id)}/status/`;
          try {
            const fallbackRes = await fetch(fallbackUrl, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(payload),
              cache: 'no-store',
            });
            if (fallbackRes.ok) {
              res = fallbackRes;
            }
          } catch (fbErr) {
            console.warn('[voucher-status] Fallback direct fetch error:', fbErr);
          }
        }

        if (!res) {
          return {
            status: 502,
            data: {
              success: false,
              error: { message: 'Failed to connect to backend voucher service' },
            },
          };
        }

        const data = await res.json().catch(() => ({}));

        // If payment/activation succeeded, notify manager if this is a physical voucher product order
        if (res.ok && payload.status === 'active' && data?.data) {
          notifyManagerPhysicalOrder(data.data).catch((notifyErr) => {
            console.error('[voucher-status] Failed to send manager physical order notification:', notifyErr);
          });
        }

        return { status: res.status, data };
      })();

      inFlightRequests.set(inFlightKey, executePromise);
      executePromise.finally(() => {
        inFlightRequests.delete(inFlightKey);
      });
    }

    const { status, data } = await executePromise;

    return NextResponse.json(data, {
      status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[voucher-status] Error updating voucher status:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Failed to update voucher status',
        },
      },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ voucher_id: string }> }
) {
  return PATCH(request, context);
}

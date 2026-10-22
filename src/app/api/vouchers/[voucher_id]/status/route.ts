import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

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

    const res = await fetch(targetUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
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

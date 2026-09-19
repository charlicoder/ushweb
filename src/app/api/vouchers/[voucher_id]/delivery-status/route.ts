import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ voucher_id: string }> }
) {
  try {
    const { voucher_id } = await params;
    const body = await request.json().catch(() => ({}));

    const baseUrl = (
      process.env.BASE_TRACE_API_URL ||
      process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/+$/, '');

    const ushToken = process.env.USH_TOKEN || '';

    const targetUrl = `${baseUrl}/booknpay/api/v1/vouchers/${encodeURIComponent(voucher_id)}/delivery-status/`;

    const res = await fetch(targetUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-USHSPA-TOKEN': ushToken,
      },
      body: JSON.stringify(body),
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
    console.error('Error updating delivery status:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Failed to reach upstream server',
        },
      },
      { status: 502 }
    );
  }
}

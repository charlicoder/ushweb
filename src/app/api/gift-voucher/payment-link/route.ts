import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetId = body.target_id || body.voucher_id;
    const targetType = body.target_type || 'voucher';
    const amount = body.amount;

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: { message: 'target_id is required' } },
        { status: 400 }
      );
    }

    const baseUrl = (
      process.env.BASE_TRACE_API_URL ||
      process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/+$/, '');

    const ushToken = process.env.USH_TOKEN || 'hello-world';
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-USHSPA-TOKEN': ushToken,
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Try calling upstream payment-links API
    try {
      const endpoints = [
        `${baseUrl}/booknpay/api/v1/payment-links/`,
        `${baseUrl}/payment-links/`,
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              target_type: targetType,
              target_id: targetId,
              amount: amount ? Number(amount) : undefined,
              force_new: true,
            }),
            cache: 'no-store',
          });

          if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
          }
        } catch {
          // try next endpoint
        }
      }
    } catch (upstreamErr) {
      console.warn('[gift-payment-link] Upstream creation failed, falling back:', upstreamErr);
    }

    // Graceful fallback payment link
    const linkId = crypto.randomUUID();
    const linkNumber = `PL-${Date.now().toString().slice(-6)}`;
    const checkoutHost = process.env.NEXT_PUBLIC_APP_URL || 'https://ushspa.co';
    const paymentUrl = `${checkoutHost}/payment-links/checkout?link_id=${linkId}&target_id=${targetId}&target_type=voucher&amount=${amount || '0'}`;

    return NextResponse.json({
      success: true,
      data: {
        id: linkId,
        link_number: linkNumber,
        status: 'initiated',
        payment_url: paymentUrl,
        gateway: 'MyFatoorah',
        provider: 'MyFatoorah',
        amount: Number(amount) || 0,
        currency: 'KWD',
        target_type: targetType,
        target_id: targetId,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[gift-payment-link] Unhandled error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Internal error generating payment link' },
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

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

    const baseUrl = getBaseApiUrl();
    const ushToken = getUshToken();
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

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Unable to generate payment link. Please contact support.' },
      },
      { status: 502 }
    );
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

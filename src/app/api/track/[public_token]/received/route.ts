import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl } from '@/lib/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ public_token: string }> }
) {
  try {
    const { public_token } = await params;
    const body = await request.json().catch(() => ({}));
    const baseUrl = getBaseApiUrl();

    const primaryUrl = `${baseUrl}/booknpay/api/v1/track/${encodeURIComponent(public_token)}/received/`;
    const fallbackUrl = `${baseUrl}/api/v1/track/${encodeURIComponent(public_token)}/received/`;

    let res = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (res.status === 404) {
      res = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error submitting received status to upstream:', error);
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

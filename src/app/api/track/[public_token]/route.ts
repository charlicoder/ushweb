import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl } from '@/lib/api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ public_token: string }> }
) {
  try {
    const { public_token } = await params;
    const baseUrl = getBaseApiUrl();

    const targetUrl = `${baseUrl}/booknpay/api/v1/track/${encodeURIComponent(public_token)}/`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: {
        // Prevent browser and CDN from caching delivery status responses
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching order status from upstream:', error);
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

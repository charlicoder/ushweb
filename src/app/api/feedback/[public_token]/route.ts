import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl } from '@/lib/api';

/** Public feedback page context: GET /uanr/api/v1/feedback/public/{token}/ */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ public_token: string }> }
) {
  try {
    const { public_token } = await params;
    const targetUrl = `${getBaseApiUrl()}/uanr/api/v1/feedback/public/${encodeURIComponent(public_token)}/`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching feedback from upstream:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to reach upstream server' },
      },
      { status: 502 }
    );
  }
}


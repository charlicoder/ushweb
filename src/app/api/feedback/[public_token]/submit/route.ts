import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl } from '@/lib/api';

/** Submit feedback ratings: POST /uanr/api/v1/feedback/public/{token}/submit/ */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ public_token: string }> }
) {
  try {
    const { public_token } = await params;
    const body = await request.text();
    const targetUrl = `${getBaseApiUrl()}/uanr/api/v1/feedback/public/${encodeURIComponent(public_token)}/submit/`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error submitting feedback to upstream:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to reach upstream server' },
      },
      { status: 502 }
    );
  }
}


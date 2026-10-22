import { NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

  try {
    const res = await fetch(`${baseUrl}/uauth/api/v1/gifts/categories/`, {
      headers: {
        'Accept': 'application/json',
        'X-USHSPA-TOKEN': ushToken,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const errData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { success: false, data: [], error: errData?.error || { message: 'Categories currently unavailable' } },
      { status: res.status }
    );
  } catch (err) {
    console.warn('[gift-categories-api] Upstream fetch failed:', err);
    return NextResponse.json(
      { success: false, data: [], error: { message: 'Unable to connect to service. Please contact support.' } },
      { status: 502 }
    );
  }
}

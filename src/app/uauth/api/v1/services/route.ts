import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const BASE_URL = getBaseApiUrl();
  const USH_TOKEN = getUshToken();
  const qs = req.nextUrl.searchParams.toString();
  const url = `${BASE_URL}/uauth/api/v1/services/${qs ? `?${qs}` : ''}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-USHSPA-TOKEN': USH_TOKEN,
        'Accept-Language': req.headers.get('accept-language') || 'en',
      },
      cache: 'no-store',
    });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Proxy error';
    return NextResponse.json({ detail: message }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_URL = (
  process.env.BASE_TRACE_API_URL ||
  process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
  'http://127.0.0.1:8000'
).replace(/\/+$/, '');

const USH_TOKEN = process.env.USH_TOKEN || process.env.API_APP_TOKEN || 'hello-world';

export async function GET(req: NextRequest) {
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

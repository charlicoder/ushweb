import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('service_id') || '';
  const branchId = searchParams.get('branch_id') || '';

  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

  if (serviceId) {
    try {
      const url = new URL(`${baseUrl}/uauth/api/v1/services/${encodeURIComponent(serviceId)}/availability/`);
      if (branchId) {
        url.searchParams.set('branch_id', branchId);
      }
      url.searchParams.set('_t', String(Date.now()));

      const res = await fetch(url.toString(), {
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
        {
          success: false,
          service: null,
          service_arrangements: [],
          error: errData?.error || { message: 'Service availability currently unavailable' },
        },
        { status: res.status }
      );
    } catch (err) {
      console.warn('[gift-availability-api] Upstream fetch failed:', err);
      return NextResponse.json(
        {
          success: false,
          service: null,
          service_arrangements: [],
          error: { message: 'Unable to connect to service. Please contact support.' },
        },
        { status: 502 }
      );
    }
  }

  return NextResponse.json(
    {
      success: false,
      service: null,
      service_arrangements: [],
      error: { message: 'service_id is required' },
    },
    { status: 400 }
  );
}

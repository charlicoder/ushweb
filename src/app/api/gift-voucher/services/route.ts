import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get('gender') || 'female';

  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

  try {
    const url = new URL(`${baseUrl}/uauth/api/v1/services/`);
    url.searchParams.set('country', 'KW');
    if (gender === 'female') {
      url.searchParams.set('is_for_female', 'True');
    } else if (gender === 'male') {
      url.searchParams.set('is_for_male', 'True');
    }

    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X-USHSPA-TOKEN': ushToken,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      const normalized = rawList.map((item: any) => ({
        ...item,
        id: String(item.id),
        name: item.name || '',
        name_en: item.name_en || item.name || '',
        name_ar: item.name_ar || item.name || '',
        primary_image: item.primary_image || item.image1 || item.image || null,
        duration_minutes: item.duration_minutes || 60,
        base_price: item.base_price || item.current_price || '0',
        current_price: item.current_price || item.base_price || '0',
        currency: item.currency || 'KWD',
        branches: Array.isArray(item.branches)
          ? item.branches.map((b: any) => ({
              id: String(b.branch_id || b.id || ''),
              branch_id: String(b.branch_id || b.id || ''),
              name: b.name || '',
              name_en: b.name_en || b.name || '',
              name_ar: b.name_ar || b.name || '',
              address: b.address || '',
              city: b.city || '',
            }))
          : [],
      }));

      return NextResponse.json({ success: true, data: normalized });
    }

    const errData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { success: false, data: [], error: errData?.error || { message: 'Services currently unavailable' } },
      { status: res.status }
    );
  } catch (err) {
    console.warn('[gift-services-api] Upstream fetch failed:', err);
    return NextResponse.json(
      { success: false, data: [], error: { message: 'Unable to connect to service. Please contact support.' } },
      { status: 502 }
    );
  }
}

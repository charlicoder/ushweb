import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestedLang = searchParams.get('lang') || request.headers.get('accept-language')?.split(',')[0] || 'en';
  const isRequestedAr = requestedLang.toLowerCase().startsWith('ar');

  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

  try {
    const targetUrl = `${baseUrl}/uauth/api/v1/gifts/categories/`;

    const [resEn, resAr] = await Promise.all([
      fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'X-USHSPA-TOKEN': ushToken,
          'Accept-Language': 'en',
        },
        cache: 'no-store',
      }),
      fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'X-USHSPA-TOKEN': ushToken,
          'Accept-Language': 'ar',
        },
        cache: 'no-store',
      }),
    ]);

    const parseList = async (res: Response) => {
      if (!res.ok) return [];
      const data = await res.json().catch(() => null);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.results)) return data.results;
      return [];
    };

    const [rawEn, rawAr] = await Promise.all([parseList(resEn), parseList(resAr)]);
    const baseList = rawEn.length > 0 ? rawEn : rawAr;

    if (baseList.length === 0 && !resEn.ok && !resAr.ok) {
      return NextResponse.json(
        { success: false, data: [], error: { message: 'Categories currently unavailable' } },
        { status: 502 }
      );
    }

    const arMap = new Map<string, any>(rawAr.map((item: any) => [String(item.id), item]));
    const enMap = new Map<string, any>(rawEn.map((item: any) => [String(item.id), item]));

    const normalized = baseList.map((item: any) => {
      const idStr = String(item.id);
      const itemEn = enMap.get(idStr) || item;
      const itemAr = arMap.get(idStr) || item;

      const titleEn = itemEn.title || item.title || '';
      const titleAr = itemAr.title || item.title_ar || titleEn;
      const descEn = itemEn.description || item.description || '';
      const descAr = itemAr.description || item.description_ar || descEn;

      return {
        ...item,
        id: idStr,
        title: isRequestedAr ? titleAr : titleEn,
        title_en: titleEn,
        title_ar: titleAr,
        description: isRequestedAr ? descAr : descEn,
        description_en: descEn,
        description_ar: descAr,
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    console.warn('[gift-categories-api] Upstream fetch failed:', err);
    return NextResponse.json(
      { success: false, data: [], error: { message: 'Unable to connect to service. Please contact support.' } },
      { status: 502 }
    );
  }
}

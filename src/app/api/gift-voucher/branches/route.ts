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
    const targetUrl = new URL(`${baseUrl}/uauth/api/v1/branches/`);
    targetUrl.searchParams.set('page_size', '200');

    const [resEn, resAr] = await Promise.all([
      fetch(targetUrl.toString(), {
        headers: {
          'Accept': 'application/json',
          'X-USHSPA-TOKEN': ushToken,
          'Accept-Language': 'en',
        },
        cache: 'no-store',
      }),
      fetch(targetUrl.toString(), {
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
        { success: false, data: [], error: { message: 'Branches currently unavailable' } },
        { status: 502 }
      );
    }

    const arMap = new Map<string, any>(rawAr.map((item: any) => [String(item.id || item.branch_id), item]));
    const enMap = new Map<string, any>(rawEn.map((item: any) => [String(item.id || item.branch_id), item]));

    const normalized = baseList
      .filter((item: any) => (item.status ? item.status === 'active' : true))
      .map((item: any) => {
        const idStr = String(item.id || item.branch_id);
        const itemEn = enMap.get(idStr) || item;
        const itemAr = arMap.get(idStr) || item;

        const rawNameEn = itemEn.name_en || itemEn.name || item.name || '';
        const rawNameAr = itemAr.name_ar || itemAr.name || item.name_ar || rawNameEn;

        const isHome =
          rawNameEn.toLowerCase().includes('home') ||
          rawNameAr.includes('منزل') ||
          idStr === '1896a1ca-66bc-4f06-9a0d-cef30fa8293c';

        const nameEn = isHome ? 'Home Service' : rawNameEn;
        const nameAr = isHome ? 'خدمة المنازل' : (rawNameAr || rawNameEn);

        const isSharq = rawNameEn.toLowerCase().includes('sharq') || rawNameAr.includes('شرق');
        const isMangaf = rawNameEn.toLowerCase().includes('mangaf') || rawNameAr.includes('منقف');
        const isJaber = rawNameEn.toLowerCase().includes('jaber') || rawNameAr.includes('جابر');

        const cityEn = isHome
          ? 'All Kuwait Areas'
          : itemEn.city || (isSharq ? 'Kuwait City' : isMangaf ? 'Al Ahmadi' : isJaber ? 'Jaber Al Ahmad' : item.city || 'Kuwait');
        const cityAr = isHome
          ? 'جميع مناطق الكويت'
          : itemAr.city || (isSharq ? 'مدينة الكويت' : isMangaf ? 'الأحمدي' : isJaber ? 'جابر الأحمد' : item.city || 'الكويت');

        return {
          id: idStr,
          branch_id: idStr,
          name: isRequestedAr ? nameAr : nameEn,
          name_en: nameEn,
          name_ar: nameAr,
          city: isRequestedAr ? cityAr : cityEn,
          city_en: cityEn,
          city_ar: cityAr,
          address: item.address || item.address_line1 || (isHome ? (isRequestedAr ? 'خدمة منزلية في موقع العميل' : "At client's location") : ''),
          image1: item.image1 || null,
          sort_order: typeof item.sort_order === 'number' ? item.sort_order : 99,
          is_home_service: isHome,
        };
      })
      .sort((a: any, b: any) => a.sort_order - b.sort_order);

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    console.error('[/api/gift-voucher/branches] Exception:', err);
    return NextResponse.json(
      { success: false, data: [], error: { message: 'Failed to load branches' } },
      { status: 500 }
    );
  }
}

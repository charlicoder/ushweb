import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get('gender') || 'female';
  const requestedLang = searchParams.get('lang') || request.headers.get('accept-language')?.split(',')[0] || 'en';
  const isRequestedAr = requestedLang.toLowerCase().startsWith('ar');

  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

  try {
    const buildUrl = () => {
      const url = new URL(`${baseUrl}/uauth/api/v1/services/`);
      url.searchParams.set('country', 'KW');
      if (gender === 'female') {
        url.searchParams.set('is_for_female', 'True');
      } else if (gender === 'male') {
        url.searchParams.set('is_for_male', 'True');
      }
      return url.toString();
    };

    const targetUrl = buildUrl();

    // Fetch both English and Arabic translations concurrently from Django backend
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

    const [rawListEn, rawListAr] = await Promise.all([parseList(resEn), parseList(resAr)]);

    const baseList = rawListEn.length > 0 ? rawListEn : rawListAr;
    if (baseList.length === 0 && !resEn.ok && !resAr.ok) {
      return NextResponse.json(
        { success: false, data: [], error: { message: 'Services currently unavailable' } },
        { status: 502 }
      );
    }

    const arMap = new Map<string, any>(rawListAr.map((item: any) => [String(item.id), item]));
    const enMap = new Map<string, any>(rawListEn.map((item: any) => [String(item.id), item]));

    const normalized = baseList.map((item: any) => {
      const idStr = String(item.id);
      const itemEn = enMap.get(idStr) || item;
      const itemAr = arMap.get(idStr) || item;

      const nameEn = itemEn.name || item.name || '';
      const nameAr = itemAr.name || item.name_ar || nameEn;

      const descEn = itemEn.description || item.description || '';
      const descAr = itemAr.description || item.description_ar || descEn;

      const benefitsEn = itemEn.benefits || item.benefits || item.customer_benefits || null;
      const benefitsAr = itemAr.benefits || item.benefits_ar || benefitsEn;

      const sessionBenefitsEn = itemEn.session_benefits || item.session_benefits || null;
      const sessionBenefitsAr = itemAr.session_benefits || item.session_benefits_ar || sessionBenefitsEn;

      return {
        ...item,
        id: idStr,
        name: isRequestedAr ? nameAr : nameEn,
        name_en: nameEn,
        name_ar: nameAr,
        description: isRequestedAr ? descAr : descEn,
        description_en: descEn,
        description_ar: descAr,
        benefits: isRequestedAr ? benefitsAr : benefitsEn,
        benefits_en: benefitsEn,
        benefits_ar: benefitsAr,
        customer_benefits: isRequestedAr ? benefitsAr : benefitsEn,
        session_benefits: isRequestedAr ? sessionBenefitsAr : sessionBenefitsEn,
        session_benefits_en: sessionBenefitsEn,
        session_benefits_ar: sessionBenefitsAr,
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
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    console.warn('[gift-services-api] Upstream fetch failed:', err);
    return NextResponse.json(
      { success: false, data: [], error: { message: 'Unable to connect to service. Please contact support.' } },
      { status: 502 }
    );
  }
}

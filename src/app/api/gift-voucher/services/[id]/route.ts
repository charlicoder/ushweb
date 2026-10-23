import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing service id' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const requestedLang = searchParams.get('lang') || request.headers.get('accept-language')?.split(',')[0] || 'en';
  const isRequestedAr = requestedLang.toLowerCase().startsWith('ar');

  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

  try {
    const targetUrl = `${baseUrl}/uauth/api/v1/services/${id}/`;

    // Fetch both English and Arabic translations concurrently
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

    const parseData = async (res: Response) => {
      if (!res.ok) return null;
      const json = await res.json().catch(() => null);
      return json?.data || json || null;
    };

    const [rawEn, rawAr] = await Promise.all([parseData(resEn), parseData(resAr)]);
    const raw = rawEn || rawAr;

    if (!raw) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: resEn.status || resAr.status || 404 }
      );
    }

    const nameEn = rawEn?.name || raw?.name || '';
    const nameAr = rawAr?.name || raw?.name_ar || nameEn;

    const descEn = rawEn?.description || raw?.description || '';
    const descAr = rawAr?.description || raw?.description_ar || descEn;

    const benefitsEn = rawEn?.benefits || raw?.benefits || raw?.customer_benefits || null;
    const benefitsAr = rawAr?.benefits || raw?.benefits_ar || benefitsEn;

    const sessionBenefitsEn = rawEn?.session_benefits || raw?.session_benefits || null;
    const sessionBenefitsAr = rawAr?.session_benefits || raw?.session_benefits_ar || sessionBenefitsEn;

    const normalized = {
      ...raw,
      id: String(raw.id),
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
      primary_image: raw.primary_image || raw.image1 || raw.image || null,
      duration_minutes: raw.duration_minutes || 60,
      base_price: raw.base_price || raw.current_price || '0',
      current_price: raw.current_price || raw.base_price || '0',
      currency: raw.currency || 'KWD',
      branches: Array.isArray(raw.branches)
        ? raw.branches.map((b: any) => ({
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

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    console.warn('[gift-service-detail-api] Upstream fetch failed:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to connect to service' },
      { status: 502 }
    );
  }
}

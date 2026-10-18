import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get('gender') || 'female';

  const baseUrl = (
    process.env.BASE_TRACE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/+$/, '');

  const ushToken = process.env.USH_TOKEN || 'hello-world';

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
  } catch (err) {
    console.warn('[gift-services-api] Upstream fetch failed, falling back:', err);
  }

  // Fallback services
  return NextResponse.json({
    success: true,
    data: [
      {
        id: '8fd61993-554b-4cbb-9eb8-caf9c013c1bf',
        name: 'ROYAL PACKAGE',
        name_en: 'ROYAL PACKAGE',
        name_ar: 'الباقة الملكية الفاخرة',
        description: 'A complete royal spa experience designed for ultimate luxury and relaxation. This package combines a luxurious Moroccan bath, professional body massage, jacuzzi, and sauna sessions to leave you refreshed, relaxed, and fully renewed in a private suite.',
        duration_minutes: 120,
        currency: 'KWD',
        base_price: '66.000',
        current_price: '66.000',
        primary_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
        extra_minutes: 30,
        price_for_extra_minutes: '15.000',
        is_for_female: true,
        is_for_male: false,
        branches: [
          {
            id: '8d93e387-e927-460d-91ab-4df9072f1977',
            branch_id: '8d93e387-e927-460d-91ab-4df9072f1977',
            name: 'Sharq Branch',
            name_en: 'Sharq Branch',
            name_ar: 'فرع شرق',
            address: 'Al-Shuhada Street, Block 04, Building 32',
            city: 'Kuwait City',
          },
        ],
      },
      {
        id: '9de10111-4455-6677-8899-aabbccddeeff',
        name: 'Quiet Ush Signature Moroccan Bath',
        name_en: 'Quiet Ush Signature Moroccan Bath',
        name_ar: 'حمام مغربي كويت أوش الملكي',
        description: 'Authentic Moroccan bath ritual utilizing black eucalyptus olive soap, kessa exfoliating mitt, mineral-rich Atlas clay wrap, and pure argan oil hydration.',
        duration_minutes: 60,
        currency: 'KWD',
        base_price: '35.000',
        current_price: '35.000',
        primary_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
        extra_minutes: 30,
        price_for_extra_minutes: '10.000',
        is_for_female: true,
        is_for_male: false,
        branches: [
          {
            id: '8d93e387-e927-460d-91ab-4df9072f1977',
            branch_id: '8d93e387-e927-460d-91ab-4df9072f1977',
            name: 'Sharq Branch',
            name_en: 'Sharq Branch',
            name_ar: 'فرع شرق',
            address: 'Al-Shuhada Street, Block 04, Building 32',
            city: 'Kuwait City',
          },
        ],
      },
      {
        id: 'ab223344-5566-7788-9900-112233445566',
        name: '24K Gold Luxury Rejuvenating Facial',
        name_en: '24K Gold Luxury Rejuvenating Facial',
        name_ar: 'جلسة الذهب عيار 24 الفاخرة لتجديد البشرة',
        description: 'A transformative anti-aging facial infused with pure 24K gold foil, hyaluronic acid micro-infusion, and soothing jade roller massage for supreme radiance.',
        duration_minutes: 75,
        currency: 'KWD',
        base_price: '45.000',
        current_price: '45.000',
        primary_image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
        extra_minutes: 30,
        price_for_extra_minutes: '12.000',
        is_for_female: true,
        is_for_male: false,
        branches: [
          {
            id: '8d93e387-e927-460d-91ab-4df9072f1977',
            branch_id: '8d93e387-e927-460d-91ab-4df9072f1977',
            name: 'Sharq Branch',
            name_en: 'Sharq Branch',
            name_ar: 'فرع شرق',
            address: 'Al-Shuhada Street, Block 04, Building 32',
            city: 'Kuwait City',
          },
        ],
      },
      {
        id: 'cd334455-6677-8899-0011-223344556677',
        name: 'Deep Tissue Herbal Compress Massage',
        name_en: 'Deep Tissue Herbal Compress Massage',
        name_ar: 'مساج الأنسجة العميقة بالكمادات العشبية التايلاندية',
        description: 'Traditional therapeutic massage combining firm acupressure techniques with warm aromatic Thai herbal compresses to melt away muscular tension.',
        duration_minutes: 90,
        currency: 'KWD',
        base_price: '40.000',
        current_price: '40.000',
        primary_image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80',
        extra_minutes: 30,
        price_for_extra_minutes: '15.000',
        is_for_female: true,
        is_for_male: false,
        branches: [
          {
            id: '8d93e387-e927-460d-91ab-4df9072f1977',
            branch_id: '8d93e387-e927-460d-91ab-4df9072f1977',
            name: 'Sharq Branch',
            name_en: 'Sharq Branch',
            name_ar: 'فرع شرق',
            address: 'Al-Shuhada Street, Block 04, Building 32',
            city: 'Kuwait City',
          },
        ],
      },
      {
        id: 'ef445566-7788-9900-1122-334455667788',
        name: 'Aromatherapy Relaxation Body Care',
        name_en: 'Aromatherapy Relaxation Body Care',
        name_ar: 'جلسة العناية والاسترخاء بالعطور الطبيعية',
        description: 'Gentle and rhythmic Swedish massage utilizing custom essential oil blends, followed by a warm botanical body wrap to restore inner peace.',
        duration_minutes: 60,
        currency: 'KWD',
        base_price: '30.000',
        current_price: '30.000',
        primary_image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
        extra_minutes: 30,
        price_for_extra_minutes: '10.000',
        is_for_female: true,
        is_for_male: false,
        branches: [
          {
            id: '8d93e387-e927-460d-91ab-4df9072f1977',
            branch_id: '8d93e387-e927-460d-91ab-4df9072f1977',
            name: 'Sharq Branch',
            name_en: 'Sharq Branch',
            name_ar: 'فرع شرق',
            address: 'Al-Shuhada Street, Block 04, Building 32',
            city: 'Kuwait City',
          },
        ],
      },
    ],
  });
}

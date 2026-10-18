import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('service_id') || '';
  const branchId = searchParams.get('branch_id') || '';

  const baseUrl = (
    process.env.BASE_TRACE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/+$/, '');

  const ushToken = process.env.USH_TOKEN || 'hello-world';

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
    } catch (err) {
      console.warn('[gift-availability-api] Upstream fetch failed, falling back:', err);
    }
  }

  // Fallback arrangements and addons
  return NextResponse.json({
    service: {
      id: serviceId || '8fd61993-554b-4cbb-9eb8-caf9c013c1bf',
      name: 'ROYAL PACKAGE',
      name_en: 'ROYAL PACKAGE',
      name_ar: 'الباقة الملكية الفاخرة',
      duration_minutes: 120,
      currency: 'KWD',
      extra_minutes: 30,
      price_for_extra_minutes: '15.000',
    },
    service_arrangements: [
      {
        id: '19283b1b-4e47-42a2-a294-a4c012cd4392',
        name: 'Royal VIP Suite',
        name_en: 'Royal VIP Suite',
        name_ar: 'جناح كبار الشخصيات الملكي',
        description: 'Private luxury suite featuring oversized jacuzzi bath, private sauna, and en-suite relaxation lounge.',
        description_ar: 'جناح خاص فائق الفخامة يضم جاكوزي كبير، وساونا خاصة، وصالة استرخاء متكاملة.',
        arrangement_type: 'vip_suite',
        effective_price: '66.000',
        currency: 'KWD',
        addons: [
          {
            id: '3c2d5d85-9be9-4f3b-8514-dcefdaf77068',
            name: 'EAR CANDLING',
            name_en: 'Ear Candling Therapy',
            name_ar: 'جلسة تنظيف الأذن بالشمع الطبي',
            description: 'Natural holistic therapy for relaxation and tension relief.',
            price: '5.000',
            currency: 'KWD',
            duration_minutes: 15,
            is_active: true,
          },
          {
            id: '3348cb45-b4ad-4137-85de-52c86e56e34a',
            name: 'Private Jacuzzi Hydromassage',
            name_en: 'Private Jacuzzi Hydromassage',
            name_ar: 'جلسة الجاكوزي والمساج المائي الخاص',
            description: 'Relaxing 30-minute thermal hydromassage session.',
            price: '5.000',
            currency: 'KWD',
            duration_minutes: 30,
            is_active: true,
          },
          {
            id: '96cb3c23-bf23-444c-8cb0-60240cbd840d',
            name: 'KASAT HWA (Dry Cupping Therapy)',
            name_en: 'Kasat Hwa (Dry Cupping Therapy)',
            name_ar: 'كاسات هوائية علاجية لتنشيط الدورة الدموية',
            description: 'Ancient therapeutic technique promoting blood circulation and deep muscle relief.',
            price: '8.000',
            currency: 'KWD',
            duration_minutes: 20,
            is_active: true,
          },
          {
            id: '3819d393-caff-476f-82f6-2f780cffbb3c',
            name: 'Herbal Infused Sauna Session',
            name_en: 'Herbal Infused Sauna Session',
            name_ar: 'جلسة الساونا العشبية المهدئة',
            description: 'Therapeutic steam detox with eucalyptus and lavender oils.',
            price: '5.000',
            currency: 'KWD',
            duration_minutes: 20,
            is_active: true,
          },
        ],
      },
      {
        id: '22383b1b-4e47-42a2-a294-a4c012cd4393',
        name: 'Classic Treatment Room',
        name_en: 'Classic Treatment Room',
        name_ar: 'غرفة العلاج الكلاسيكية الهادئة',
        description: 'Serene ambient room with custom lighting, heated therapy bed, and soft aromatherapy music.',
        description_ar: 'غرفة علاجية هادئة مجهزة بسرير تدليك دافئ وإضاءة هادئة وموسيقى استرخاء.',
        arrangement_type: 'classic_room',
        effective_price: '55.000',
        currency: 'KWD',
        addons: [
          {
            id: '3c2d5d85-9be9-4f3b-8514-dcefdaf77068',
            name: 'EAR CANDLING',
            name_en: 'Ear Candling Therapy',
            name_ar: 'جلسة تنظيف الأذن بالشمع الطبي',
            description: 'Natural holistic therapy for relaxation and tension relief.',
            price: '5.000',
            currency: 'KWD',
            duration_minutes: 15,
            is_active: true,
          },
          {
            id: '3819d393-caff-476f-82f6-2f780cffbb3c',
            name: 'Herbal Infused Sauna Session',
            name_en: 'Herbal Infused Sauna Session',
            name_ar: 'جلسة الساونا العشبية المهدئة',
            description: 'Therapeutic steam detox with eucalyptus and lavender oils.',
            price: '5.000',
            currency: 'KWD',
            duration_minutes: 20,
            is_active: true,
          },
        ],
      },
    ],
  });
}

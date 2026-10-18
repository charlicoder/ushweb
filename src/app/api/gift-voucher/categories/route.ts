import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = (
    process.env.BASE_TRACE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/+$/, '');

  const ushToken = process.env.USH_TOKEN || 'hello-world';

  try {
    const res = await fetch(`${baseUrl}/uauth/api/v1/gifts/categories/`, {
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
    console.warn('[gift-categories-api] Upstream fetch failed, falling back:', err);
  }

  // Graceful fallback categories if upstream is unreachable
  return NextResponse.json({
    success: true,
    data: [
      {
        id: '1bceb079-1e61-4027-92ae-488d367a34a8',
        code: 'PHYSICAL',
        title: 'Signature Gift Box',
        title_ar: 'صندوق الهدايا الفاخر',
        description: 'Curated luxury spa gift boxes and wellness care products delivered directly to the recipient.',
        description_ar: 'صناديق هدايا سبا فاخرة ومنتجات عناية استثنائية تُسلم مباشرة للمستلم.',
        image: 'https://d3q16ie8zzbnic.cloudfront.net/gifts/giftcategory/1bceb079-1e61-4027-92ae-488d367a34a8/9ca1ce0bf5524c27a8641a28af4d2b76_medium.webp',
        display_order: 0,
        is_active: true,
      },
      {
        id: '11ac8b5c-31e4-4c5c-92cb-de4c7f4e0b51',
        code: 'DIGITAL',
        title: 'Digital USH Spa Gifts',
        title_ar: 'هدايا USH Spa الرقمية',
        description: 'Send an instant digital spa gift voucher with personalized service options.',
        description_ar: 'أرسل قسيمة سبا رقمية فورية مع خيارات خدمة مخصصة ورسالة إهداء.',
        image: 'https://d3q16ie8zzbnic.cloudfront.net/gifts/giftcategory/11ac8b5c-31e4-4c5c-92cb-de4c7f4e0b51/61bad5d33a5b43b3b0a170af400a54c2_medium.webp',
        display_order: 1,
        is_active: true,
      },
    ],
  });
}

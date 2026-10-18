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
    const res = await fetch(`${baseUrl}/uauth/api/v1/products/?is_gift_eligible=true`, {
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

      const normalized = rawList.map((item: any) => {
        const catName =
          (typeof item.category === 'object' ? item.category?.name : item.category) ||
          item.category_name ||
          'Gift Packaging';

        const img = item.image || item.image1 || item.primary_image || null;
        const cur = item.currency || 'KWD';
        const rawPrice = item.current_price || item.price || item.base_price || '0';
        const numPrice = parseFloat(String(rawPrice));
        const priceStr = isNaN(numPrice) ? String(rawPrice) : numPrice.toFixed(cur === 'KWD' ? 3 : 2);

        return {
          id: String(item.id),
          name: item.name || '',
          name_en: item.name_en || item.name || '',
          name_ar: item.name_ar || item.name || '',
          short_description: item.short_description || item.description || '',
          description: item.description || item.short_description || '',
          price: priceStr,
          current_price: priceStr,
          currency: cur,
          image: img,
          sku: item.sku || `USH-${item.id.substring(0, 6)}`,
          category: catName,
          brand: item.brand || 'USH Spa Signature',
          is_in_stock: item.is_in_stock ?? true,
          how_to_use: item.how_to_use,
          ingredients: item.ingredients,
          benefits: item.benefits,
        };
      });

      return NextResponse.json({ success: true, data: normalized });
    }
  } catch (err) {
    console.warn('[gift-products-api] Upstream fetch failed, falling back:', err);
  }

  // Graceful fallback products if upstream is unreachable
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 'ccd1daa3-74a6-4c24-a8fe-1312e65c85ab',
        name: 'USH Luxury Gift Box',
        name_en: 'USH Luxury Gift Box',
        name_ar: 'صندوق USH الفاخر للإهداء',
        short_description: 'An exquisitely designed luxury presentation gift box with gold-embossed ribbon and personalized greeting card.',
        description: 'An exquisitely designed luxury presentation gift box with gold-embossed ribbon, premium velvet interior, and personalized greeting card. Perfect for presenting physical vouchers or boutique gifts.',
        price: '15.000',
        current_price: '15.000',
        currency: 'KWD',
        is_in_stock: true,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
        sku: 'GB-LUX-01',
        category: 'Gift Packaging',
        brand: 'USH Spa Signature',
      },
      {
        id: '98d1a123-bc34-45de-98aa-22446688aa01',
        name: 'Velvet Royal Spa Gift Hamper',
        name_en: 'Velvet Royal Spa Gift Hamper',
        name_ar: 'سلة الهدايا الملكية المخملية',
        short_description: 'A curated hamper with luxury body scrubs, aromatic essential massage oils, and plush spa amenities.',
        description: 'A curated hamper featuring organic body scrubs, aromatic essential massage oils, scented candles, and plush spa slippers, beautifully wrapped in an elegant gift basket.',
        price: '25.000',
        current_price: '25.000',
        currency: 'KWD',
        is_in_stock: true,
        image: 'https://images.unsplash.com/photo-1512290900672-1f55b1115bc2?w=600&q=80',
        sku: 'GB-VEL-02',
        category: 'Gift Packaging',
        brand: 'USH Spa Signature',
      },
      {
        id: '77c2bb45-ef67-48aa-8911-33557799bb02',
        name: 'Gold Ribbon Spa Presentation Case',
        name_en: 'Gold Ribbon Spa Presentation Case',
        name_ar: 'حافظة الإهداء الذهبية الفاخرة',
        short_description: 'Sleek ivory presentation case finished with hand-tied satin ribbon.',
        description: 'Sleek ivory presentation case finished with hand-tied satin ribbon and embossed metallic seal for an unforgettable gifting experience.',
        price: '10.000',
        current_price: '10.000',
        currency: 'KWD',
        is_in_stock: true,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
        sku: 'GB-GLD-03',
        category: 'Gift Packaging',
        brand: 'USH Spa Signature',
      },
    ],
  });
}

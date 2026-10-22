import { NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = getBaseApiUrl();
  const ushToken = getUshToken();

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

    const errData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { success: false, data: [], error: errData?.error || { message: 'Products currently unavailable' } },
      { status: res.status }
    );
  } catch (err) {
    console.warn('[gift-products-api] Upstream fetch failed:', err);
    return NextResponse.json(
      { success: false, data: [], error: { message: 'Unable to connect to service. Please contact support.' } },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

const DEFAULT_MYFATOORAH_API_URL = 'https://apitest.myfatoorah.com';
const DEFAULT_MYFATOORAH_API_KEY =
  'SK_KWT_yo9cKmX0BdmLOuGof6xdgvtDbjhdk4Iv2ammIwPBcXBdjpZtOGofTvtaMrXE2v2D';

function getMyFatoorahConfig() {
  const apiUrl = (
    process.env.MYFATOORAH_API_URL ||
    process.env.NEXT_PUBLIC_MYFATOORAH_API_URL ||
    DEFAULT_MYFATOORAH_API_URL
  ).replace(/\/+$/, '');

  const apiKey =
    process.env.MYFATOORAH_API_KEY ||
    process.env.NEXT_PUBLIC_MYFATOORAH_API_KEY ||
    DEFAULT_MYFATOORAH_API_KEY;

  return { apiUrl, apiKey };
}


interface MyFatoorahRawMethod {
  PaymentMethodId: number;
  PaymentMethodEn: string;
  PaymentMethodAr: string;
  PaymentMethodCode: string;
  ImageUrl?: string;
  IsDirectPayment?: boolean;
  ServiceCharge?: number;
  TotalAmount?: number;
  CurrencyIso?: string;
  [key: string]: any;
}

/**
 * Filter out to only two methods:
 * 1. KNET
 * 2. Apple Pay (only one if multiple are returned)
 */
function filterAllowedPaymentMethods(methods: MyFatoorahRawMethod[]): MyFatoorahRawMethod[] {
  if (!Array.isArray(methods)) return [];

  // 1. KNET
  const knet = methods.find((m) => {
    const code = (m.PaymentMethodCode || '').toLowerCase().trim();
    const en = (m.PaymentMethodEn || '').toLowerCase().trim();
    const ar = (m.PaymentMethodAr || '').toLowerCase().trim();
    return (
      code === 'kn' ||
      code === 'knet' ||
      en.includes('knet') ||
      ar.includes('كي نت') ||
      ar.includes('كينت') ||
      m.PaymentMethodId === 1
    );
  });

  // 2. Apple Pay (pick only one)
  const applePayCandidates = methods.filter((m) => {
    const code = (m.PaymentMethodCode || '').toLowerCase().trim();
    const en = (m.PaymentMethodEn || '').toLowerCase().trim();
    const ar = (m.PaymentMethodAr || '').toLowerCase().trim();
    return (
      code === 'ap' ||
      code === 'applepay' ||
      en.includes('apple pay') ||
      en.includes('applepay') ||
      ar.includes('أبل') ||
      ar.includes('ابل')
    );
  });

  const applePay =
    applePayCandidates.find((m) => (m.PaymentMethodEn || '').toLowerCase().trim() === 'apple pay') ||
    applePayCandidates.find((m) => (m.PaymentMethodCode || '').toLowerCase().trim() === 'ap') ||
    applePayCandidates[0];

  const result: MyFatoorahRawMethod[] = [];
  if (knet) {
    result.push({
      ...knet,
      PaymentMethodEn: 'KNET',
      PaymentMethodAr: knet.PaymentMethodAr || 'كي نت',
    });
  }
  if (applePay) {
    result.push({
      ...applePay,
      PaymentMethodEn: 'Apple Pay',
      PaymentMethodAr: 'أبل باي',
    });
  }

  return result;
}

/**
 * GET: Retrieve active payment methods from MyFatoorah InitiatePayment
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = Number(searchParams.get('amount')) || 10;
    const currency = searchParams.get('currency') || 'KWD';

    const { apiUrl, apiKey } = getMyFatoorahConfig();

    try {
      const res = await fetch(`${apiUrl}/v2/InitiatePayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          InvoiceAmount: amount,
          CurrencyIso: currency,
        }),
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.IsSuccess && Array.isArray(data?.Data?.PaymentMethods)) {
          const filtered = filterAllowedPaymentMethods(data.Data.PaymentMethods);
          return NextResponse.json({
            success: true,
            data: {
              payment_methods: filtered,
            },
          });
        }
      }
    } catch (apiErr) {
      console.warn('[myfatoorah-initiate] Upstream initiate error:', apiErr);
    }

    return NextResponse.json(
      {
        success: false,
        data: { payment_methods: [] },
        error: { message: 'Unable to load payment methods. Please contact support.' },
      },
      { status: 502 }
    );
  } catch (err) {
    console.error('[myfatoorah-initiate] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch payment methods' } },
      { status: 500 }
    );
  }
}

/**
 * POST: Execute payment with selected MyFatoorah payment method
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      voucher_id,
      voucher_code,
      secret_code,
      public_token,
      payment_method_id,
      amount,
      currency = 'KWD',
      customer_name,
      customer_phone,
      customer_email,
      language = 'en',
      gift_from,
      recipient_name,
      recipient_phone,
    } = body;

    if (!voucher_id) {
      return NextResponse.json(
        { success: false, error: { message: 'voucher_id is required' } },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Valid amount is required' } },
        { status: 400 }
      );
    }

    const { apiUrl, apiKey } = getMyFatoorahConfig();

    // Determine host origin for callback
    const host =
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host') ||
      '';
    const proto =
      request.headers.get('x-forwarded-proto') ||
      (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');

    let cleanOrigin =
      request.headers.get('origin') ||
      (host ? `${proto}://${host}` : '') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3001';

    cleanOrigin = cleanOrigin.trim().replace(/\/+$/, '');
    if (!cleanOrigin.startsWith('http://') && !cleanOrigin.startsWith('https://')) {
      cleanOrigin = `https://${cleanOrigin}`;
    }

    // Keep CallBackUrl and ErrorUrl strictly under MyFatoorah max length limit (254 chars)
    let callBackUrl = `${cleanOrigin}/gift-voucher/payment-success?voucher_id=${encodeURIComponent(
      String(voucher_id)
    )}&amount=${numericAmount}&currency=${encodeURIComponent(currency)}`;
    let errorUrl = `${cleanOrigin}/payment-links/failed?voucher_id=${encodeURIComponent(
      String(voucher_id)
    )}`;

    // Absolute fallback guard in case origin is unusually long
    if (callBackUrl.length > 254) {
      const fallbackOrigin = (process.env.NEXT_PUBLIC_APP_URL || 'https://ushspa.co').replace(/\/+$/, '');
      callBackUrl = `${fallbackOrigin}/gift-voucher/payment-success?voucher_id=${encodeURIComponent(
        String(voucher_id)
      )}`.slice(0, 254);
    }

    if (errorUrl.length > 254) {
      const fallbackOrigin = (process.env.NEXT_PUBLIC_APP_URL || 'https://ushspa.co').replace(/\/+$/, '');
      errorUrl = `${fallbackOrigin}/payment-links/failed?voucher_id=${encodeURIComponent(
        String(voucher_id)
      )}`.slice(0, 254);
    }

    // Clean phone number
    let cleanMobile = String(customer_phone || '').replace(/\D+/g, '');
    let countryCode = '+965';
    if (cleanMobile.startsWith('965') && cleanMobile.length > 8) {
      cleanMobile = cleanMobile.slice(3);
    }
    if (!cleanMobile) {
      cleanMobile = '90010333';
    }

    const customerReference = String(voucher_code || voucher_id).slice(0, 50);

    const executePayload = {
      PaymentMethodId: Number(payment_method_id) || 1, // Default to KNET (1)
      CustomerName: String(customer_name || 'Valued Guest').slice(0, 50),
      DisplayCurrencyIso: currency,
      MobileCountryCode: countryCode,
      CustomerMobile: cleanMobile.slice(0, 11),
      CustomerEmail: String(customer_email || 'info@ushspa.co').slice(0, 50),
      InvoiceValue: numericAmount,
      CallBackUrl: callBackUrl,
      ErrorUrl: errorUrl,
      Language: language === 'ar' ? 'ar' : 'en',
      CustomerReference: customerReference,
      UserDefinedField: String(voucher_id).slice(0, 50),
      InvoiceItems: [
        {
          ItemName: `USH Spa Gift Voucher - ${customerReference}`.slice(0, 100),
          Quantity: 1,
          UnitPrice: numericAmount,
        },
      ],
    };

    const mfRes = await fetch(`${apiUrl}/v2/ExecutePayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(executePayload),
      cache: 'no-store',
    });

    const mfData = await mfRes.json();

    if (!mfRes.ok || !mfData?.IsSuccess) {
      const errMsg =
        mfData?.Message ||
        (Array.isArray(mfData?.ValidationErrors) && mfData.ValidationErrors.length > 0
          ? mfData.ValidationErrors.map((v: { Name?: string; Error?: string }) => v.Error || v.Name).join(', ')
          : 'Failed to initialize payment gateway.');

      console.warn('[myfatoorah-execute] Error from MyFatoorah:', mfData);
      return NextResponse.json(
        {
          success: false,
          error: { message: errMsg, detail: mfData },
        },
        { status: 400 }
      );
    }

    const invoiceData = mfData.Data || {};
    const paymentUrl = invoiceData.PaymentURL;
    const invoiceId = invoiceData.InvoiceId;

    // Best-effort: update voucher in ushbooknpay with payment details
    try {
      const baseUrl = getBaseApiUrl();
      const ushToken = getUshToken();
      const patchHeaders = {
        'Content-Type': 'application/json',
        'X-USHSPA-TOKEN': ushToken,
        'USHSPA-TOKEN': ushToken,
        'USH_TOKEN': ushToken,
      };
      const patchBody = JSON.stringify({
        payment_id: String(invoiceId),
        payment_url: paymentUrl,
        payment_provider: 'MyFatoorah',
        status: 'payment_pending',
      });

      const patchRes = await fetch(`${baseUrl}/booknpay/api/v1/vouchers/${voucher_id}/`, {
        method: 'PATCH',
        headers: patchHeaders,
        body: patchBody,
        cache: 'no-store',
      });

      if (!patchRes.ok && baseUrl.includes(':8000')) {
        await fetch(`http://127.0.0.1:8003/api/v1/vouchers/${voucher_id}/`, {
          method: 'PATCH',
          headers: patchHeaders,
          body: patchBody,
          cache: 'no-store',
        }).catch(() => {});
      }
    } catch (patchErr) {
      console.warn('[myfatoorah-execute] Failed to update voucher status in upstream:', patchErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        invoice_id: invoiceId,
        payment_url: paymentUrl,
        is_direct: invoiceData.IsDirectPayment,
        customer_reference: customerReference,
        gateway: 'MyFatoorah',
      },
    });
  } catch (err) {
    console.error('[myfatoorah-execute] Unhandled error:', err);
    return NextResponse.json(
      {
        success: false,
        error: { message: err instanceof Error ? err.message : 'Internal payment error' },
      },
      { status: 500 }
    );
  }
}

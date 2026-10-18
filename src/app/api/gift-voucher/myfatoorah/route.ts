import { NextRequest, NextResponse } from 'next/server';

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

// Fallback payment methods if MyFatoorah InitiatePayment is unavailable
const FALLBACK_PAYMENT_METHODS = [
  {
    PaymentMethodId: 1,
    PaymentMethodEn: 'KNET',
    PaymentMethodAr: 'كي نت',
    PaymentMethodCode: 'kn',
    ImageUrl: 'https://demo.myfatoorah.com/imgs/payment-methods/kn.png',
    IsDirectPayment: false,
    ServiceCharge: 0,
    TotalAmount: 0,
    CurrencyIso: 'KWD',
  },
  {
    PaymentMethodId: 2,
    PaymentMethodEn: 'Credit / Debit Card (VISA / Mastercard)',
    PaymentMethodAr: 'فيزا / ماستركارد',
    PaymentMethodCode: 'vm',
    ImageUrl: 'https://demo.myfatoorah.com/imgs/payment-methods/vm.png',
    IsDirectPayment: false,
    ServiceCharge: 0,
    TotalAmount: 0,
    CurrencyIso: 'KWD',
  },
  {
    PaymentMethodId: 11,
    PaymentMethodEn: 'Apple Pay',
    PaymentMethodAr: 'أبل باي',
    PaymentMethodCode: 'ap',
    ImageUrl: 'https://demo.myfatoorah.com/imgs/payment-methods/ap.png',
    IsDirectPayment: false,
    ServiceCharge: 0,
    TotalAmount: 0,
    CurrencyIso: 'KWD',
  },
];

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
          return NextResponse.json({
            success: true,
            data: {
              payment_methods: data.Data.PaymentMethods,
            },
          });
        }
      }
    } catch (apiErr) {
      console.warn('[myfatoorah-initiate] Upstream initiate error:', apiErr);
    }

    // Return fallback list with updated amount
    return NextResponse.json({
      success: true,
      data: {
        payment_methods: FALLBACK_PAYMENT_METHODS.map((m) => ({
          ...m,
          TotalAmount: amount,
          CurrencyIso: currency,
        })),
      },
    });
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
      payment_method_id,
      amount,
      currency = 'KWD',
      customer_name,
      customer_phone,
      customer_email,
      language = 'en',
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
    const origin =
      request.headers.get('origin') ||
      request.headers.get('x-forwarded-host') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3001';

    const cleanOrigin = origin.startsWith('http') ? origin : `https://${origin}`;

    const callBackUrl = `${cleanOrigin}/gift-voucher/payment-success?voucher_id=${encodeURIComponent(
      voucher_id
    )}&voucher_code=${encodeURIComponent(voucher_code || '')}&amount=${numericAmount}&currency=${encodeURIComponent(currency)}`;
    const errorUrl = `${cleanOrigin}/payment-links/failed?voucher_id=${encodeURIComponent(
      voucher_id
    )}&amount=${numericAmount}&currency=${encodeURIComponent(currency)}`;

    // Clean phone number
    let cleanMobile = String(customer_phone || '').replace(/\D+/g, '');
    let countryCode = '+965';
    if (cleanMobile.startsWith('965') && cleanMobile.length > 8) {
      cleanMobile = cleanMobile.slice(3);
    }
    if (!cleanMobile) {
      cleanMobile = '90010333';
    }

    const customerReference = voucher_code || voucher_id;

    const executePayload = {
      PaymentMethodId: Number(payment_method_id) || 1, // Default to KNET (1)
      CustomerName: customer_name || 'Valued Guest',
      DisplayCurrencyIso: currency,
      MobileCountryCode: countryCode,
      CustomerMobile: cleanMobile,
      CustomerEmail: customer_email || 'info@ushspa.co',
      InvoiceValue: numericAmount,
      CallBackUrl: callBackUrl,
      ErrorUrl: errorUrl,
      Language: language === 'ar' ? 'ar' : 'en',
      CustomerReference: customerReference,
      UserDefinedField: voucher_id,
      InvoiceItems: [
        {
          ItemName: `USH Spa Gift Voucher - ${customerReference}`,
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
      const baseUrl = (
        process.env.BASE_TRACE_API_URL ||
        process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
        'http://127.0.0.1:8000'
      ).replace(/\/+$/, '');

      const ushToken = process.env.USH_TOKEN || 'hello-world';
      await fetch(`${baseUrl}/booknpay/api/v1/vouchers/${voucher_id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-USHSPA-TOKEN': ushToken,
        },
        body: JSON.stringify({
          payment_id: String(invoiceId),
          payment_url: paymentUrl,
          payment_provider: 'MyFatoorah',
          status: 'payment_pending',
        }),
        cache: 'no-store',
      });
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

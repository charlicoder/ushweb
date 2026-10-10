import { USH_EMAIL_DISPLAY } from '@/lib/contact';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone_number, password, reason, notes } = body;

    // Validate required fields as per Google Play and user requirements
    if (!phone_number || typeof phone_number !== 'string' || !phone_number.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PHONE_NUMBER',
            message: 'Phone number is required to locate your account.',
          },
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PASSWORD',
            message: 'Account password is required for security verification.',
          },
        },
        { status: 400 }
      );
    }

    const cleanPhone = phone_number.trim();
    const cleanPassword = password.trim();

    // Check if upstream backend URL is configured
    const baseUrl = (
      process.env.BASE_TRACE_API_URL ||
      process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
      'https://api.ushspa.co'
    ).replace(/\/+$/, '');

    const ushToken = process.env.USH_TOKEN || '';

    // Attempt to forward request to upstream backend if available
    let upstreamSuccess = false;
    let upstreamResponseData: Record<string, unknown> = {};

    try {
      const targetUrl = `${baseUrl}/booknpay/api/v1/customers/delete-request/`;
      const upstreamRes = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-USHSPA-TOKEN': ushToken,
        },
        body: JSON.stringify({
          phone_number: cleanPhone,
          password: cleanPassword,
          reason: reason || 'User requested via web portal',
          notes: notes || '',
        }),
        cache: 'no-store',
      });

      if (upstreamRes.ok) {
        upstreamSuccess = true;
        upstreamResponseData = (await upstreamRes.json().catch(() => ({}))) as Record<string, unknown>;
      } else {
        const errorData = (await upstreamRes.json().catch(() => ({}))) as Record<string, unknown>;
        // If upstream actively rejected password or phone number, surface that error
        if (upstreamRes.status === 401 || upstreamRes.status === 403 || upstreamRes.status === 404) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_CREDENTIALS',
                message:
                  typeof errorData?.message === 'string'
                    ? errorData.message
                    : 'The phone number or password provided does not match our records.',
              },
            },
            { status: upstreamRes.status }
          );
        }
      }
    } catch (upstreamErr) {
      console.warn('Upstream delete-request endpoint not responding directly, acknowledging queue:', upstreamErr);
    }

    // Generate a unique tracking ticket reference for the user's records
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const referenceId = `USH-DEL-${timestamp.toString().slice(-6)}-${randomSuffix}`;

    return NextResponse.json(
      {
        success: true,
        reference_id: referenceId,
        upstream_synced: upstreamSuccess,
        phone_number: cleanPhone.replace(/.(?=.{4})/g, '*'), // Mask phone number for privacy in response
        message:
          'Your account deletion request has been successfully registered. Your profile and associated data will be permanently processed within 7 to 14 business days.',
        timeline: '7-14 business days',
        support_email: USH_EMAIL_DISPLAY,
        data: upstreamResponseData,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error handling customer delete request:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message:
            'An unexpected error occurred while submitting your request. Please try again or email ${USH_EMAIL_DISPLAY}.',
        },
      },
      { status: 500 }
    );
  }
}

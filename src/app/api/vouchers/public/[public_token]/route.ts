import { NextRequest, NextResponse } from 'next/server';
import { getBaseApiUrl, getUshToken } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ public_token: string }>;
}

/**
 * Resilient fetch with single-retry for transient socket drops (ECONNRESET, socket hang up).
 */
async function fetchWithRetry(url: string, init: RequestInit, retries = 1): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err: unknown) {
      lastError = err;
      const errorObj = err as { code?: string; cause?: { code?: string }; message?: string };
      const isSocketError =
        errorObj?.code === 'ECONNRESET' ||
        errorObj?.cause?.code === 'ECONNRESET' ||
        (typeof errorObj?.message === 'string' &&
          (errorObj.message.includes('socket hang up') || errorObj.message.includes('ECONNRESET')));

      if (attempt < retries && isSocketError) {
        await new Promise((resolve) => setTimeout(resolve, 80));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { public_token } = await params;
    if (!public_token) {
      return NextResponse.json(
        { success: false, error: { message: 'Missing public token' } },
        { status: 400 }
      );
    }

    const baseUrl = getBaseApiUrl();
    const ushToken = getUshToken();
    const authHeader =
      request.headers.get('Authorization') || request.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      Accept: 'application/json',
      Connection: 'close',
      'X-USHSPA-TOKEN': ushToken,
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const primaryUrl = `${baseUrl}/booknpay/api/v1/vouchers/public/${encodeURIComponent(public_token)}/`;
    const candidateUrls: string[] = [primaryUrl];

    // If upstream gateway (api.ushspa.co) encounters network issues or resets,
    // fallback directly to local ushbooknpay container on port 8003 in production.
    if (!baseUrl.includes('127.0.0.1:8003') && !baseUrl.includes('localhost:8003')) {
      candidateUrls.push(`http://127.0.0.1:8003/api/v1/vouchers/public/${encodeURIComponent(public_token)}/`);
    }

    let lastRes: Response | null = null;
    let lastError: unknown = null;

    for (let i = 0; i < candidateUrls.length; i++) {
      const targetUrl = candidateUrls[i];
      try {
        const res = await fetchWithRetry(targetUrl, {
          method: 'GET',
          headers,
          cache: 'no-store',
        });

        if (res.ok || (res.status !== 502 && res.status !== 503 && res.status !== 504)) {
          const data = await res.json().catch(() => ({}));
          return NextResponse.json(data, {
            status: res.status,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          });
        }

        lastRes = res;
      } catch (err) {
        lastError = err;
        if (i < candidateUrls.length - 1) {
          console.warn(`[public-voucher] Connection failed to ${targetUrl}, trying fallback...`, err);
          continue;
        }
      }
    }

    if (lastRes) {
      const data = await lastRes.json().catch(() => ({}));
      return NextResponse.json(data, {
        status: lastRes.status,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    throw lastError || new Error('Failed to reach voucher service');
  } catch (error) {
    console.error('[public-voucher] Error fetching public voucher:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Voucher service is temporarily unavailable',
        },
      },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { public_token } = await params;
    if (!public_token) {
      return NextResponse.json(
        { success: false, error: { message: 'Missing public token' } },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const baseUrl = getBaseApiUrl();
    const ushToken = getUshToken();
    const authHeader =
      request.headers.get('Authorization') || request.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Connection: 'close',
      'X-USHSPA-TOKEN': ushToken,
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const primaryUrl = `${baseUrl}/booknpay/api/v1/vouchers/public/${encodeURIComponent(public_token)}/`;
    const candidateUrls: string[] = [primaryUrl];

    if (!baseUrl.includes('127.0.0.1:8003') && !baseUrl.includes('localhost:8003')) {
      candidateUrls.push(`http://127.0.0.1:8003/api/v1/vouchers/public/${encodeURIComponent(public_token)}/`);
    }

    let lastRes: Response | null = null;
    let lastError: unknown = null;

    for (let i = 0; i < candidateUrls.length; i++) {
      const targetUrl = candidateUrls[i];
      try {
        const res = await fetchWithRetry(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          cache: 'no-store',
        });

        if (res.ok || (res.status !== 502 && res.status !== 503 && res.status !== 504)) {
          const data = await res.json().catch(() => ({}));
          return NextResponse.json(data, {
            status: res.status,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          });
        }

        lastRes = res;
      } catch (err) {
        lastError = err;
        if (i < candidateUrls.length - 1) {
          console.warn(`[public-voucher-verify] Connection failed to ${targetUrl}, trying fallback...`, err);
          continue;
        }
      }
    }

    if (lastRes) {
      const data = await lastRes.json().catch(() => ({}));
      return NextResponse.json(data, {
        status: lastRes.status,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    throw lastError || new Error('Failed to reach voucher service');
  } catch (error) {
    console.error('[public-voucher-verify] Error verifying public voucher:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Voucher service is temporarily unavailable',
        },
      },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}

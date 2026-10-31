import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Block automated scanners / bot probes targeting React Server Actions.
  // ushweb uses dedicated REST Route Handlers (/api/*) and does not use Server Actions.
  // Scanners send requests with arbitrary 'Next-Action' IDs which crash Next.js internal dispatcher.
  if (request.headers.has('next-action')) {
    return new NextResponse(
      JSON.stringify({ error: 'Server Actions not supported' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export { proxy };

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

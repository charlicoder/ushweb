import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/gift-voucher',
        permanent: false,
      },
    ];
  },

  async rewrites() {
    const baseUrl = (
      process.env.BASE_API ||
      process.env.NEXT_PUBLIC_BASE_API ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.BASE_TRACE_API_URL ||
      process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
      'http://127.0.0.1:8000'
    ).trim().replace(/\/+$/, '');

    return [
      {
        source: '/booknpay/api/:path*',
        destination: `${baseUrl}/booknpay/api/:path*`,
      },
      {
        source: '/uauth/api/:path*',
        destination: `${baseUrl}/uauth/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply CORS headers to the Next.js API proxy routes so that browsers
        // don't block responses when the front-end is served from a different
        // origin (e.g. during staging or behind a CDN in production).
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://api.ushspa.co' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  // Allow cross-origin requests to Next.js dev-server resources (/_next/static/*, /_next/hmr)
  // from dev hosts and local network devices.
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '10.131.22.93',
    '10.197.94.222',
    '192.168.8.81',
  ],
};

export default nextConfig;


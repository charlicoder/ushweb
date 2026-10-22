/**
 * API configuration and helpers for ushweb.
 * Reads BASE_API / NEXT_PUBLIC_BASE_API from .env with fallbacks.
 */

export function getBaseApiUrl(): string {
  const url = (
    process.env.BASE_API ||
    process.env.NEXT_PUBLIC_BASE_API ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.BASE_TRACE_API_URL ||
    process.env.NEXT_PUBLIC_BASE_TRACE_API_URL ||
    'http://127.0.0.1:8000'
  )
    .trim()
    .replace(/\/+$/, '');

  return url;
}

export function getUshToken(): string {
  return (
    process.env.USH_TOKEN ||
    process.env.NEXT_PUBLIC_USH_TOKEN ||
    process.env.API_APP_TOKEN ||
    'hello-world'
  ).trim();
}

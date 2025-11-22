/**
 * ========================================
 * URL UTILITIES
 * ========================================
 * 
 * Central place for URL management across the site.
 * Uses NEXT_PUBLIC_BASE_URL environment variable.
 */

/**
 * Get the base URL of the site
 * Removes trailing slash to ensure consistency
 */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return url.replace(/\/$/, ''); // Remove trailing slash
}

/**
 * Get an absolute URL for a given path
 * @param path - The path (with or without leading slash)
 * @returns Full absolute URL
 * 
 * @example
 * getAbsoluteUrl('/emergency-map') // => 'https://gil-hameever.vercel.app/emergency-map'
 * getAbsoluteUrl('emergency-map') // => 'https://gil-hameever.vercel.app/emergency-map'
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get commonly used URLs
 */
export const siteUrls = {
  home: () => getAbsoluteUrl('/'),
  emergencyMap: () => getAbsoluteUrl('/emergency-map'),
  thankYou: () => getAbsoluteUrl('/thank-you'),
  leadGift8: () => getAbsoluteUrl('/lead-gift-8'),
  instagram: 'https://www.instagram.com/inbal_daphna/',
};

/**
 * Client-side only: Get the base URL
 * Use this in client components
 */
export function getClientBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // In browser
    return `${window.location.protocol}//${window.location.host}`;
  }
  // Fallback to env variable
  return getBaseUrl();
}


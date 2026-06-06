'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const DESTINATION = 'https://nivbook.co.il/product/%d7%9c%d7%90-%d7%92%d7%91%d7%a8%d7%aa-%d7%92%d7%99%d7%91%d7%95%d7%a8%d7%94/';
const SLUG = 'sefer';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function RedirectCore() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmParams: Record<string, string> = {};
    UTM_KEYS.forEach(key => {
      const val = searchParams.get(key);
      if (val) utmParams[key] = val;
    });

    const destUrl = new URL(DESTINATION);
    Object.entries(utmParams).forEach(([k, v]) => destUrl.searchParams.set(k, v));

    // Meta Pixel — ViewContent on the book
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: 'לא גברת גיבורה',
        content_category: 'ספר',
        content_type: 'product',
      });
    }

    // Google Analytics — outbound click event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'book_redirect', {
        event_category: 'outbound',
        event_label: 'לא-גברת-גיבורה',
        ...utmParams,
      });
    }

    // Log to Supabase (fire-and-forget)
    fetch('/api/track-redirect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: SLUG,
        destination: destUrl.href,
        referrer: document.referrer,
        ...utmParams,
      }),
    }).catch(() => {});

    // Short delay so pixel has time to fire before navigation
    const timer = setTimeout(() => {
      window.location.href = destUrl.href;
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return null;
}

export default function SeferPage() {
  return (
    <Suspense>
      <RedirectCore />
    </Suspense>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Don't show navigation on landing pages
  const hideNavigationPaths = [
    '/gibora',
    '/gibora/coming-soon',
    '/emergency-map-access',
    '/secret-report-access',
    '/gift-access',
    '/walking-medicine-access',
    '/good-sleep-access',
    '/brain-fog-access',
    '/sharp-memory-access',
    '/heroine-checklist-landing',
    '/heroine-checklist-thank-you',
    '/hot-flash-zoom-landing',
    '/sleep-guide-landing',
    '/emergency-map-guide-landing',
    '/strength-home-landing',
    '/protein-guide-landing',
    '/brain-fog-guide-landing',
    '/walking-guide-landing',
    '/morning-reset-landing',
    '/mood-guide-landing',
    '/identity-guide-landing',
    '/energy-guide-landing',
    '/doctor-guide-landing',
    '/confidence-guide-landing',
    '/who-am-i-guide-landing',
    '/second-half-guide-landing',
    '/relationship-guide-landing',
    '/courage-guide-landing',
  ];
  
  const shouldHideNavigation =
    hideNavigationPaths.some(path => pathname === path) ||
    pathname?.startsWith('/admin') === true;

  if (shouldHideNavigation) {
    return null;
  }

  return <Navigation />;
}

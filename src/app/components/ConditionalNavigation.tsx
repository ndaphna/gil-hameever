'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Don't show navigation on landing pages
  const hideNavigationPaths = [
    '/emergency-map-access',
    '/secret-report-access',
    '/gift-access',
  ];
  
  const shouldHideNavigation = hideNavigationPaths.some(path => pathname === path);
  
  if (shouldHideNavigation) {
    return null;
  }
  
  return <Navigation />;
}

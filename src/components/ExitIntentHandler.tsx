'use client';

import { useState, useEffect, useRef } from 'react';
import ExitIntentPopup from './ExitIntentPopup';

export default function ExitIntentHandler() {
  const [showPopup, setShowPopup] = useState(false);
  const hasShownRef = useRef(false);
  const timeOnPageRef = useRef(Date.now());
  const scrollTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Don't show popup on roadmap page or landing pages
    const currentPath = window.location.pathname;
    const hidePopupPaths = [
      '/menopause-roadmap',
      '/emergency-map-access',
      '/secret-report-access',
      '/gift-access',
      '/walking-medicine-access',
      '/good-sleep-access',
      '/brain-fog-access',
    ];
    
    if (hidePopupPaths.includes(currentPath)) {
      return;
    }
    
    // Auto-clear storage in development mode for easier testing
    if (process.env.NODE_ENV === 'development') {
      const shouldClear = sessionStorage.getItem('exitIntentClearStorage');
      if (!shouldClear) {
        // Clear on first load in dev mode
        localStorage.removeItem('exitIntentDismissed');
        localStorage.removeItem('exitIntentSignedUp');
        sessionStorage.removeItem('exitIntentShown');
        sessionStorage.setItem('exitIntentClearStorage', 'true');
      }
    }
    
    // Improved mobile detection: check for touch support and screen size
    const isMobile = 
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768);

    // Check if user has already signed up (hasSubscribed flag - never show again)
    const hasSubscribed = localStorage.getItem('exitIntentSignedUp');
    if (hasSubscribed === 'true') {
      return;
    }

    // Check if we've already shown the popup in this session
    const hasShownInSession = sessionStorage.getItem('exitIntentShown');
    if (hasShownInSession === 'true') {
      return;
    }

    // Check if user has dismissed it recently (within last 7 days)
    const dismissedDate = localStorage.getItem('exitIntentDismissed');
    if (dismissedDate) {
      const dismissed = new Date(dismissedDate);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissed.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Initialize time on page
    timeOnPageRef.current = Date.now();

    const triggerPopup = () => {
      if (!hasShownRef.current) {
        hasShownRef.current = true;
        setShowPopup(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    if (isMobile) {
      // Mobile logic: trigger after 20 seconds OR after scrolling 50% of the page
      
      // Trigger after 20 seconds
      const timeTriggerRef = { current: setTimeout(() => {
        if (!hasShownRef.current) {
          triggerPopup();
        }
      }, 20000) };

      // Trigger after scrolling 50% of the page
      const handleScroll = () => {
        if (scrollTriggeredRef.current || hasShownRef.current) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollPercentage >= 50) {
          scrollTriggeredRef.current = true;
          clearTimeout(timeTriggerRef.current); // Cancel time trigger if scroll triggers first
          triggerPopup();
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup
      return () => {
        clearTimeout(timeTriggerRef.current);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // Desktop logic: exit-intent detection (mouseleave)
      // Main exit-intent detection: when mouse leaves the document
      // Only trigger if clientY <= 0 (mouse leaving from top of viewport)
      const handleMouseLeave = (e: MouseEvent) => {
        // Safety delay: only activate after 10 seconds on page
        const timeOnPage = Date.now() - timeOnPageRef.current;
        if (timeOnPage < 10000) {
          return;
        }

        // Only trigger if mouse is leaving from top (clientY <= 0)
        if (e.clientY <= 0) {
          triggerPopup();
        }
      };

      // Add event listener only after 10 seconds
      const timeoutId = setTimeout(() => {
        document.addEventListener('mouseleave', handleMouseLeave);
      }, 10000);

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    // Remember dismissal for 7 days (save timestamp)
    localStorage.setItem('exitIntentDismissed', new Date().toISOString());
  };

  const handleSignupSuccess = () => {
    // Mark as subscribed (hasSubscribed flag) - never show again
    localStorage.setItem('exitIntentSignedUp', 'true');
    setShowPopup(false);
  };

  return <ExitIntentPopup isOpen={showPopup} onClose={handleClose} onSignupSuccess={handleSignupSuccess} />;
}

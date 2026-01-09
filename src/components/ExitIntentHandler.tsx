'use client';

import { useState, useEffect, useRef } from 'react';
import ExitIntentPopup from './ExitIntentPopup';

export default function ExitIntentHandler() {
  const [showPopup, setShowPopup] = useState(false);
  const hasShownRef = useRef(false);
  const timeOnPageRef = useRef(Date.now());

  useEffect(() => {
    // Don't show on mobile devices
    if (typeof window === 'undefined') return;
    
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
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return;
    }

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

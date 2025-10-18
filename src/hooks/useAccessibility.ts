import { useEffect, useCallback } from 'react';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  cursorSize: 'normal' | 'large';
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

export const useAccessibility = () => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip to main content with Alt + M
    if (event.altKey && event.key === 'm') {
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Skip to accessibility panel with Alt + A
    if (event.altKey && event.key === 'a') {
      event.preventDefault();
      const accessibilityBubble = document.querySelector('.accessibility-bubble') as HTMLElement;
      if (accessibilityBubble) {
        accessibilityBubble.focus();
        accessibilityBubble.click();
      }
    }

    // Close accessibility panel with Escape
    if (event.key === 'Escape') {
      const panel = document.querySelector('.accessibility-panel');
      if (panel) {
        const closeButton = panel.querySelector('.accessibility-close') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }
  }, []);

  // Handle focus management
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  }, []);

  // Announce changes to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Apply accessibility settings
  const applyAccessibilitySettings = useCallback((settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Remove existing classes
    root.classList.remove(
      'font-normal', 'font-large', 'font-extra-large',
      'contrast-normal', 'contrast-high',
      'cursor-normal', 'cursor-large',
      'screen-reader-mode', 'keyboard-navigation', 'reduced-motion'
    );
    
    // Apply new classes
    root.classList.add(
      `font-${settings.fontSize}`,
      `contrast-${settings.contrast}`,
      `cursor-${settings.cursorSize}`
    );
    
    if (settings.screenReader) {
      root.classList.add('screen-reader-mode');
    }
    
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    }
    
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    }

    // Announce changes
    announceToScreenReader('הגדרות נגישות עודכנו');
  }, [announceToScreenReader]);

  // Setup keyboard navigation
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Setup focus management for modals and panels
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      // If focus is on accessibility panel, trap focus
      if (target.closest('.accessibility-panel')) {
        const panel = target.closest('.accessibility-panel') as HTMLElement;
        if (panel) {
          trapFocus(panel);
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [trapFocus]);

  return {
    applyAccessibilitySettings,
    announceToScreenReader,
    trapFocus
  };
};

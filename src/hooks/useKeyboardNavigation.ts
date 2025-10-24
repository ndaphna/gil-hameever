import { useEffect, useCallback } from 'react';

export const useKeyboardNavigation = () => {
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Alt + M - Skip to main content
    if (event.altKey && event.key === 'm') {
      event.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Alt + A - Open accessibility panel
    if (event.altKey && event.key === 'a') {
      event.preventDefault();
      const accessibilityBubble = document.querySelector('.accessibility-bubble') as HTMLElement;
      if (accessibilityBubble) {
        accessibilityBubble.focus();
        accessibilityBubble.click();
      }
    }

    // Alt + H - Go to home page
    if (event.altKey && event.key === 'h') {
      event.preventDefault();
      window.location.href = '/';
    }

    // Alt + N - Go to navigation
    if (event.altKey && event.key === 'n') {
      event.preventDefault();
      const navLinks = document.querySelector('.nav-links') as HTMLElement;
      if (navLinks) {
        const firstLink = navLinks.querySelector('button') as HTMLElement;
        if (firstLink) {
          firstLink.focus();
        }
      }
    }

    // Escape - Close any open modals or menus
    if (event.key === 'Escape') {
      // Close accessibility panel
      const accessibilityPanel = document.querySelector('.accessibility-panel');
      if (accessibilityPanel) {
        const closeButton = accessibilityPanel.querySelector('.accessibility-close') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }

      // Close mobile menu
      const mobileMenu = document.querySelector('.nav-links.active');
      if (mobileMenu) {
        const hamburgerButton = document.querySelector('.hamburger') as HTMLElement;
        if (hamburgerButton) {
          hamburgerButton.click();
        }
      }

      // Close dropdown menus
      const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
      openDropdowns.forEach(dropdown => {
        if (dropdown instanceof HTMLElement) {
          dropdown.click();
        }
      });
    }

    // Arrow keys for navigation
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const activeElement = document.activeElement as HTMLElement;
      
      // If we're in a dropdown menu, handle arrow navigation
      if (activeElement?.closest('.nav-dropdown-menu')) {
        event.preventDefault();
        const menuItems = Array.from(activeElement.closest('.nav-dropdown-menu')?.querySelectorAll('button') || []);
        const currentIndex = menuItems.indexOf(activeElement);
        
        if (event.key === 'ArrowDown') {
          const nextIndex = (currentIndex + 1) % menuItems.length;
          (menuItems[nextIndex] as HTMLElement)?.focus();
        } else {
          const prevIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
          (menuItems[prevIndex] as HTMLElement)?.focus();
        }
      }
    }

    // Enter and Space for activating buttons
    if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLElement) {
      if (event.target.tagName === 'BUTTON' || event.target.getAttribute('role') === 'button') {
        event.preventDefault();
        event.target.click();
      }
    }
  }, []);

  // Setup keyboard navigation
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus management for modals and dropdowns
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

  // Announce keyboard shortcuts to screen readers
  const announceKeyboardShortcuts = useCallback(() => {
    const shortcuts = [
      'Alt + M - דלג לתוכן הראשי',
      'Alt + A - פתח הגדרות נגישות',
      'Alt + H - עבור לדף הבית',
      'Alt + N - עבור לתפריט ניווט',
      'Escape - סגור תפריטים פתוחים'
    ];

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'קיצורי מקלדת זמינים: ' + shortcuts.join(', ');
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 3000);
  }, []);

  return {
    trapFocus,
    announceKeyboardShortcuts
  };
};


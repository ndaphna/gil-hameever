'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import './Navigation.css';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setUserEmail] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if user is on internal pages
  const isInternalPage = pathname?.startsWith('/dashboard') || 
                        pathname?.startsWith('/chat') || 
                        pathname?.startsWith('/journal') || 
                        pathname?.startsWith('/insights') || 
                        pathname?.startsWith('/profile');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = (href: string) => {
    closeMenu();
    // הוסף עיכוב קטן כדי שהתפריט יסגר לפני הניווט
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Mark as hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setIsLoggedIn(!!session);
        setUserEmail(session?.user?.email || null);
      } catch (error) {
        console.warn('Auth check failed:', error);
        setIsLoggedIn(false);
        setUserEmail(null);
      }
    }
    
    checkAuth();

    // Subscribe to auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsLoggedIn(!!session);
        setUserEmail(session?.user?.email || null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.warn('Auth subscription failed:', error);
    }
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth <= 1049) {
      document.body.style.overflow = 'hidden';
    } else if (!isMenuOpen) {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      if (!isMenuOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [sidebarOpen, isMenuOpen]);

  const handleLogout = async () => {
    // Prevent double-click or multiple simultaneous logout attempts
    if (isLoggingOut) {
      console.log('⚠️ Logout already in progress, ignoring...');
      return;
    }
    
    setIsLoggingOut(true);
    
    try {
      console.log('🚪 Starting logout process...');
      
      // Close menu first
      closeMenu();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error signing out:', error);
        // Even if there's an error, try to clear local state
      } else {
        console.log('✅ Successfully signed out from Supabase');
      }
      
      // Verify session is actually cleared
      const { data: { session: verifySession } } = await supabase.auth.getSession();
      if (verifySession) {
        console.warn('⚠️ Session still exists after signOut, forcing clear...');
        // Force clear by removing all auth data
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (forceError) {
          console.warn('⚠️ Force signOut failed:', forceError);
        }
      } else {
        console.log('✅ Session verified as cleared');
      }
      
      // Clear any Supabase-related data from localStorage
      try {
        const supabaseKeys = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.startsWith('sb-') || key.includes('auth')
        );
        supabaseKeys.forEach(key => {
          localStorage.removeItem(key);
        });
        console.log(`🧹 Cleared ${supabaseKeys.length} Supabase keys from localStorage`);
      } catch (storageError) {
        console.warn('⚠️ Error clearing localStorage:', storageError);
      }
      
      // Update local state immediately
      setIsLoggedIn(false);
      setUserEmail(null);
      
      // Wait a moment to ensure state is cleared and UI updates
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force page refresh to ensure clean state
      // Use window.location.replace to prevent back button issues
      window.location.replace('/');
      
    } catch (error) {
      console.error('❌ Unexpected error during logout:', error);
      // Even on error, try to redirect and clear state
      setIsLoggedIn(false);
      setUserEmail(null);
      
      // Clear localStorage on error too
      try {
        const supabaseKeys = Object.keys(localStorage).filter(key => 
          key.includes('supabase') || key.startsWith('sb-') || key.includes('auth')
        );
        supabaseKeys.forEach(key => localStorage.removeItem(key));
      } catch (e) {
        // Ignore
      }
      
      window.location.replace('/');
    } finally {
      // Reset flag after a delay (in case redirect doesn't happen)
      setTimeout(() => setIsLoggingOut(false), 1000);
    }
  };

  return (
    <>
      {/* Sidebar for internal system - show for logged in users */}
      {isHydrated && isLoggedIn && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      
      <header className="main-header">
        {/* Overlay for mobile menu - מוצב לפני התפריט */}
        {isMenuOpen && (
          <div 
            className="nav-overlay" 
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      
      <nav className="main-nav" role="navigation" aria-label="ניווט ראשי">
        <div className="nav-container">
          {/* Logo/Brand */}
          <div className="nav-brand">
            <Link href="/" onClick={closeMenu} aria-label="מנופאוזית וטוב לה - דף הבית" className="nav-brand-link">
              <img src="/logo.png" alt="גיל המעבר" className="nav-logo" />
              <span className="nav-brand-text">מנופאוזית וטוב לה</span>
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="mobile-menu-buttons">
            {/* Internal System Menu Button - רק למשתמשים מחוברים */}
            {isHydrated && isLoggedIn && (
              <button 
                className="internal-menu-btn"
                onClick={toggleSidebar}
                aria-label="תפריט מערכת פנימית"
                title="תפריט מערכת פנימית"
              >
                ⚙️
              </button>
            )}
            
            {/* Hamburger Button */}
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="תפריט ניווט"
              aria-expanded={isMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} role="menubar" aria-label="תפריט ניווט">
            {!isHydrated ? (
              // תפריט ברירת מחדל עד שה-hydration יסתיים
              <>
                <button onClick={() => handleLinkClick('/')} className="nav-link-btn" role="menuitem" aria-label="עבור לדף הבית">דף הבית</button>
                <button onClick={() => handleLinkClick('/articles')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד מאמרים">מאמרים</button>
                <button onClick={() => handleLinkClick('/about')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד אודות">אודות</button>
                <button onClick={() => handleLinkClick('/book-preview')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד על הספר">על הספר שלי</button>
                <button onClick={() => handleLinkClick('/inspiration-waves')} className="nav-link-btn" role="menuitem" aria-label="הירשמי לגלי השראה">הירשמי לגלי השראה</button>
              </>
            ) : (
              // תפריט ציבורי למשתמשים לא מחוברים
              <>
                <button onClick={() => handleLinkClick('/')} className="nav-link-btn" role="menuitem" aria-label="עבור לדף הבית">דף הבית</button>
                <button onClick={() => handleLinkClick('/articles')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד מאמרים">מאמרים</button>
                <button onClick={() => handleLinkClick('/about')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד אודות">אודות</button>
                <button onClick={() => handleLinkClick('/book-preview')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד על הספר">על הספר שלי</button>
                <button onClick={() => handleLinkClick('/inspiration-waves')} className="nav-link-btn" role="menuitem" aria-label="הירשמי לגלי השראה">הירשמי לגלי השראה</button>
                
                {/* כפתור אזור אישי - רק למשתמשים מחוברים */}
                {isHydrated && isLoggedIn && (
                  <button onClick={() => handleLinkClick('/dashboard')} className="nav-link-btn personal-area-btn" role="menuitem" aria-label="עבור לאזור האישי">
                    <span aria-hidden="true">🏠</span> אזור אישי
                  </button>
                )}
              </>
            )}
          </div>

          {/* Social Icons - Always visible */}
          <div className="nav-social-icons">
            <a 
              href="https://www.facebook.com/profile.php?id=61560682721423&locale=he_IL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="עקוב אחרינו בפייסבוק"
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/inbal_daphna/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="עקוב אחרינו באינסטגרם"
            >
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Auth Button - Dynamic based on login status */}
          <div className={`nav-auth ${isMenuOpen ? 'active' : ''}`}>
            {/* Social Icons - Show in mobile menu */}
            <div className="nav-social-icons-mobile">
              <a 
                href="https://www.facebook.com/profile.php?id=61560682721423&locale=he_IL" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="עקוב אחרינו בפייסבוק"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/inbal_daphna/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="עקוב אחרינו באינסטגרם"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            {!isHydrated ? (
              <button onClick={() => handleLinkClick('/coming-soon')} className="btn btn-primary" aria-label="המרחב שלי">
                המרחב שלי
              </button>
            ) : isLoggedIn ? (
              <button 
                className="btn btn-secondary" 
                onClick={handleLogout} 
                disabled={isLoggingOut}
                aria-label="התנתקות מהאתר"
              >
                {isLoggingOut ? 'מתנתקת...' : 'התנתקות'}
              </button>
            ) : (
              <button onClick={() => handleLinkClick('/coming-soon')} className="btn btn-primary" aria-label="המרחב שלי">
                המרחב שלי
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}


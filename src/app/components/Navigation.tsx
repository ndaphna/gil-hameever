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
    // Logout from Supabase
    await supabase.auth.signOut();
    // Update local state immediately
    setIsLoggedIn(false);
    setUserEmail(null);
    // Force page refresh to ensure clean state
    window.location.href = '/';
    closeMenu();
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
            <Link href="/" onClick={closeMenu} aria-label="מנופאוזית וטוב לה - דף הבית">
              מנופאוזית וטוב לה
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
                <button onClick={() => handleLinkClick('/about')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד אודות">אודות</button>
                <button onClick={() => handleLinkClick('/pricing')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד מחירים">מחירים</button>
              </>
            ) : (
              // תפריט ציבורי למשתמשים לא מחוברים
              <>
                <button onClick={() => handleLinkClick('/')} className="nav-link-btn" role="menuitem" aria-label="עבור לדף הבית">דף הבית</button>
                <button onClick={() => handleLinkClick('/about')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד אודות">אודות</button>
                <button onClick={() => handleLinkClick('/pricing')} className="nav-link-btn" role="menuitem" aria-label="עבור לעמוד מחירים">מחירים</button>
                
                {/* כפתור אזור אישי - רק למשתמשים מחוברים */}
                {isHydrated && isLoggedIn && (
                  <button onClick={() => handleLinkClick('/dashboard')} className="nav-link-btn personal-area-btn" role="menuitem" aria-label="עבור לאזור האישי">
                    <span aria-hidden="true">🏠</span> אזור אישי
                  </button>
                )}
              </>
            )}
          </div>

          {/* Auth Button - Dynamic based on login status */}
          <div className={`nav-auth ${isMenuOpen ? 'active' : ''}`}>
            {!isHydrated ? (
              <button onClick={() => handleLinkClick('/login')} className="btn btn-primary" aria-label="התחברות לאתר">
                התחברות
              </button>
            ) : isLoggedIn ? (
              <button className="btn btn-secondary" onClick={handleLogout} aria-label="התנתקות מהאתר">
                התנתקות
              </button>
            ) : (
              <button onClick={() => handleLinkClick('/login')} className="btn btn-primary" aria-label="התחברות לאתר">
                התחברות
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}


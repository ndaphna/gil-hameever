'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import './Navigation.css';

export default function Navigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setUserEmail] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsRoadmapOpen(false);
  };

  const handleLinkClick = (href: string) => {
    closeMenu();
    // הוסף עיכוב קטן כדי שהתפריט יסגר לפני הניווט
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  const toggleRoadmap = () => {
    setIsRoadmapOpen(!isRoadmapOpen);
  };

  // Mark as hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    }
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    closeMenu();
  };

  return (
    <header className="main-header">
      {/* Overlay for mobile menu - מוצב לפני התפריט */}
      {isMenuOpen && (
        <div 
          className="nav-overlay" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      
      <nav className="main-nav">
        <div className="nav-container">
          {/* Logo/Brand */}
          <div className="nav-brand">
            <Link href="/" onClick={closeMenu}>
              מנופאוזית וטוב לה
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="mobile-menu-buttons">
            {/* Internal System Menu Button - רק למשתמשים מחוברים */}
            {isHydrated && isLoggedIn && (
              <button 
                className="internal-menu-btn"
                onClick={() => {/* TODO: פתיחת תפריט פנימי */}}
                aria-label="תפריט מערכת פנימי"
                title="תפריט מערכת פנימי"
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
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {!isHydrated ? (
              // תפריט ברירת מחדל עד שה-hydration יסתיים
              <>
                <button onClick={() => handleLinkClick('/')} className="nav-link-btn">דף הבית</button>
                <button onClick={() => handleLinkClick('/about')} className="nav-link-btn">אודות</button>
                <button onClick={() => handleLinkClick('/pricing')} className="nav-link-btn">מחירים</button>
              </>
            ) : (
              // תפריט ציבורי למשתמשים לא מחוברים
              <>
                <button onClick={() => handleLinkClick('/')} className="nav-link-btn">דף הבית</button>
                <button onClick={() => handleLinkClick('/about')} className="nav-link-btn">אודות</button>
                
                {/* Dropdown Menu for Roadmap */}
                <div 
                  className={`nav-dropdown ${isRoadmapOpen ? 'active' : ''}`}
                  onMouseEnter={() => setIsRoadmapOpen(true)}
                  onMouseLeave={() => setIsRoadmapOpen(false)}
                >
                  <button 
                    className="nav-dropdown-toggle"
                    onClick={toggleRoadmap}
                    aria-expanded={isRoadmapOpen}
                  >
                    מפת דרכים
                    <span className={`dropdown-arrow ${isRoadmapOpen ? 'active' : ''}`}>▼</span>
                  </button>
                  <div className="nav-dropdown-menu">
                    <button onClick={() => handleLinkClick('/menopause-roadmap')} className="nav-dropdown-link">
                      <span className="stage-icon">🗺️</span>
                      מפת הדרכים המלאה
                    </button>
                    <button onClick={() => handleLinkClick('/the-body-whispers')} className="nav-dropdown-link">
                      <span className="stage-icon">🧏🏻‍♀️</span>
                      שלב 1: הגוף לוחש
                    </button>
                    <button onClick={() => handleLinkClick('/certainty-peace-security')} className="nav-dropdown-link">
                      <span className="stage-icon">🌳</span>
                      שלב 2: וודאות, שקט, ביטחון
                    </button>
                    <button onClick={() => handleLinkClick('/belonging-sisterhood-emotional-connection')} className="nav-dropdown-link">
                      <span className="stage-icon">🤝</span>
                      שלב 3: שייכות ואחוות נשים
                    </button>
                    <button onClick={() => handleLinkClick('/self-worth')} className="nav-dropdown-link">
                      <span className="stage-icon">🌟</span>
                      שלב 4: ערך עצמי, משמעות
                    </button>
                    <button onClick={() => handleLinkClick('/wisdom-giving')} className="nav-dropdown-link">
                      <span className="stage-icon">✨</span>
                      שלב 5: תבונה ונתינה
                    </button>
                  </div>
                </div>

                <button onClick={() => handleLinkClick('/pricing')} className="nav-link-btn">מחירים</button>
                
                {/* כפתור אזור אישי - רק למשתמשים מחוברים */}
                {isHydrated && isLoggedIn && (
                  <button onClick={() => handleLinkClick('/dashboard')} className="nav-link-btn personal-area-btn">
                    🏠 אזור אישי
                  </button>
                )}
              </>
            )}
          </div>

          {/* Auth Button - Dynamic based on login status */}
          <div className={`nav-auth ${isMenuOpen ? 'active' : ''}`}>
            {!isHydrated ? (
              <button onClick={() => handleLinkClick('/login')} className="btn btn-primary">
                התחברות
              </button>
            ) : isLoggedIn ? (
              <button className="btn btn-secondary" onClick={handleLogout}>
                התנתקות
              </button>
            ) : (
              <button onClick={() => handleLinkClick('/login')} className="btn btn-primary">
                התחברות
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}


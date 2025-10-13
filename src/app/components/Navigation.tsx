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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsRoadmapOpen(false);
  };

  const toggleRoadmap = () => {
    setIsRoadmapOpen(!isRoadmapOpen);
  };

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
      <nav className="main-nav">
        <div className="nav-container">
          {/* Logo/Brand */}
          <div className="nav-brand">
            <Link href="/" onClick={closeMenu}>
              מנופאוזית וטוב לה
            </Link>
          </div>

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

          {/* Navigation Links */}
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link href="/" onClick={closeMenu}>דף הבית</Link>
            <Link href="/about" onClick={closeMenu}>אודות</Link>
            
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
                <Link href="/menopause-roadmap" onClick={closeMenu}>
                  <span className="stage-icon">🗺️</span>
                  מפת הדרכים המלאה
                </Link>
                <Link href="/the-body-whispers" onClick={closeMenu}>
                  <span className="stage-icon">🧏🏻‍♀️</span>
                  שלב 1: הגוף לוחש
                </Link>
                <Link href="/certainty-peace-security" onClick={closeMenu}>
                  <span className="stage-icon">🌳</span>
                  שלב 2: וודאות, שקט, ביטחון
                </Link>
                <Link href="/belonging-sisterhood-emotional-connection" onClick={closeMenu}>
                  <span className="stage-icon">🤝</span>
                  שלב 3: שייכות ואחוות נשים
                </Link>
                <Link href="/self-worth" onClick={closeMenu}>
                  <span className="stage-icon">🌟</span>
                  שלב 4: ערך עצמי, משמעות
                </Link>
                <Link href="/wisdom-giving" onClick={closeMenu}>
                  <span className="stage-icon">✨</span>
                  שלב 5: תבונה ונתינה
                </Link>
              </div>
            </div>

            <Link href="/pricing" onClick={closeMenu}>מחירים</Link>
          </div>

          {/* Auth Button - Dynamic based on login status */}
          <div className={`nav-auth ${isMenuOpen ? 'active' : ''}`}>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="btn btn-dashboard" onClick={closeMenu}>
                  האזור האישי
                </Link>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  התנתקות
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary" onClick={closeMenu}>
                התחברות
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="nav-overlay" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}


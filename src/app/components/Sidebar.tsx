'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const { tokens, isLoading: tokensLoading } = useTokens();
  const { isAdmin } = useAuth();
  const [tokenAnimation, setTokenAnimation] = useState<'decrease' | null>(null);
  const [prevTokens, setPrevTokens] = useState<number | null>(null);

  // Initialize prevTokens after tokens are loaded
  useEffect(() => {
    if (!tokensLoading && prevTokens === null) {
      setPrevTokens(tokens);
    }
  }, [tokensLoading, tokens, prevTokens]);

  // Detect token changes and trigger animation
  useEffect(() => {
    if (prevTokens !== null && prevTokens !== tokens) {
      console.log('🔍 Token change detected:', { prevTokens, tokens, isDecrease: tokens < prevTokens });
      if (tokens < prevTokens) {
        console.log('🎬 Triggering token animation:', { prevTokens, tokens, difference: prevTokens - tokens });
        setTokenAnimation('decrease');
        const timer = setTimeout(() => {
          console.log('⏰ Animation timer ended');
          setTokenAnimation(null);
        }, 600); // Animation duration
        setPrevTokens(tokens);
        return () => {
          console.log('🧹 Cleaning up animation timer');
          clearTimeout(timer);
        };
      } else {
        // Update prevTokens even if not decreasing (for next comparison)
        console.log('📊 Tokens increased or same, updating prevTokens');
        setPrevTokens(tokens);
      }
    }
  }, [tokens, prevTokens]);

  // Check if current page is a roadmap page
  const isRoadmapPage = useMemo(() => {
    const roadmapPaths = [
      '/menopause-roadmap',
      '/the-body-whispers',
      '/certainty-peace-security',
      '/belonging-sisterhood-emotional-connection',
      '/self-worth',
      '/wisdom-giving'
    ];
    return roadmapPaths.some(path => pathname === path);
  }, [pathname]);

  const menuItems = useMemo(() => [
    {
      href: '/dashboard',
      icon: '📊',
      label: 'לוח בקרה',
      description: 'סקירה כללית'
    },
    {
      href: '/chat',
      icon: '💬',
      label: 'שיחה עם עליזה',
      description: 'צ\'אט אישי'
    },
    {
      href: '/journal',
      icon: '📔',
      label: 'היומן שלי',
      description: 'יומן רגשות יומי'
    },
    {
      href: '/insights',
      icon: '🔮',
      label: 'תובנות עליזה',
      description: 'ניתוח AI אישי'
    },
    {
      href: '/profile',
      icon: '👤',
      label: 'הפרופיל והמנוי שלי',
      description: 'פרטים אישיים ומנוי'
    }
  ], []);

  const roadmapItems = useMemo(() => [
    {
      href: '/menopause-roadmap',
      icon: '🗺️',
      label: 'מפת הדרכים המלאה'
    },
    {
      href: '/the-body-whispers',
      icon: '🧏🏻‍♀️',
      label: 'שלב 1: הגוף לוחש'
    },
    {
      href: '/certainty-peace-security',
      icon: '🌳',
      label: 'שלב 2: וודאות, שקט, ביטחון'
    },
    {
      href: '/belonging-sisterhood-emotional-connection',
      icon: '🤝',
      label: 'שלב 3: שייכות ואחוות נשים'
    },
    {
      href: '/self-worth',
      icon: '🌟',
      label: 'שלב 4: ערך עצמי, משמעות'
    },
    {
      href: '/wisdom-giving',
      icon: '✨',
      label: 'שלב 5: תבונה ונתינה'
    }
  ], []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-open roadmap dropdown if on a roadmap page
  useEffect(() => {
    if (isRoadmapPage) {
      setRoadmapOpen(true);
    }
  }, [isRoadmapPage]);

  // Auto-scroll to active item in sidebar
  useEffect(() => {
    if (!mounted || !pathname) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const activeItem = document.querySelector('.sidebar-dropdown-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, mounted, roadmapOpen]);

  useEffect(() => {
    if (!mounted) return;
    
    async function loadUserName() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If no authenticated user, show default name
      if (!user) {
        console.log('Sidebar: No authenticated user found');
        setUserName('משתמשת');
        return;
      }
      
      // Load user profile from database
        let { data: profile } = await supabase
          .from('user_profile')
          .select('first_name, last_name, name, full_name, email')
          .eq('id', user.id)
          .single();

        // Create profile if it doesn't exist - use API to bypass RLS
        if (!profile) {
          await fetch('/api/create-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              email: user.email || '',
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'משתמשת',
            }),
          });

          // Fetch the newly created profile
          const { data: newProfile } = await supabase
            .from('user_profile')
            .select('first_name, last_name, name, full_name, email')
            .eq('id', user.id)
            .single();
          
          profile = newProfile;
        }

        if (profile) {
          // Use first_name only for display
          setUserName(profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'משתמשת');
        }
    }

    loadUserName();
  }, [mounted]);

  // Listen for profile updates
  useEffect(() => {
    if (!mounted) return;
    
    // Listen for custom events (for profile updates)
    const handleProfileUpdate = async () => {
      console.log('Sidebar: Profile updated, reloading user name');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profile')
          .select('full_name, email')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || profile.email?.split('@')[0] || 'משתמשת');
        }
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          onTouchStart={onClose} /* Handle touch events on mobile */
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
        {/* User Info */}
        <div className="sidebar-header">
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3 className="user-name">שלום, {userName}</h3>
            <div 
              className={`user-tokens ${tokenAnimation ? `token-${tokenAnimation}` : ''}`}
              data-animation={tokenAnimation || 'none'}
            >
              <span className="token-icon">✨</span>
              <span className="token-count">{tokens}</span>
              <span className="token-label">טוקנים</span>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button className="sidebar-close" onClick={onClose} aria-label="סגור תפריט">
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <div className="sidebar-content">
                <span className="sidebar-label">{item.label}</span>
                <span className="sidebar-description">{item.description}</span>
              </div>
            </Link>
          ))}

          {/* Roadmap Dropdown */}
          <div className="sidebar-dropdown">
            <button
              className={`sidebar-item sidebar-dropdown-toggle ${roadmapOpen ? 'open' : ''} ${isRoadmapPage ? 'active' : ''}`}
              onClick={() => setRoadmapOpen(!roadmapOpen)}
            >
              <span className="sidebar-icon">🗺️</span>
              <div className="sidebar-content">
                <span className="sidebar-label">מפת דרכים</span>
                <span className="sidebar-description">שלבי גיל המעבר</span>
              </div>
              <span className={`dropdown-arrow ${roadmapOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            {roadmapOpen && (
              <div className="sidebar-dropdown-menu">
                {roadmapItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-dropdown-item ${pathname === item.href ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Admin Panel Link (only for admins) */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`sidebar-item ${pathname?.startsWith('/admin') ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">⚙️</span>
              <div className="sidebar-content">
                <span className="sidebar-label">פאנל ניהול</span>
                <span className="sidebar-description">ניהול המערכת</span>
              </div>
            </Link>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <Link href="/" className="back-to-site">
            ← חזרה לאתר
          </Link>
        </div>
      </aside>
    </>
  );
}


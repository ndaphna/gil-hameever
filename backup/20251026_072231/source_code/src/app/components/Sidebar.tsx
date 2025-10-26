'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { tokens } = useTokens();

  const menuItems = useMemo(() => [
    {
      href: '/dashboard',
      icon: '🏠',
      label: 'דף הבית',
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    async function loadUserName() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check for mock login if no Supabase user
      if (!user) {
        const mockLogin = localStorage.getItem('mock-login');
        if (mockLogin === 'true') {
          console.log('Sidebar: Using mock login');
          const mockEmail = localStorage.getItem('user-email') || 'inbald@sapir.ac.il';
          setUserName(mockEmail.split('@')[0]);
          return;
        } else {
          console.log('Sidebar: No user found');
          setUserName('משתמשת');
          return;
        }
      }
      
      if (user) {
        let { data: profile } = await supabase
          .from('user_profile')
          .select('name, email')
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
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'משתמשת',
            }),
          });

          // Fetch the newly created profile
          const { data: newProfile } = await supabase
            .from('user_profile')
            .select('name, email')
            .eq('id', user.id)
            .single();
          
          profile = newProfile;
        }

        if (profile) {
          setUserName(profile.name || profile.email.split('@')[0]);
        }
      }
    }

    loadUserName();
  }, [mounted]);

  // Listen for localStorage changes (for mock login updates)
  useEffect(() => {
    if (!mounted) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-email' && e.newValue) {
        console.log('Sidebar: User email changed, updating name');
        const newName = e.newValue.split('@')[0];
        setUserName(newName);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      const mockLogin = localStorage.getItem('mock-login');
      if (mockLogin === 'true') {
        const mockEmail = localStorage.getItem('user-email');
        if (mockEmail) {
          console.log('Sidebar: Custom storage change, updating name');
          setUserName(mockEmail.split('@')[0]);
        }
      }
    };

    window.addEventListener('profileUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleCustomStorageChange);
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
            <div className="user-tokens">
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


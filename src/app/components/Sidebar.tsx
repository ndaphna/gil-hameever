'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('');
  const [tokens, setTokens] = useState<number>(0);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        let { data: profile } = await supabase
          .from('user_profile')
          .select('name, email, current_tokens')
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
            .select('name, email, current_tokens')
            .eq('id', user.id)
            .single();
          
          profile = newProfile;
        }

        if (profile) {
          setUserName(profile.name || profile.email.split('@')[0]);
          setTokens(profile.current_tokens || 0);
        }
      }
    }

    loadUserData();
  }, []);

  const menuItems = [
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
  ];

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
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
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


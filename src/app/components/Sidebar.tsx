'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user, profile, isAdmin, updateProfile } = useAuthContext();
  const [tokenAnimation, setTokenAnimation] = useState<'decrease' | null>(null);
  
  // Use profile values first but fall back to auth user metadata and email
  const tokens = profile?.current_tokens ?? (profile as any)?.tokens_remaining ?? 0;
  const tokensLoading = !profile;
  const [prevTokens, setPrevTokens] = useState<number | null>(null);

  // Derive display name and image from shared context profile OR user
  const userName = profile?.first_name
    || (profile as any)?.name?.split(' ')[0]
    || profile?.full_name?.split(' ')[0]
    || user?.user_metadata?.first_name
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.user_metadata?.name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || profile?.email?.split('@')[0]
    || '';
  const profileImageUrl = (profile as any)?.profile_image_url ?? null;

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

  // No need for loadUserName – profile comes from AuthContext above

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('לא מחוברת. אנא התחברי מחדש');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error === 'Storage bucket not found' 
          ? 'Storage bucket לא קיים. אנא צרי את ה-bucket "profile-images" ב-Supabase Storage. ראה guides/SETUP_PROFILE_IMAGES.md להוראות מפורטות.'
          : data.error || 'Failed to upload image';
        throw new Error(errorMessage);
      }

      // Trigger profile re-fetch via context so image updates everywhere
      await updateProfile({ profile_image_url: data.imageUrl } as any);
      setShowImageModal(false);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error: any) {
      alert('שגיאה בהעלאת תמונה: ' + (error.message || 'שגיאה לא ידועה'));
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    setUploadingImage(true);

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('לא מחוברת. אנא התחברי מחדש');
      }

      const response = await fetch('/api/user/upload-profile-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }

      // Trigger profile re-fetch via context
      await updateProfile({ profile_image_url: null } as any);
      setShowImageModal(false);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error: any) {
      alert('שגיאה במחיקת תמונה: ' + (error.message || 'שגיאה לא ידועה'));
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

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
          <div 
            className="user-avatar" 
            onClick={() => setShowImageModal(true)}
            style={{ cursor: 'pointer', position: 'relative' }}
            title="לחצי לערוך תמונת פרופיל"
          >
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="תמונת פרופיל" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              <span>{userName.charAt(0).toUpperCase()}</span>
            )}
            <div className="avatar-edit-overlay">
              <span>✏️</span>
            </div>
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
          {menuItems.slice(0, 4).map((item) => (
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

          {/* Profile Menu Item - moved after roadmap */}
          {menuItems.slice(4).map((item) => (
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

      {/* Profile Image Edit Modal */}
      {showImageModal && (
        <div className="sidebar-image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="sidebar-image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-image-modal-header">
              <h3>עריכת תמונת פרופיל</h3>
              <button 
                className="sidebar-image-modal-close"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
            </div>
            <div className="sidebar-image-modal-content">
              <div className="sidebar-image-preview">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="תמונת פרופיל" />
                ) : (
                  <div className="sidebar-image-placeholder">
                    <span>👩</span>
                  </div>
                )}
              </div>
              <div className="sidebar-image-actions">
                <label htmlFor="sidebar-image-upload" className="sidebar-upload-button">
                  {uploadingImage ? 'מעלה...' : profileImageUrl ? 'שני תמונה' : 'העלי תמונה'}
                  <input
                    id="sidebar-image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                </label>
                {profileImageUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="sidebar-delete-button"
                    disabled={uploadingImage}
                  >
                    מחק תמונה
                  </button>
                )}
                <Link 
                  href="/profile" 
                  className="sidebar-profile-link"
                  onClick={() => setShowImageModal(false)}
                >
                  לניהול פרופיל מלא →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


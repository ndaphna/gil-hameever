'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import { useAuthContext } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  subscription_status: string;
  current_tokens: number;
  created_at: string;
  phone_number?: string | null;
  profile_image_url?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile: contextProfile, loading: authLoading, updateProfile } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Sync and initialize form state from AuthContext
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('Profile: No authenticated user found, redirecting to login');
      router.push('/login');
      return;
    }

    if (!authLoading && contextProfile) {
      setProfile(contextProfile as any);
      
      const fullName = contextProfile.name || 
        (contextProfile.first_name && contextProfile.last_name 
          ? `${contextProfile.first_name} ${contextProfile.last_name}` 
          : contextProfile.first_name || contextProfile.last_name || '');
          
      // Only set initial values if we haven't touched the form yet or if they change externally
      setName(fullName);
      setPhoneNumber((contextProfile as any).phone_number || '');
      setProfileImageUrl((contextProfile as any).profile_image_url || null);
    }
  }, [user, authLoading, contextProfile, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('user_profile')
        .update({ 
          name: name.trim(),
          phone_number: phoneNumber || null,
        })
        .eq('id', profile?.id);

      if (error) throw error;

      setMessage('הפרופיל עודכן בהצלחה');
      if (profile) {
        setProfile({ 
          ...profile, 
          name: name.trim(),
          phone_number: phoneNumber || null,
        });
      }
      // Update the global context state as well
      await updateProfile({ 
        name: name.trim(),
        phone_number: phoneNumber || null,
      } as any);

      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error: unknown) {
      setMessage('שגיאה בעדכון הפרופיל');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingImage(true);
    setMessage('');

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

      setProfileImageUrl(data.imageUrl);
      if (profile) {
        setProfile({ ...profile, profile_image_url: data.imageUrl });
      }
      // Update context state
      await updateProfile({ profile_image_url: data.imageUrl } as any);
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error: any) {
      setMessage('שגיאה בהעלאת תמונה: ' + (error.message || 'שגיאה לא ידועה'));
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!profile) return;

    setUploadingImage(true);
    setMessage('');

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

      setProfileImageUrl(null);
      if (profile) {
        setProfile({ ...profile, profile_image_url: null });
      }
      // Update context state
      await updateProfile({ profile_image_url: null } as any);

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error: any) {
      setMessage('שגיאה במחיקת תמונה: ' + (error.message || 'שגיאה לא ידועה'));
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setMessage('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage('הסיסמאות החדשות אינן תואמות');
      setChangingPassword(false);
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setMessage('הסיסמה החדשה חייבת להכיל לפחות 6 תווים');
      setChangingPassword(false);
      return;
    }

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('לא מחוברת. אנא התחברי מחדש');
      }

      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בעדכון הסיסמה');
      }

      setMessage('הסיסמה עודכנה בהצלחה');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (error: any) {
      setMessage('שגיאה בעדכון הסיסמה: ' + (error.message || 'שגיאה לא ידועה'));
      console.error(error);
    } finally {
      setChangingPassword(false);
    }
  };

  if (authLoading || (!profile && user)) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>הפרופיל והמנוי שלי</h1>
          
          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              פרטים אישיים
            </button>
            <button 
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              הגדרות התראות
            </button>
          </div>
        </div>

        {message && (
          <div className={`message-box ${message.includes('שגיאה') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-grid">
            {/* Personal Info Card */}
            <div className="profile-card">
              <h2>פרטים אישיים</h2>
              
              {/* Profile Image Section */}
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt="תמונת פרופיל" 
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <span>👩</span>
                    </div>
                  )}
                </div>
                <div className="profile-image-actions">
                  <label htmlFor="image-upload" className="upload-image-button">
                    {uploadingImage ? 'מעלה...' : profileImageUrl ? 'שני תמונה' : 'העלי תמונה'}
                    <input
                      id="image-upload"
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
                      className="delete-image-button"
                      disabled={uploadingImage}
                    >
                      מחק תמונה
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>אימייל</label>
                  <input type="email" value={profile?.email} disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="name">שם</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="הכניסי את שמך המלא"
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">מספר טלפון נייד</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="05X-XXXXXXX"
                    disabled={saving}
                    pattern="[0-9]{2,3}-[0-9]{7}"
                  />
                  <small style={{ display: 'block', color: '#6b7280', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                    פורמט: 05X-XXXXXXX
                  </small>
                </div>

                <button type="submit" className="save-button" disabled={saving}>
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
              </form>
            </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <h2>🔒 שינוי סיסמה</h2>
            
            {!showChangePassword ? (
              <div className="password-section">
                <p style={{ color: '#6b7280', marginBottom: '20px', textAlign: 'right' }}>
                  שמרי על החשבון שלך בטוח עם סיסמה חזקה
                </p>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="change-password-button"
                >
                  שנה סיסמה
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="currentPassword">סיסמה נוכחית</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="הכניסי את הסיסמה הנוכחית"
                    disabled={changingPassword}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">סיסמה חדשה</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="הכניסי סיסמה חדשה (לפחות 6 תווים)"
                    disabled={changingPassword}
                    required
                    minLength={6}
                  />
                  <small style={{ display: 'block', color: '#6b7280', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                    הסיסמה חייבת להכיל לפחות 6 תווים
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">אימות סיסמה חדשה</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="הכניסי שוב את הסיסמה החדשה"
                    disabled={changingPassword}
                    required
                    minLength={6}
                  />
                </div>

                <div className="password-actions">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={changingPassword}
                  >
                    {changingPassword ? 'מעדכן...' : 'שמור סיסמה חדשה'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setMessage('');
                    }}
                    className="cancel-button"
                    disabled={changingPassword}
                  >
                    ביטול
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Subscription & Billing Card */}
          <div className="profile-card subscription-card">
            <h2>💎 מנוי וחיובים</h2>
            
            {/* Current Plan */}
            <div className="plan-section">
              <h3>המנוי הנוכחי</h3>
              <div className="subscription-details">
                <div className="detail-row">
                  <span className="label">סטטוס:</span>
                  <span className="tier-badge">{profile?.subscription_status}</span>
                </div>
                <div className="detail-row">
                  <span className="label">טוקנים זמינים:</span>
                  <span className="tokens-count">{profile?.current_tokens || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="label">תאריך חידוש:</span>
                  <span>לא הוגדר</span>
                </div>
                <div className="detail-row">
                  <span className="label">תאריך הצטרפות:</span>
                  <span>{new Date(profile?.created_at || '').toLocaleDateString('he-IL')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="subscription-actions">
              <button className="upgrade-button">
                ⬆️ שדרג מנוי
              </button>
              <button className="manage-button">
                💳 ניהול אמצעי תשלום
              </button>
              <button className="history-button">
                📄 היסטוריית חיובים
              </button>
            </div>

            {/* Plan Info */}
            <div className="plan-info">
              <p className="info-note">
                💡 <strong>טיפ:</strong> שדרגי את המנוי שלך כדי לקבל יותר טוקנים ותכונות נוספות
              </p>
            </div>
          </div>

        </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-section">
            <NotificationSettings userId={profile?.id || ''} />
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          background: var(--gray-light);
          padding: 40px 20px;
        }

        .profile-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .profile-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--black);
          margin: 0;
        }

        .profile-tabs {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .tab-button {
          padding: 12px 24px;
          background: white;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .tab-button:hover {
          border-color: var(--magenta);
          color: var(--magenta);
        }

        .tab-button.active {
          background: var(--magenta);
          color: white;
          border-color: var(--magenta);
        }

        .notifications-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .back-button {
          padding: 10px 20px;
          background: white;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .back-button:hover {
          border-color: var(--magenta);
          color: var(--magenta);
        }

        .message-box {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: center;
          font-size: 14px;
        }

        .message-box.error {
          background: #ffe4e4;
          color: #cc0000;
          border: 1px solid #ffcccc;
        }

        .message-box.success {
          background: #e4ffe4;
          color: #00aa00;
          border: 1px solid #ccffcc;
        }

        .profile-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .profile-card.danger-card {
          border: 2px solid #ffcccc;
        }

        .profile-card h2 {
          font-size: 20px;
          font-weight: 700;
          color: var(--black);
          margin: 0 0 24px 0;
          text-align: right;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--black);
          font-size: 14px;
          text-align: right;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          text-align: right;
          font-family: inherit;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--magenta);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        .save-button {
          width: 100%;
          padding: 14px 20px;
          background: var(--magenta);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .save-button:hover:not(:disabled) {
          background: var(--magenta-dark);
          transform: translateY(-1px);
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .subscription-details {
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 600;
          color: var(--gray);
        }

        .tier-badge {
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #e4ffe4;
          color: #00aa00;
        }

        .tokens-count {
          font-size: 18px;
          font-weight: 700;
          color: var(--magenta);
        }

        .subscription-card {
          background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
          border: 2px solid var(--magenta);
        }

        .plan-section {
          margin-bottom: 24px;
        }

        .plan-section h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--black);
          margin: 0 0 16px 0;
          text-align: right;
        }

        .subscription-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .upgrade-button,
        .manage-button,
        .history-button {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          text-align: center;
        }

        .upgrade-button {
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
        }

        .upgrade-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
        }

        .manage-button {
          background: white;
          color: var(--black);
          border: 2px solid #e5e5e5;
        }

        .manage-button:hover {
          border-color: var(--magenta);
          color: var(--magenta);
        }

        .history-button {
          background: white;
          color: var(--gray);
          border: 2px solid #e5e5e5;
        }

        .history-button:hover {
          border-color: var(--purple);
          color: var(--purple);
        }

        .plan-info {
          background: white;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
        }

        .info-note {
          margin: 0;
          color: var(--gray);
          font-size: 14px;
          line-height: 1.6;
          text-align: right;
        }

        .info-note strong {
          color: var(--magenta);
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: var(--gray);
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .profile-image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e5e5e5;
        }

        .profile-image-container {
          margin-bottom: 16px;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--magenta);
          box-shadow: 0 4px 12px rgba(255, 0, 128, 0.2);
        }

        .profile-image-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          border: 3px solid var(--magenta);
          box-shadow: 0 4px 12px rgba(255, 0, 128, 0.2);
        }

        .profile-image-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .upload-image-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          display: inline-block;
        }

        .upload-image-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
        }

        .upload-image-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .delete-image-button {
          padding: 10px 20px;
          background: white;
          color: #ef4444;
          border: 2px solid #ef4444;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .delete-image-button:hover:not(:disabled) {
          background: #fee2e2;
          transform: translateY(-2px);
        }

        .delete-image-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-group small {
          display: block;
          color: #6b7280;
          margin-top: 0.25rem;
          font-size: 0.875rem;
          text-align: right;
        }

        .password-section {
          text-align: right;
        }

        .change-password-button {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .change-password-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
        }

        .password-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .password-actions .save-button {
          flex: 1;
        }

        .cancel-button {
          padding: 14px 20px;
          background: white;
          color: var(--gray);
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .cancel-button:hover:not(:disabled) {
          border-color: var(--gray);
          color: var(--black);
        }

        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .profile-header h1 {
            font-size: 24px;
          }

          .profile-image {
            width: 100px;
            height: 100px;
          }

          .profile-image-placeholder {
            width: 100px;
            height: 100px;
            font-size: 40px;
          }
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
}


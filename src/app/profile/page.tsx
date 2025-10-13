'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  subscription_status: string;
  current_tokens: number;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profileData } = await supabase
          .from('user_profile')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.name || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('user_profile')
        .update({ name: fullName })
        .eq('id', profile?.id);

      if (error) throw error;

      setMessage('הפרופיל עודכן בהצלחה');
      if (profile) {
        setProfile({ ...profile, name: fullName });
      }
    } catch (error: any) {
      setMessage('שגיאה בעדכון הפרופיל');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="loading">טוען...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>הפרופיל שלי</h1>
          <button onClick={() => router.push('/dashboard')} className="back-button">
            ← חזרה ל-Dashboard
          </button>
        </div>

        {message && (
          <div className={`message-box ${message.includes('שגיאה') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-grid">
          {/* Personal Info Card */}
          <div className="profile-card">
            <h2>פרטים אישיים</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>אימייל</label>
                <input type="email" value={profile?.email} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="fullName">שם מלא</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="הכניסי את שמך המלא"
                  disabled={saving}
                />
              </div>

              <button type="submit" className="save-button" disabled={saving}>
                {saving ? 'שומר...' : 'שמור שינויים'}
              </button>
            </form>
          </div>

          {/* Subscription Card */}
          <div className="profile-card">
            <h2>מידע על מנוי</h2>
            <div className="subscription-details">
              <div className="detail-row">
                <span className="label">סטטוס מנוי:</span>
                <span className="tier-badge">{profile?.subscription_status}</span>
              </div>
              <div className="detail-row">
                <span className="label">טוקנים נותרו:</span>
                <span className="tokens-count">{profile?.current_tokens || 0}</span>
              </div>
              <div className="detail-row">
                <span className="label">תאריך הצטרפות:</span>
                <span>{new Date(profile?.created_at || '').toLocaleDateString('he-IL')}</span>
              </div>
            </div>
            <button className="upgrade-button">שדרג מנוי</button>
          </div>

          {/* Danger Zone */}
          <div className="profile-card danger-card">
            <h2>אזור מסוכן</h2>
            <p>פעולות בלתי הפיכות</p>
            <button onClick={handleLogout} className="logout-button-full">
              התנתק מהחשבון
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
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

        .upgrade-button {
          width: 100%;
          padding: 14px 20px;
          background: var(--purple);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .upgrade-button:hover {
          background: var(--purple-light);
          transform: translateY(-1px);
        }

        .logout-button-full {
          width: 100%;
          padding: 14px 20px;
          background: white;
          color: #cc0000;
          border: 2px solid #cc0000;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .logout-button-full:hover {
          background: #cc0000;
          color: white;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: var(--gray);
        }

        @media (max-width: 768px) {
          .profile-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}


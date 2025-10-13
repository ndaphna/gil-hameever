'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';

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

        let { data: profileData } = await supabase
          .from('user_profile')
          .select('*')
          .eq('id', user.id)
          .single();

        // Create profile if it doesn't exist - use API to bypass RLS
        if (!profileData) {
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
            .select('*')
            .eq('id', user.id)
            .single();
          
          profileData = newProfile;
        }

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>הפרופיל והמנוי שלי</h1>
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

        @media (max-width: 768px) {
          .profile-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string | null;
  email: string;
  subscription_status: string;
  current_tokens: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

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
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>שלום, {profile?.name || profile?.email || 'משתמשת יקרה'} 👋</h1>
          <button onClick={handleLogout} className="logout-button">
            התנתק
          </button>
        </div>

        <div className="dashboard-grid">
          {/* Subscription Card */}
          <div className="dashboard-card">
            <h2>המנוי שלך</h2>
            <div className="subscription-info">
              <div className="tier-badge">{profile?.subscription_status}</div>
              <p className="tokens">
                <strong>{profile?.current_tokens || 0}</strong> טוקנים נותרו
              </p>
            </div>
            <a href="/profile" className="card-link">
              נהל מנוי →
            </a>
          </div>

          {/* Chat Card */}
          <div className="dashboard-card clickable" onClick={() => router.push('/chat')}>
            <div className="card-icon">💬</div>
            <h2>שיחה עם עליזה</h2>
            <p>התחילי שיחה חדשה או המשיכי שיחה קיימת</p>
            <div className="card-link">פתחי צ'אט →</div>
          </div>

          {/* Journal Card */}
          <div className="dashboard-card clickable" onClick={() => router.push('/journal')}>
            <div className="card-icon">📔</div>
            <h2>היומן שלי</h2>
            <p>תעדי את הרגשות והחוויות שלך</p>
            <div className="card-link">פתחי יומן →</div>
          </div>

          {/* Profile Card */}
          <div className="dashboard-card clickable" onClick={() => router.push('/profile')}>
            <div className="card-icon">👤</div>
            <h2>הפרופיל שלי</h2>
            <p>עדכני פרטים אישיים והגדרות</p>
            <div className="card-link">ערוך פרופיל →</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: var(--gray-light);
          padding: 40px 20px;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: var(--black);
          margin: 0;
          text-align: right;
        }

        .logout-button {
          padding: 10px 24px;
          background: white;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .logout-button:hover {
          border-color: var(--magenta);
          color: var(--magenta);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .dashboard-card.clickable {
          cursor: pointer;
        }

        .dashboard-card.clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 0, 128, 0.15);
        }

        .dashboard-card h2 {
          font-size: 20px;
          font-weight: 700;
          color: var(--black);
          margin: 0 0 16px 0;
          text-align: right;
        }

        .dashboard-card p {
          color: var(--gray);
          margin: 0 0 16px 0;
          text-align: right;
          line-height: 1.6;
        }

        .card-icon {
          font-size: 48px;
          margin-bottom: 16px;
          text-align: right;
        }

        .card-link {
          color: var(--magenta);
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          text-align: right;
        }

        .card-link:hover {
          text-decoration: underline;
        }

        .subscription-info {
          margin-bottom: 16px;
          text-align: right;
        }

        .tier-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .tokens {
          font-size: 16px;
          color: var(--gray);
          margin: 8px 0;
        }

        .tokens strong {
          color: var(--black);
          font-size: 24px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
          color: var(--gray);
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 24px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}


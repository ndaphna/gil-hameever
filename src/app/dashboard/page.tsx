'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';

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
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

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
      <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>ברוכה הבאה לאזור האישי שלך! 👋</h1>
        </div>

        <div className="dashboard-grid">
          {/* Welcome Card */}
          <div className="dashboard-card welcome-card">
            <h2>👋 שלום {profile?.name || profile?.email?.split('@')[0]}!</h2>
            <p>זה האזור האישי שלך. כאן תוכלי:</p>
            <ul className="feature-list">
              <li>💬 לשוחח עם עליזה בצ'אט AI אישי</li>
              <li>📔 לתעד רגשות ביומן היומי</li>
              <li>🔮 לקבל תובנות מבוססות AI על המצב שלך</li>
              <li>👤 לנהל את הפרופיל והמנוי שלך</li>
            </ul>
          </div>

          {/* Subscription Status Card */}
          <div className="dashboard-card">
            <h2>💎 סטטוס המנוי שלך</h2>
            <div className="subscription-info">
              <div className="tier-badge">{profile?.subscription_status}</div>
              <p className="tokens">
                <strong>{profile?.current_tokens || 0}</strong> טוקנים זמינים
              </p>
            </div>
            <p className="info-text">
              השתמשי בסרגל הניווט מימין כדי לגשת לכל הכלים
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="dashboard-card">
            <h2>📊 פעילות אחרונה</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <div className="stat-number">0</div>
                  <div className="stat-label">שיחות</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📔</div>
                <div className="stat-info">
                  <div className="stat-number">0</div>
                  <div className="stat-label">רשומות יומן</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="dashboard-card next-steps-card">
            <h2>🚀 מה עושים עכשיו?</h2>
            <p>מומלץ להתחיל עם:</p>
            <ol className="steps-list">
              <li>השלמת הפרופיל האישי שלך</li>
              <li>פתיחת שיחה ראשונה עם עליזה</li>
              <li>כתיבת רשומה ראשונה ביומן</li>
            </ol>
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
          text-align: center;
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

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 16px 0 0 0;
          text-align: right;
        }

        .feature-list li {
          padding: 8px 0;
          color: var(--black);
          font-size: 16px;
        }

        .steps-list {
          margin: 16px 0 0 0;
          padding-right: 24px;
          text-align: right;
        }

        .steps-list li {
          padding: 8px 0;
          color: var(--black);
          font-size: 16px;
        }

        .info-text {
          color: var(--gray);
          font-size: 14px;
          margin-top: 12px;
          text-align: right;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--gray-light);
          border-radius: 8px;
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-info {
          text-align: right;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: var(--magenta);
        }

        .stat-label {
          font-size: 14px;
          color: var(--gray);
        }

        .welcome-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
        }

        .welcome-card h2,
        .welcome-card p,
        .welcome-card li {
          color: white;
        }

        .next-steps-card {
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
          border: 2px solid var(--magenta);
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

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
}


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
        
        console.log('Dashboard: User check result:', user);
        
        // Check for mock login if no Supabase user
        if (!user) {
          const mockLogin = localStorage.getItem('mock-login');
          if (mockLogin === 'true') {
            console.log('Dashboard: Using mock login');
            // Create a mock user profile
            const mockProfile: UserProfile = {
              name: localStorage.getItem('user-email')?.split('@')[0] || 'משתמשת',
              email: localStorage.getItem('user-email') || '',
              subscription_status: 'active',
              current_tokens: 100
            };
            setProfile(mockProfile);
            setLoading(false);
            return;
          } else {
            console.log('Dashboard: No user found, redirecting to login');
            router.push('/login');
            return;
          }
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

  const handleLogout = async () => {
    try {
      // Clear mock login if exists
      localStorage.removeItem('mock-login');
      localStorage.removeItem('user-email');
      
      // Try Supabase logout
      await supabase.auth.signOut();
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect to login even if logout fails
      router.push('/login');
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
              <li>🔮 לקבל תובנות מבוססות AI</li>
            </ul>
          </div>

          {/* Subscription Status Card */}
          <div className="dashboard-card">
            <h2>💎 סטטוס המנוי</h2>
            <div className="subscription-info">
              <div className="tier-badge">{profile?.subscription_status}</div>
              <p className="tokens">
                <strong>{profile?.current_tokens || 0}</strong> טוקנים
              </p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="dashboard-card">
            <h2>📊 פעילות</h2>
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
                  <div className="stat-label">רשומות</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="dashboard-card next-steps-card">
            <h2>🚀 צעדים הבאים</h2>
            <ol className="steps-list">
              <li>השלמת הפרופיל</li>
              <li>שיחה עם עליזה</li>
              <li>כתיבת יומן</li>
            </ol>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          background: var(--gray-light);
          padding: 30px 20px;
        }

        .dashboard-container {
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--black);
          margin: 0;
          text-align: center;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          align-items: start;
        }

        .dashboard-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          height: 200px;
          justify-content: flex-start;
        }

        .dashboard-card.clickable {
          cursor: pointer;
        }

        .dashboard-card.clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 0, 128, 0.15);
        }

        .dashboard-card h2 {
          font-size: 16px;
          font-weight: 700;
          color: var(--black);
          margin: 0 0 8px 0;
          text-align: right;
          flex-shrink: 0;
        }

        .dashboard-card p {
          color: var(--gray);
          margin: 0 0 8px 0;
          text-align: right;
          line-height: 1.4;
          font-size: 13px;
          flex-shrink: 0;
        }

        .card-icon {
          font-size: 32px;
          margin-bottom: 12px;
          text-align: right;
        }

        .card-link {
          color: var(--magenta);
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          text-align: right;
          font-size: 14px;
        }

        .card-link:hover {
          text-decoration: underline;
        }

        .subscription-info {
          margin-bottom: 12px;
          text-align: right;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .tier-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .tokens {
          font-size: 14px;
          color: var(--gray);
          margin: 6px 0;
        }

        .tokens strong {
          color: var(--black);
          font-size: 20px;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
          text-align: right;
          flex: 1;
          overflow: hidden;
        }

        .feature-list li {
          padding: 4px 0;
          color: var(--black);
          font-size: 14px;
        }

        .steps-list {
          margin: 12px 0 0 0;
          padding-right: 20px;
          text-align: right;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .steps-list li {
          padding: 4px 0;
          color: var(--black);
          font-size: 13px;
        }

        .info-text {
          color: var(--gray);
          font-size: 12px;
          margin-top: 10px;
          text-align: right;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
          flex: 1;
          align-content: flex-start;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: var(--gray-light);
          border-radius: 8px;
        }

        .stat-icon {
          font-size: 20px;
        }

        .stat-info {
          text-align: right;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: var(--magenta);
        }

        .stat-label {
          font-size: 12px;
          color: var(--gray);
        }

        .welcome-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, var(--magenta) 0%, var(--purple) 100%);
          color: white;
          padding: 20px;
          margin-bottom: 0;
          max-height: 200px;
          overflow: hidden;
        }

        .welcome-card h2,
        .welcome-card p,
        .welcome-card li {
          color: white;
        }

        .next-steps-card {
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
          border-left: 3px solid var(--magenta);
        }

        .loading {
          text-align: center;
          padding: 30px;
          font-size: 16px;
          color: var(--gray);
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 22px;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .dashboard-card {
            padding: 16px;
          }
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
}


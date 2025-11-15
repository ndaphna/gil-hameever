'use client';

import { useEffect, useState } from 'react';
import { getSystemStats } from '@/lib/admin-api';
import './admin.css';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalThreads: number;
  totalMessages: number;
  totalEmotions: number;
  subscriptionBreakdown: {
    trial: number;
    basic: number;
    premium: number;
  };
  recentUsers: Array<{
    id: string;
    email: string;
    full_name: string;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSystemStats();
      setStats(response.stats);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card">
        <div className="admin-error">{error}</div>
        <button onClick={loadStats} className="admin-button admin-button-primary">
          נסה שוב
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-card-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        דשבורד ניהול
      </h1>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-label">סה"כ משתמשים</div>
          <div className="admin-stat-value">{stats?.totalUsers || 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">משתמשים פעילים</div>
          <div className="admin-stat-value">{stats?.activeUsers || 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">שיחות</div>
          <div className="admin-stat-value">{stats?.totalThreads || 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">הודעות</div>
          <div className="admin-stat-value">{stats?.totalMessages || 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">רשומות יומן</div>
          <div className="admin-stat-value">{stats?.totalEmotions || 0}</div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">פילוח מנויים</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>ניסיון</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
              {stats?.subscriptionBreakdown.trial || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>בסיסי</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
              {stats?.subscriptionBreakdown.basic || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>פרימיום</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
              {stats?.subscriptionBreakdown.premium || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">משתמשים חדשים</h2>
        {stats?.recentUsers && stats.recentUsers.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>אימייל</th>
                <th>שם</th>
                <th>תאריך הרשמה</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name || '-'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString('he-IL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            אין משתמשים חדשים
          </p>
        )}
      </div>
    </div>
  );
}




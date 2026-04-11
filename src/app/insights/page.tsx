'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import ModernInsights from '@/components/insights/ModernInsights';
import { useAuthContext } from '@/contexts/AuthContext';
import './Insights.css';

export default function InsightsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    // Only redirect if we finished loading and there is NO user
    if (!loading && !user) {
      console.log('Insights: No authenticated user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="insights-page">
          <div className="modern-loading">
            <div className="loading-spinner-modern">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h3>מנתחת את הנתונים שלך...</h3>
            <p>רגע קט ואני אציג לך תובנות מרתקות</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="insights-page">
        <ModernInsights userId={user.id} />
      </div>
    </DashboardLayout>
  );
}

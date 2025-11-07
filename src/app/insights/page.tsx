'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import AlizaInsights from '@/components/insights/AlizaInsights';
import './Insights.css';

export default function InsightsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Insights: User check result:', user);
      
      // Redirect to login if no authenticated user
      if (!user) {
        console.log('Insights: No authenticated user found, redirecting to login');
        router.push('/login');
        return;
      }

      setUserId(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="insights-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>טוען תובנות...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="insights-page">
        <AlizaInsights userId={userId} />
      </div>
    </DashboardLayout>
  );
}

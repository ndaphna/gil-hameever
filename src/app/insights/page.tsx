'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import ModernInsights from '@/components/insights/ModernInsights';
import './insights.css';

export default function InsightsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state when pathname changes
    setLoading(true);
    setUserId(null);
    
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const checkUser = async () => {
      try {
        // Add timeout to prevent infinite loading
        const userCheckPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('User check timeout'));
          }, 10000); // 10 seconds timeout
        });
        
        const result = await Promise.race([userCheckPromise, timeoutPromise]) as { data: { user: any } };
        const { data: { user } } = result;
        
        if (!isMounted) return;
        
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
        if (isMounted) {
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkUser();
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname, router]);

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

  if (!userId) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="insights-page">
        <ModernInsights userId={userId} />
      </div>
    </DashboardLayout>
  );
}

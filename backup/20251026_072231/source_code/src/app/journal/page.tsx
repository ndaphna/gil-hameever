'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import MenopauseJournal from '@/components/journal/MenopauseJournal';
import { supabase } from '@/lib/supabase';
import '@/components/journal/MenopauseJournal.css';

export default function JournalPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Journal: User check result:', user);
      
      // Check for mock login if no Supabase user
      if (!user) {
        const mockLogin = localStorage.getItem('mock-login');
        if (mockLogin === 'true') {
          console.log('Journal: Using mock login');
          // Create a mock user ID for mock login
          const mockUserId = 'mock-user-' + Date.now();
          setUserId(mockUserId);
          setLoading(false);
          return;
        } else {
          console.log('Journal: No user found, redirecting to login');
          router.push('/login');
          return;
        }
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
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <DashboardLayout>
      <MenopauseJournal userId={userId} />
    </DashboardLayout>
  );
}
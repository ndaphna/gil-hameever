'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import MenopauseJournal from '@/components/journal/MenopauseJournal';
import { supabase } from '@/lib/supabase';
// CSS imported in MenopauseJournal component

function JournalContent({ userId }: { userId: string }) {
  return <MenopauseJournal userId={userId} />;
}

export default function JournalPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state when pathname changes (user navigates to this page)
    setLoading(true);
    setUserId(null);
    
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log('Journal: User check result:', user);
        
        // Redirect to login if no authenticated user
        if (!user) {
          console.log('Journal: No authenticated user found, redirecting to login');
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
    
    checkUser();
  }, [pathname, router]);

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
      <Suspense fallback={
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      }>
        {userId && <JournalContent userId={userId} />}
      </Suspense>
    </DashboardLayout>
  );
}
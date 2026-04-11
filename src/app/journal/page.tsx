'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import MenopauseJournal from '@/components/journal/MenopauseJournal';
import { useAuthContext } from '@/contexts/AuthContext';
// CSS imported in MenopauseJournal component

function JournalContent({ userId }: { userId: string }) {
  return <MenopauseJournal userId={userId} />;
}

export default function JournalPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    // Only redirect if we finished loading and there is NO user
    if (!loading && !user) {
      console.log('Journal: No authenticated user found, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="loading-container">
          <div className="loading">טוען...</div>
        </div>
      }>
        <JournalContent userId={user.id} />
      </Suspense>
    </DashboardLayout>
  );
}
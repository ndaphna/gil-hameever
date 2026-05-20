'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './AdminGuard.module.css';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  // Supabase JS auto-refreshes its session token on tab focus, which triggers
  // useAuth → setState({ loading: true }) → unmounts the children. That
  // destroys any unsaved React state (e.g. the textarea in /admin/newsletter/new).
  // Once loaded, stay mounted on subsequent refreshes.
  const hasLoadedOnceRef = useRef(false);
  useEffect(() => {
    if (!loading) hasLoadedOnceRef.current = true;
  }, [loading]);

  useEffect(() => {
    if (!loading && !isAdmin && !hasLoadedOnceRef.current) {
      router.push('/dashboard');
    }
  }, [isAdmin, loading, router]);

  if (loading && !hasLoadedOnceRef.current) {
    return (
      <div className={styles.fullscreenCenter}>
        <div>
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.muted}>טוען...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !loading) {
    return (
      <div className={styles.fullscreenCenter}>
        <div>
          <h1 className={styles.deniedTitle}>גישה נדחתה</h1>
          <p className={styles.deniedText}>אין לך הרשאות גישה לדף זה</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className={styles.primaryBtn}
          >
            חזרה לדשבורד
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

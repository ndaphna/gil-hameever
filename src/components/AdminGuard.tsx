'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  // Track whether we've ever successfully loaded auth state.
  // Supabase JS auto-refreshes its session token whenever the tab regains
  // focus, which triggers useAuth → setState({ loading: true }) → unmounts
  // the children. That destroys any unsaved React state (e.g. the textarea
  // in /admin/newsletter/new). Once loaded, stay mounted on subsequent
  // refreshes — show children as long as we know the user is an admin.
  const hasLoadedOnceRef = useRef(false);
  useEffect(() => {
    if (!loading) hasLoadedOnceRef.current = true;
  }, [loading]);

  useEffect(() => {
    if (!loading && !isAdmin && !hasLoadedOnceRef.current) {
      router.push('/dashboard');
    }
  }, [isAdmin, loading, router]);

  // Initial load — show spinner until we know the user's role.
  if (loading && !hasLoadedOnceRef.current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // After initial load: if not admin, redirect. While token is refreshing
  // in the background (loading=true), keep rendering children so we don't
  // lose unsaved form state.
  if (!isAdmin && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">גישה נדחתה</h1>
          <p className="text-gray-600 mb-4">אין לך הרשאות גישה לדף זה</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            חזרה לדשבורד
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}












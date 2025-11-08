'use client';

import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { useAuth } from '@/hooks/useAuth';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <AdminGuard>
      <div className="admin-layout">
        <nav className="admin-nav">
          <div className="admin-nav-header">
            <h1 className="admin-nav-title">פאנל ניהול</h1>
          </div>
          <div className="admin-nav-links">
            <button
              onClick={() => router.push('/admin')}
              className="admin-nav-link"
            >
              דשבורד
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="admin-nav-link"
            >
              ניהול משתמשים
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="admin-nav-link"
            >
              חזרה לדשבורד
            </button>
            <button
              onClick={async () => {
                await signOut();
                router.push('/login');
              }}
              className="admin-nav-link admin-nav-link-danger"
            >
              התנתק
            </button>
          </div>
        </nav>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}


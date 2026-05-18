'use client';

import AdminGuard from '@/components/AdminGuard';
import AdminShell from './_design/AdminShell';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

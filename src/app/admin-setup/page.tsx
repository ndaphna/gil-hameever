'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import styles from './admin-setup.module.css';

export default function AdminSetupPage() {
  const { user, isAdmin, refreshAdminStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setupAdmin = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nitzandaphna@gmail.com' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to setup admin');
        return;
      }

      setMessage(data.message || 'Admin privileges granted successfully!');

      setTimeout(async () => {
        await refreshAdminStatus();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 1000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/setup-admin?email=nitzandaphna@gmail.com');
      const data = await response.json();

      if (data.exists) {
        if (data.isAdmin) {
          setMessage('✅ User is already set as admin!');
        } else {
          setMessage('⚠️ User exists but is not set as admin. Click "Setup Admin" to fix this.');
        }
      } else {
        setError('User not found. Please ensure you have signed up first.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>הגדרת מנהל מערכת</h1>

        {user && (
          <div className={styles.userBox}>
            <p className={styles.userLabel}>משתמש מחובר:</p>
            <p className={styles.userEmail}>{user.email}</p>
            <p className={styles.userStatus}>
              סטטוס מנהל:{' '}
              {isAdmin ? (
                <span className={styles.statusYes}>✅ כן</span>
              ) : (
                <span className={styles.statusNo}>❌ לא</span>
              )}
            </p>
          </div>
        )}

        {message && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={checkAdminStatus}
            disabled={loading}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            {loading ? 'בודק...' : 'בדוק סטטוס מנהל'}
          </button>

          <button
            type="button"
            onClick={setupAdmin}
            disabled={loading}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {loading ? 'מגדיר...' : 'הגדר כמנהל (nitzandaphna@gmail.com)'}
          </button>
        </div>

        <div className={styles.footer}>
          <p>לאחר ההגדרה, הקישור &quot;פאנל ניהול&quot; יופיע בסיידבר</p>
          <p>
            או גש ישירות ל: <code>/admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}

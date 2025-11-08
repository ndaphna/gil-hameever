'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
        body: JSON.stringify({ email: 'nitzandaphna@gmail.com' })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to setup admin');
        return;
      }

      setMessage(data.message || 'Admin privileges granted successfully!');
      
      // Refresh admin status after a short delay
      setTimeout(async () => {
        await refreshAdminStatus();
        // Also reload to ensure sidebar updates
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          הגדרת מנהל מערכת
        </h1>

        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">משתמש מחובר:</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
            <p className="text-sm mt-2">
              סטטוס מנהל: {isAdmin ? (
                <span className="text-green-600 font-bold">✅ כן</span>
              ) : (
                <span className="text-red-600 font-bold">❌ לא</span>
              )}
            </p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={checkAdminStatus}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'בודק...' : 'בדוק סטטוס מנהל'}
          </button>

          <button
            onClick={setupAdmin}
            disabled={loading}
            className="w-full px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'מגדיר...' : 'הגדר כמנהל (nitzandaphna@gmail.com)'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            לאחר ההגדרה, הקישור "פאנל ניהול" יופיע בסיידבר
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            או גש ישירות ל: <code className="bg-gray-100 px-2 py-1 rounded">/admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { getUsers, updateUser } from '@/lib/admin-api';
import { UserProfile } from '@/types';
import '../admin.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(page, 50, search);
      setUsers(response.users);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (updates: Partial<UserProfile>) => {
    if (!editingUser) return;

    try {
      setUpdateLoading(true);
      setError(null);
      await updateUser(editingUser.id, updates);
      setSuccessMessage('המשתמש עודכן בהצלחה');
      setEditingUser(null);
      await loadUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'שגיאה בעדכון המשתמש');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const getSubscriptionBadgeClass = (tier?: string) => {
    switch (tier) {
      case 'premium':
        return 'admin-badge admin-badge-success';
      case 'basic':
        return 'admin-badge admin-badge-info';
      case 'trial':
        return 'admin-badge admin-badge-warning';
      default:
        return 'admin-badge admin-badge-warning';
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'active':
        return 'admin-badge admin-badge-success';
      case 'cancelled':
        return 'admin-badge admin-badge-danger';
      case 'expired':
        return 'admin-badge admin-badge-warning';
      default:
        return 'admin-badge admin-badge-warning';
    }
  };

  return (
    <div>
      <h1 className="admin-card-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        ניהול משתמשים
      </h1>

      {error && <div className="admin-error">{error}</div>}
      {successMessage && <div className="admin-success">{successMessage}</div>}

      <div className="admin-card">
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="חפש לפי אימייל או שם..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
            style={{ maxWidth: '400px', display: 'inline-block', marginLeft: '1rem' }}
          />
          <button type="submit" className="admin-button admin-button-primary">
            חפש
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPage(1);
                loadUsers();
              }}
              className="admin-button admin-button-secondary"
              style={{ marginRight: '0.5rem' }}
            >
              נקה
            </button>
          )}
        </form>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
          </div>
        ) : users.length > 0 ? (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>אימייל</th>
                  <th>שם</th>
                  <th>מנוי</th>
                  <th>סטטוס</th>
                  <th>טוקנים</th>
                  <th>מנהל</th>
                  <th>תאריך הרשמה</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email || '-'}</td>
                    <td>{user.full_name || '-'}</td>
                    <td>
                      <span className={getSubscriptionBadgeClass(user.subscription_tier)}>
                        {user.subscription_tier || 'trial'}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(user.subscription_status)}>
                        {user.subscription_status || 'active'}
                      </span>
                    </td>
                    <td>{user.tokens_remaining || user.current_tokens || 0}</td>
                    <td>
                      {user.is_admin ? (
                        <span className="admin-badge admin-badge-success">כן</span>
                      ) : (
                        <span className="admin-badge admin-badge-warning">לא</span>
                      )}
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('he-IL')}</td>
                    <td>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="admin-button admin-button-primary"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        ערוך
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                עמוד {page} מתוך {totalPages}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="admin-button admin-button-secondary"
                >
                  קודם
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="admin-button admin-button-secondary"
                >
                  הבא
                </button>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            לא נמצאו משתמשים
          </p>
        )}
      </div>

      {editingUser && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">עריכת משתמש</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="admin-modal-close"
              >
                ×
              </button>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">אימייל</label>
              <input
                type="email"
                value={editingUser.email || ''}
                disabled
                className="admin-input"
                style={{ background: '#f3f4f6' }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">שם מלא</label>
              <input
                type="text"
                value={editingUser.full_name || ''}
                onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">סוג מנוי</label>
              <select
                value={editingUser.subscription_tier || 'trial'}
                onChange={(e) => setEditingUser({ ...editingUser, subscription_tier: e.target.value as any })}
                className="admin-input"
              >
                <option value="trial">ניסיון</option>
                <option value="basic">בסיסי</option>
                <option value="premium">פרימיום</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">סטטוס מנוי</label>
              <select
                value={editingUser.subscription_status || 'active'}
                onChange={(e) => setEditingUser({ ...editingUser, subscription_status: e.target.value as any })}
                className="admin-input"
              >
                <option value="active">פעיל</option>
                <option value="cancelled">בוטל</option>
                <option value="expired">פג תוקף</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">טוקנים</label>
              <input
                type="number"
                value={editingUser.current_tokens ?? editingUser.tokens_remaining ?? 0}
                onChange={(e) => {
                  const newTokens = parseInt(e.target.value) || 0;
                  setEditingUser({
                    ...editingUser,
                    current_tokens: newTokens,
                    tokens_remaining: newTokens  // Keep both fields in sync
                  });
                }}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={editingUser.is_admin || false}
                  onChange={(e) => setEditingUser({ ...editingUser, is_admin: e.target.checked })}
                />
                מנהל מערכת
              </label>
            </div>

            <div className="admin-form-actions">
              <button
                onClick={() => setEditingUser(null)}
                className="admin-button admin-button-secondary"
                disabled={updateLoading}
              >
                ביטול
              </button>
              <button
                onClick={() => handleUpdateUser({
                  full_name: editingUser.full_name,
                  subscription_tier: editingUser.subscription_tier,
                  subscription_status: editingUser.subscription_status,
                  tokens_remaining: editingUser.tokens_remaining,
                  is_admin: editingUser.is_admin
                })}
                className="admin-button admin-button-primary"
                disabled={updateLoading}
              >
                {updateLoading ? 'שומר...' : 'שמור שינויים'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  subscription_status: string;
  created_at: string;
}

export default function TestNewsletterPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [testEmail, setTestEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/get-users');
      
      if (!response.ok) {
        // If admin endpoint is not accessible, that's OK - we can still test with custom email
        console.warn('Admin endpoint not accessible (403) - this is OK, use custom email field instead');
        setUsers([]);
        setError('');
        return;
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError('');
    } catch (err: any) {
      console.warn('Could not fetch users (non-critical):', err);
      // Not a critical error - user can still test with custom email
      setUsers([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletterToUser = async (email: string) => {
    try {
      setSendingTo(email);
      setResults({ ...results, [email]: { status: 'sending' } });

      console.log('📧 Sending newsletter to:', email);

      const response = await fetch('/api/notifications/send-newsletter-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, force: true }),
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      setResults({
        ...results,
        [email]: {
          status: response.ok ? 'success' : 'error',
          data,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error('Error sending newsletter:', err);
      setResults({
        ...results,
        [email]: {
          status: 'error',
          error: err.message,
          timestamp: new Date().toISOString(),
        },
      });
    } finally {
      setSendingTo(null);
    }
  };

  const sendToCustomEmail = async () => {
    if (!testEmail) {
      alert('אנא הכנס כתובת מייל');
      return;
    }

    await sendNewsletterToUser(testEmail);
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'var(--font-assistant), sans-serif'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#6D3D47' }}>
          🧪 בדיקת שליחת ניוזלטר
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          דף זה מאפשר לבדוק את שליחת הניוזלטר למשתמשות רשומות במערכת
        </p>
      </div>

      {/* Configuration Status */}
      <div style={{
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#6D3D47' }}>
          📋 סטטוס תצורה
        </h2>
        <p style={{ marginBottom: '10px', color: '#333' }}>
          ✅ בדוק את ה-Console של השרת (טרמינל) לאחר שליחת מייל לראות לוגים מפורטים
        </p>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          הלוגים יציגו את כל הפרטים: API key, sender email, תגובת Brevo ועוד
        </p>
        {users.length === 0 && !loading && (
          <p style={{ marginTop: '15px', padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', fontSize: '0.95rem', color: '#856404' }}>
            💡 <strong>טיפ:</strong> רשימת המשתמשות זמינה רק למנהלים. השתמש בשדה "שליחה למייל ספציפי" למעלה לבדיקה.
          </p>
        )}
      </div>

      {/* Custom Email Test */}
      <div style={{
        background: '#FFF8F0',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '2px solid #DE9FAF'
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#6D3D47' }}>
          🎯 שליחה למייל ספציפי
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your.email@example.com"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #DE9FAF',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={sendToCustomEmail}
            disabled={sendingTo !== null || !testEmail}
            style={{
              padding: '12px 30px',
              background: '#DE9FAF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: sendingTo !== null ? 'not-allowed' : 'pointer',
              opacity: sendingTo !== null || !testEmail ? 0.6 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            {sendingTo === testEmail ? '⏳ שולח...' : '📧 שלח ניוזלטר'}
          </button>
        </div>
        {results[testEmail] && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: results[testEmail].status === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${results[testEmail].status === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '8px',
            fontSize: '0.95rem'
          }}>
            <strong>
              {results[testEmail].status === 'success' ? '✅ נשלח בהצלחה!' : '❌ שגיאה'}
            </strong>
            <pre style={{ marginTop: '8px', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(results[testEmail].data || results[testEmail].error, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Users List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#6D3D47' }}>
            👥 משתמשות רשומות במערכת (אופציונלי)
          </h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#6D3D47',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            🔄 רענן
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            ⏳ טוען משתמשים...
          </div>
        ) : users.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: '#f0f8ff',
            borderRadius: '12px',
            border: '2px dashed #b3d9ff'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>👆 השתמש בשדה למעלה</p>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              רשימת המשתמשות זמינה רק למנהלי המערכת
            </p>
            <p style={{ color: '#004085', fontSize: '0.95rem', fontWeight: '500' }}>
              💡 לבדיקת ניוזלטר, פשוט הכנס כתובת מייל בשדה "שליחה למייל ספציפי" למעלה
            </p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>שם</th>
                  <th style={{ padding: '15px', textAlign: 'right', fontWeight: '600' }}>אימייל</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>סטטוס</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>פעולה</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>תוצאה</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '15px' }}>{user.name || '—'}</td>
                    <td style={{ padding: '15px', direction: 'ltr', textAlign: 'right' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: user.subscription_status === 'active' ? '#d4edda' : '#f8d7da',
                        color: user.subscription_status === 'active' ? '#155724' : '#721c24'
                      }}>
                        {user.subscription_status === 'active' ? '✓ פעיל' : '✗ לא פעיל'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => sendNewsletterToUser(user.email)}
                        disabled={sendingTo !== null}
                        style={{
                          padding: '8px 20px',
                          background: sendingTo === user.email ? '#999' : '#DE9FAF',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: sendingTo !== null ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          opacity: sendingTo !== null && sendingTo !== user.email ? 0.5 : 1
                        }}
                      >
                        {sendingTo === user.email ? '⏳ שולח...' : '📧 שלח'}
                      </button>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                      {results[user.email]?.status === 'sending' && '⏳ שולח...'}
                      {results[user.email]?.status === 'success' && (
                        <span style={{ color: '#28a745', fontWeight: '600' }}>✅ נשלח</span>
                      )}
                      {results[user.email]?.status === 'error' && (
                        <span style={{ color: '#dc3545', fontWeight: '600' }}>❌ שגיאה</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f0f8ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#004085'
          }}>
            <strong>💡 טיפ:</strong> לאחר לחיצה על "שלח", בדוק את ה-Console של השרת (הטרמינל שבו רץ npm run dev) 
            כדי לראות לוגים מפורטים על התהליך: תצורת Brevo, פרטי המייל, תגובת Brevo ועוד.
          </div>
        )}
      </div>
    </div>
  );
}


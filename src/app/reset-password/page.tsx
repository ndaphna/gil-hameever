'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);

  // Users must be authenticated (have a session) to reset their password
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!session || error) {
          setMessage('שגיאה: פג תוקף הקישור או שאינך מחוברת. אנא נסי שוב.');
        }
      } catch (error) {
        console.error('Session check failed', error);
      } finally {
        setSessionChecked(true);
      }
    }
    checkUser();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('שגיאה: הסיסמאות אינן תואמות');
      return;
    }

    if (password.length < 6) {
      setMessage('שגיאה: הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      
      setMessage('הסיסמה עודכנה בהצלחה! מעביר אותך...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      setMessage(error.message || 'שגיאה בעדכון הסיסמה');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="message-box">טוענת...</div>
        </div>
        <style jsx>{`
          .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--gray-light); }
          .auth-container { width: 100%; max-width: 450px; text-align: center; }
          .message-box { padding: 12px 16px; border-radius: 8px; text-align: center; font-size: 14px; background: white; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">איפוס סיסמה</h1>
          
          {message && (
            <div className={`message-box ${message.includes('שגיאה') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {!message.includes('פג תוקף') && !message.includes('בהצלחה') && (
            <form onSubmit={handleUpdatePassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="password">סיסמה חדשה</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הכניסי סיסמה חדשה (לפחות 6 תווים)"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">אישור סיסמה חדשה</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="הקלידי שוב את הסיסמה"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'מעדכנת...' : 'עדכני סיסמה'}
              </button>
            </form>
          )}

          {message.includes('פג תוקף') && (
             <div style={{ marginTop: '20px', textAlign: 'center' }}>
               <a href="/forgot-password" className="auth-button primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                 בקשי קישור חדש
               </a>
             </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-light);
          padding: 20px;
        }

        .auth-container {
          width: 100%;
          max-width: 450px;
        }

        .auth-card {
          background: white;
          border-radius: 12px;
          padding: 40px 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--black);
          text-align: center;
          margin: 0 0 32px 0;
        }

        .message-box {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
        }

        .message-box.error {
          background: #ffe4e4;
          color: #cc0000;
          border: 1px solid #ffcccc;
        }

        .message-box.success {
          background: #e4ffe4;
          color: #00aa00;
          border: 1px solid #ccffcc;
        }

        .auth-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--black);
          font-size: 14px;
          text-align: right;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          text-align: right;
          font-family: inherit;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--magenta);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        .auth-button {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-button.primary {
          background: var(--magenta);
          color: white;
        }

        .auth-button.primary:hover:not(:disabled) {
          background: var(--magenta-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
        }
      `}</style>
    </div>
  );
}

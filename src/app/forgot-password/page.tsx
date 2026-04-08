'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setMessage('נשלח קישור לאיפוס סיסמה לאימייל שלך. אם המייל קיים במערכת, תקבלי אותו בקרוב.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage(error.message || 'שגיאה בשליחת בקשת איפוס סיסמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">שכחתי סיסמה</h1>
          
          {message && (
            <div className={`message-box ${message.includes('שגיאה') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">אימייל</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הכניסי את האימייל שלך"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button primary" disabled={loading || message.includes('נשלח')}>
              {loading ? 'שולחת...' : 'שלחי קישור לאיפוס סיסמה'}
            </button>
          </form>

          <div className="auth-footer">
            נזכרת בסיסמה? <a href="/login">חזרי להתחברות</a>
          </div>
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

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          color: var(--gray);
          font-size: 14px;
        }

        .auth-footer a {
          color: var(--magenta);
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

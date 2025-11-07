'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggingIn) return; // Don't check if we're in the middle of logging in
    
    async function checkUser() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && !error) {
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.log('Session check failed, staying on login page');
        // Don't redirect if there's an error - let user try to login
      }
    }
    checkUser();
  }, [router, isLoggingIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsLoggingIn(true);

    try {
      // Supabase login only - no mock login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful with Supabase:', data.user);
        setMessage('התחברת בהצלחה! מעביר אותך...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error: unknown) {
      console.log('Login failed. Error:', error.message);
      setMessage('שגיאה בהתחברות: ' + error.message);
    } finally {
      setLoading(false);
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setMessage(error.message || 'שגיאה בהתחברות עם Google');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">התחברות</h1>
          
          {message && (
            <div className={`message-box ${message.includes('שגיאה') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
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

            <div className="form-group">
              <label htmlFor="password">סיסמה</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הכניסי את הסיסמה שלך"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-button primary" disabled={loading}>
              {loading ? 'מתחברת...' : 'התחברי'}
            </button>
          </form>

          <div className="divider">
            <span>או</span>
          </div>

          <button onClick={handleGoogleLogin} className="auth-button google" disabled={loading}>
            🔐 התחברי עם Google
          </button>

          <div className="auth-footer">
            עדיין לא רשומה? <a href="/signup">הירשמי כאן</a>
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

        .auth-button.google {
          background: white;
          color: var(--black);
          border: 2px solid #e5e5e5;
        }

        .auth-button.google:hover:not(:disabled) {
          border-color: var(--magenta);
          transform: translateY(-1px);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          text-align: center;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e5e5e5;
        }

        .divider span {
          padding: 0 16px;
          color: var(--gray);
          font-size: 14px;
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

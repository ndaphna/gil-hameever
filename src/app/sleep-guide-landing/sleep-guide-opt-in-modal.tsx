'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './sleep-guide-opt-in-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SleepGuideOptInModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('אנא הכניסי את כתובת המייל שלך.'); return; }
    if (!validateEmail(email)) { setError('כתובת המייל שהזנת אינה תקינה.'); return; }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sleep-guide-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/sleep-guide'), 1500);
      } else {
        setError(data.error || 'שגיאה ברישום. נסי שוב מאוחר יותר.');
      }
    } catch {
      setError('שגיאה בחיבור לשרת. נסי שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="sg-modal-overlay" onClick={handleBackdropClick}>
      <div className="sg-modal" dir="rtl">
        <button className="sg-modal-close" onClick={onClose} aria-label="סגור">×</button>

        <div className="sg-modal-banner">
          <span className="sg-modal-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>

        <div className="sg-modal-content">
          {success ? (
            <div className="sg-modal-success">
              <h2 className="sg-modal-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="sg-modal-success-text">מעבירה אותך עכשיו למדריך...</p>
            </div>
          ) : (
            <>
              <h2 className="sg-modal-heading">מוכנה לישון שוב כמו שצריך?</h2>
              <p className="sg-modal-subheading">הכניסי את המייל שלך והמדריך בדרך אלייך:</p>

              <form onSubmit={handleSubmit} className="sg-modal-form" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="sg-modal-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />

                {error && <div className="sg-modal-error" role="alert">{error}</div>}

                <button
                  type="submit"
                  className="sg-modal-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'שולחת...' : 'שלחי לי את המדריך!'}
                </button>
              </form>

              <p className="sg-modal-privacy">
                אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי (:
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

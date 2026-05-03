'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './hot-flash-zoom-opt-in-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function HotFlashZoomOptInModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('אנא הכניסי את כתובת המייל שלך.');
      return;
    }
    if (!validateEmail(email)) {
      setError('כתובת המייל שהזנת אינה תקינה.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/hot-flash-zoom-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/hot-flash-zoom'), 1500);
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
    <div className="hfz-modal-overlay" onClick={handleBackdropClick}>
      <div className="hfz-modal" dir="rtl">
        <button className="hfz-modal-close" onClick={onClose} aria-label="סגור">
          ×
        </button>

        <div className="hfz-modal-banner">
          <span className="hfz-modal-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>

        <div className="hfz-modal-content">
          {success ? (
            <div className="hfz-modal-success">
              <h2 className="hfz-modal-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="hfz-modal-success-text">מעבירה אותך עכשיו...</p>
            </div>
          ) : (
            <>
              <h2 className="hfz-modal-heading">מוכנה לקבל את הפרוטוקול?</h2>
              <p className="hfz-modal-subheading">הכניסי שם ומייל וזה בדרך אלייך:</p>

              <form onSubmit={handleSubmit} className="hfz-modal-form" noValidate>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלך..."
                  className="hfz-modal-input"
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="given-name"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="hfz-modal-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />

                {error && (
                  <div className="hfz-modal-error" role="alert">
                    {error}
                  </div>
                )}

                <button type="submit" className="hfz-modal-button" disabled={isLoading}>
                  {isLoading ? 'שולחת...' : 'שלחי לי את הפרוטוקול!'}
                </button>
              </form>

              <p className="hfz-modal-privacy">
                אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי (:
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

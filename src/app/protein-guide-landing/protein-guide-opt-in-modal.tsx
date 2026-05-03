'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './protein-guide-opt-in-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProteinGuideOptInModal({ isOpen, onClose }: Props) {
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
      const response = await fetch('/api/protein-guide-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/protein-guide'), 1500);
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
    <div className="pg-modal-overlay" onClick={handleBackdropClick}>
      <div className="pg-modal" dir="rtl">
        <button className="pg-modal-close" onClick={onClose} aria-label="סגור">×</button>

        <div className="pg-modal-banner">
          <span className="pg-modal-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>

        <div className="pg-modal-content">
          {success ? (
            <div className="pg-modal-success">
              <h2 className="pg-modal-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="pg-modal-success-text">מעבירה אותך עכשיו...</p>
            </div>
          ) : (
            <>
              <h2 className="pg-modal-heading">מוכנה לקבל את הרשימה?</h2>
              <p className="pg-modal-subheading">הכניסי את המייל שלך וזה בדרך אלייך:</p>

              <form onSubmit={handleSubmit} className="pg-modal-form" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="pg-modal-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />

                {error && <div className="pg-modal-error" role="alert">{error}</div>}

                <button
                  type="submit"
                  className="pg-modal-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'שולחת...' : 'שלחי לי את הרשימה!'}
                </button>
              </form>

              <p className="pg-modal-privacy">
                אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי (:
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

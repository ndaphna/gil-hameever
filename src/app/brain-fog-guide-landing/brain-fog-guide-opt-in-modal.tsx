'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './brain-fog-guide-opt-in-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrainFogGuideOptInModal({ isOpen, onClose }: Props) {
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
      const response = await fetch('/api/brain-fog-guide-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/brain-fog-guide'), 1500);
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
    <div className="bfg-modal-overlay" onClick={handleBackdropClick}>
      <div className="bfg-modal" dir="rtl">
        <button className="bfg-modal-close" onClick={onClose} aria-label="סגור">×</button>
        <div className="bfg-modal-banner">
          <span className="bfg-modal-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>
        <div className="bfg-modal-content">
          {success ? (
            <div className="bfg-modal-success">
              <h2 className="bfg-modal-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="bfg-modal-success-text">מעבירה אותך עכשיו...</p>
            </div>
          ) : (
            <>
              <h2 className="bfg-modal-heading">מוכנה לקבל את הכלים?</h2>
              <p className="bfg-modal-subheading">הכניסי את המייל שלך וזה בדרך אלייך:</p>
              <form onSubmit={handleSubmit} className="bfg-modal-form" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="bfg-modal-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />
                {error && (
                  <div className="bfg-modal-error" role="alert">{error}</div>
                )}
                <button type="submit" className="bfg-modal-button" disabled={isLoading}>
                  {isLoading ? 'שולחת...' : 'שלחי לי את המדריך!'}
                </button>
              </form>
              <p className="bfg-modal-privacy">אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי (:</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

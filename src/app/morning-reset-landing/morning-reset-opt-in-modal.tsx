'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './morning-reset-opt-in-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MorningResetOptInModal({ isOpen, onClose }: Props) {
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
      const response = await fetch('/api/morning-reset-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/morning-reset'), 1500);
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
    <div className="mr-modal-overlay" onClick={handleBackdropClick}>
      <div className="mr-modal" dir="rtl">
        <button className="mr-modal-close" onClick={onClose} aria-label="סגור">×</button>
        <div className="mr-modal-banner">
          <span className="mr-modal-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>
        <div className="mr-modal-content">
          {success ? (
            <div className="mr-modal-success">
              <h2 className="mr-modal-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="mr-modal-success-text">מעבירה אותך עכשיו...</p>
            </div>
          ) : (
            <>
              <h2 className="mr-modal-heading">מוכנה לאיפוס הבוקר?</h2>
              <p className="mr-modal-subheading">הכניסי את המייל שלך וזה בדרך אלייך:</p>
              <form onSubmit={handleSubmit} className="mr-modal-form" noValidate>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלך..."
                  className="mr-modal-input"
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="given-name"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="mr-modal-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />
                {error && (
                  <div className="mr-modal-error" role="alert">{error}</div>
                )}
                <button type="submit" className="mr-modal-button" disabled={isLoading}>
                  {isLoading ? 'שולחת...' : 'שלחי לי את הפרוטוקול'}
                </button>
              </form>
              <p className="mr-modal-privacy">אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי (:</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

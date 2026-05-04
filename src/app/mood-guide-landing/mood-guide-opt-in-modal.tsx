'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './mood-guide-opt-in-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoodGuideOptInModal({ isOpen, onClose }: Props) {
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
      const response = await fetch('/api/mood-guide-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/mood-guide'), 1500);
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
    <div className="mg-modal-overlay" onClick={handleBackdropClick}>
      <div className="mg-modal" dir="rtl">
        <button className="mg-modal-close" onClick={onClose} aria-label="סגור">
          ×
        </button>
        <div className="mg-modal-banner">
          <span className="mg-modal-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>
        <div className="mg-modal-content">
          {success ? (
            <div className="mg-modal-success">
              <h2 className="mg-modal-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="mg-modal-success-text">מעבירה אותך עכשיו...</p>
            </div>
          ) : (
            <>
              <h2 className="mg-modal-heading">מוכנה לקבל את הכלים?</h2>
              <p className="mg-modal-subheading">הכניסי את הפרטים שלך וזה בדרך אלייך:</p>
              <form onSubmit={handleSubmit} className="mg-modal-form" noValidate>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="השם שלך..."
                  className="mg-modal-input"
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="given-name"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="mg-modal-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />
                {error && (
                  <div className="mg-modal-error" role="alert">
                    {error}
                  </div>
                )}
                <button type="submit" className="mg-modal-button" disabled={isLoading}>
                  {isLoading ? 'שולחת...' : 'כן, שלחי לי את המדריך'}
                </button>
              </form>
              <p className="mg-modal-privacy">אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי (:</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

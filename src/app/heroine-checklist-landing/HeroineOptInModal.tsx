'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './heroine-opt-in-modal.css';

interface HeroineOptInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeroineOptInModal({ isOpen, onClose }: HeroineOptInModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('אנא הכניסי את כתובת המייל שלך.');
      return;
    }

    if (!validateEmail(email)) {
      setError('כתובת המייל שהזנת אינה תקינה. נסי שוב.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/heroine-checklist-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect after 1.5 seconds
        setTimeout(() => {
          router.push('/heroine-checklist-valuable-content');
        }, 1500);
      } else {
        setError(data.error || 'שגיאה ברישום. נסי שוב מאוחר יותר.');
      }
    } catch (err) {
      setError('שגיאה בחיבור לשרת. נסי שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="hc-opt-in-overlay" onClick={handleBackdropClick}>
      <div className="hc-opt-in-modal" dir="rtl">
        {/* Close Button - top-left per RTL spec */}
        <button className="hc-opt-in-close" onClick={onClose} aria-label="סגור">
          ×
        </button>

        {/* Top Banner */}
        <div className="hc-opt-in-banner">
          <span className="hc-opt-in-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>

        {/* Main Content */}
        <div className="hc-opt-in-content">
          {success ? (
            <div className="hc-opt-in-success">
              <h2 className="hc-opt-in-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="hc-opt-in-success-text">
                מעבירה אותך עכשיו...
              </p>
            </div>
          ) : (
            <>
              {/* Main Heading */}
              <h2 className="hc-opt-in-heading">
                מוכנה להחזיר לעצמך את הערב?
              </h2>

              {/* Instructions */}
              <p className="hc-opt-in-subheading">
                הכניסי את המייל שלך כאן, וצ&#8217;ק-ליסט הגיבורות בדרך אלייך:
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="hc-opt-in-form" noValidate>
                {/* Email Input */}
                <input
                  type="email"
                  id="heroine-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="hc-opt-in-input"
                  required
                  disabled={isLoading}
                  dir="rtl"
                  autoComplete="email"
                />

                {/* Error Message */}
                {error && <div className="hc-opt-in-error" role="alert">{error}</div>}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="heroine-submit-button"
                  className="hc-opt-in-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'שולחת...' : 'שלחי לי את הצ\'ק-ליסט!'}
                </button>
              </form>

              {/* Privacy Notice */}
              <p className="hc-opt-in-privacy">
                אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי ותוכלי להסיר את עצמך בכל עת (:
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './opt-in-modal.css';

interface OptInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OptInModal({ isOpen, onClose }: OptInModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/emergency-map-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect to emergency map page after 1.5 seconds
        setTimeout(() => {
          router.push('/emergency-map');
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
    <div className="opt-in-overlay" onClick={handleBackdropClick}>
      <div className="opt-in-modal" dir="rtl">
        {/* Close Button */}
        <button className="opt-in-close" onClick={onClose} aria-label="סגור">
          ×
        </button>

        {/* Progress Banner */}
        <div className="opt-in-banner">
          <span className="opt-in-banner-text">שלב אחד אחרון וזה אצלך.</span>
        </div>

        {/* Main Content */}
        <div className="opt-in-content">
          {success ? (
            <div className="opt-in-success">
              <h2 className="opt-in-success-title">✅ ההרשמה בוצעה בהצלחה!</h2>
              <p className="opt-in-success-text">
                מעבירה אותך למפת החירום...
              </p>
            </div>
          ) : (
            <>
              {/* Main Heading */}
              <h2 className="opt-in-heading">
                הגיע הזמן לעשות סדר בשינויים של גיל המעבר.
              </h2>

              {/* Sub Heading */}
              <p className="opt-in-subheading">
                כדי שאוכל לשלוח לך את המדריך (ולעדכן אותך בעוד כלים שיעזרו לך
                לעבור את התקופה הזו בקלות), הכניסי כאן את המייל שלך 👇
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="opt-in-form">
                {/* Email Input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="המייל שלך כאן..."
                  className="opt-in-input"
                  required
                  disabled={isLoading}
                />

                {/* Error Message */}
                {error && <div className="opt-in-error">{error}</div>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="opt-in-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'שולח...' : 'שלחי לי את המדריך למייל'}
                </button>
              </form>

              {/* Privacy Notice */}
              <p className="opt-in-privacy">
                אני שונאת ספאם בדיוק כמוך. המייל שלך בטוח אצלי ותוכלי להסיר את
                עצמך בכל עת :)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


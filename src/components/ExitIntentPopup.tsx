'use client';

import { useState } from 'react';
import './ExitIntentPopup.css';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess?: () => void;
}

export default function ExitIntentPopup({ isOpen, onClose, onSignupSuccess }: ExitIntentPopupProps) {
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
      const response = await fetch('/api/newsletter/exit-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Call onSignupSuccess callback to mark as signed up
        if (onSignupSuccess) {
          setTimeout(() => {
            onSignupSuccess();
          }, 3000); // Close after 3 seconds to let user read the success message
        }
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
    <div className="exit-intent-overlay" onClick={handleBackdropClick}>
      <div className="exit-intent-modal" dir="rtl">
        {/* Close Button */}
        <button 
          className="exit-intent-close" 
          onClick={onClose} 
          aria-label="סגור"
        >
          ×
        </button>

        {/* Main Content */}
        <div className="exit-intent-content">
          {success ? (
            <div className="exit-intent-success">
              <h2 className="exit-intent-headline exit-intent-success-headline">
                ברוכה הבאה לקהילה, גיבורה! 🌸
              </h2>
              <p className="exit-intent-text exit-intent-success-text">
                איזה כיף שאת איתנו. המדריך והמייל הראשון כבר בדרך לתיבת הדואר שלך (אל תשכחי לבדוק גם בקידומי מכירות).
              </p>
              <div className="exit-intent-aliza">
                <div className="exit-intent-aliza-content">
                  <img 
                    src="https://i.imghippo.com/files/PBO6077Nec.jpg" 
                    alt="עליזה"
                    className="exit-intent-aliza-image"
                  />
                  <p className="exit-intent-aliza-text">
                    <span className="exit-intent-aliza-name">עליזה מוסיפה:</span> "מאמי, רוצי לבדוק את המייל. שמתי שם משהו ששווה קריאה."
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Headline */}
              <h2 className="exit-intent-headline">
                רגע לפני שאת עוזבת...
              </h2>

              {/* Main Text */}
              <p className="exit-intent-text">
                אל תשארי עם גלי החום (והבלבול) לבד. בואי להיות חלק מקהילה של נשים גיבורות שעוברות את זה יחד - עם ידע, חמלה והרבה הומור.
              </p>
              
              <p className="exit-intent-bonus">
                <strong>Bonus:</strong> עם ההצטרפות אשלח לך את המדריך <span className="exit-intent-highlight">7 דברים שאף אחד לא הכין אותי אליהם בגיל המעבר</span> ועדכונים על הספר החדש.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="exit-intent-form">
                {/* Email Input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="הכניסי את כתובת המייל שלך"
                  className="exit-intent-input"
                  required
                  disabled={isLoading}
                />

                {/* Error Message */}
                {error && <div className="exit-intent-error">{error}</div>}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="exit-intent-button cta-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'שולח...' : 'אני רוצה להצטרף לקהילת הגיבורות'}
                </button>
              </form>

              {/* Aliza's Touch */}
              <div className="exit-intent-aliza">
                <div className="exit-intent-aliza-content">
                  <img 
                    src="https://i.imghippo.com/files/PBO6077Nec.jpg" 
                    alt="עליזה"
                    className="exit-intent-aliza-image"
                  />
                  <p className="exit-intent-aliza-text">
                    <span className="exit-intent-aliza-name">עליזה מוסיפה:</span> "מאמי, קהילה זה כמו מאוורר בלילה של אוגוסט - פשוט אי אפשר בלי זה."
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

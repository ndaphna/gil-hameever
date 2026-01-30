'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import './walking-medicine-access.css';

export default function WalkingMedicineAccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('יש לאשר את תנאי ההרשמה');
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      setError('כתובת אימייל היא שדה חובה');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/walking-medicine-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      // Redirect to walking medicine article page after successful signup
      window.location.href = 'https://www.gilhameever.com/walking-medicine-menopause';
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="walking-medicine-access-page" dir="rtl">
      <div className="walking-medicine-access-container">
        {/* Hero Section */}
        <div className="walking-medicine-access-hero">
          <h1 className="walking-medicine-access-title">
            הנה הצעד הראשון שלך להחזרת השליטה: המאמר "הליכה כתרופה לגיל המעבר" מחכה לך
          </h1>
          
          <p className="walking-medicine-access-subtitle">
            הזיני פרטים וקבלי גישה מיידית למאמר (וגם עותק ישירות למייל שיהיה לך זמין תמיד)
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="walking-medicine-access-form">
          {/* Name Field */}
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              שם פרטי
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="הכניסי את שמך הפרטי"
              disabled={isSubmitting}
            />
          </div>

          {/* Email Field */}
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              אימייל <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="הכניסי את כתובת המייל שלך"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Consent Checkbox */}
          <div className="form-checkbox-wrapper">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="form-checkbox"
              disabled={isSubmitting}
            />
            <label htmlFor="consent" className="form-checkbox-label">
              אני מאשרת הרשמה
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'שולח...' : 'לקריאת המאמר עכשיו'}
          </button>
        </form>

        {/* Aliza Section */}
        <div className="walking-medicine-access-aliza">
          <div className="aliza-content">
            <img 
              src="https://i.imghippo.com/files/PBO6077Nec.jpg" 
              alt="עליזה"
              className="aliza-image"
            />
            <p className="aliza-text">
              <span className="aliza-name">עליזה מוסיפה:</span> "מאמי, קהילה זה כמו מאוורר בלילה של אוגוסט - פשוט אי אפשר בלי זה."
            </p>
          </div>
          <p className="aliza-consent-text">
            אני מאשרת חומר פרסומי והטבות במייל, ו-SMS מענבל דפנה
          </p>
        </div>
      </div>
    </div>
  );
}

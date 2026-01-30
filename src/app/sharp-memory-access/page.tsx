'use client';

import { useState, FormEvent } from 'react';
import './sharp-memory-access.css';

export default function SharpMemoryAccessPage() {
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
      const response = await fetch('/api/sharp-memory-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      });

      const text = await response.text();
      let data: { success?: boolean; error?: string };
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: 'שגיאה בשרת. נסי שוב מאוחר יותר.' };
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      window.location.href = 'https://www.gilhameever.com/sharp-memory-menopause';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sharp-memory-access-page" dir="rtl">
      <div className="sharp-memory-access-container">
        <div className="sharp-memory-access-hero">
          <h1 className="sharp-memory-access-title">
            הנה הצעד הראשון שלך להחזרת השליטה: הסוד לזיכרון חד בגיל המעבר מחכה לך
          </h1>
          <p className="sharp-memory-access-subtitle">
            הזיני פרטים וגלי מיד איך המוח שלך לא &apos;בשיפוצים&apos; אלא בהשתדרגות (וגם עותק למייל שיהיה לך זמין תמיד)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sharp-memory-access-form">
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

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="form-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'שולח...' : 'גלי לי את הסוד לזיכרון'}
          </button>
        </form>

        <div className="sharp-memory-access-aliza">
          <div className="aliza-content">
            <img
              src="https://i.imghippo.com/files/PBO6077Nec.jpg"
              alt="עליזה"
              className="aliza-image"
            />
            <p className="aliza-text">
              <span className="aliza-name">עליזה מוסיפה:</span> &quot;מאמי, קהילה זה כמו מאוורר בלילה של אוגוסט - פשוט אי אפשר בלי זה.&quot;
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

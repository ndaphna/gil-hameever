/**
 * ========================================
 * LEAD MAGNET LANDING PAGE #8
 * Instagram Bio Link → Form → Brevo List #8
 * ========================================
 */

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/waitlist.css';

// ========================================
// CONFIGURATION
// ========================================
const LIST_ID = 8; // Brevo list ID for this specific landing page

// ========================================
// FORM DATA INTERFACE
// ========================================
interface FormData {
  name: string;
  email: string;
}

// ========================================
// LANDING PAGE COMPONENT
// ========================================
export default function LeadGift8Page() {
  const router = useRouter();

  // State management
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [consent, setConsent] = useState(false);

  // Form handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!consent) {
      setError('יש לאשר את תנאי ההרשמה');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead-gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          listId: LIST_ID,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('שגיאת תקשורת עם השרת. נסי שוב מאוחר יותר.');
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'שגיאה בשליחת הטופס');
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/thank-you');
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.'
      );
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="waitlist-landing">
        <section
          className="container"
          style={{
            paddingTop: 'clamp(80px, 14vw, 120px)',
            paddingBottom: 'clamp(60px, 10vw, 80px)',
            textAlign: 'center',
          }}
        >
          <div className="thank-you-card">
            <p>
              <span className="emoji">🌸</span>
              תודה שבחרת להצטרף
            </p>
            <p className="message" style={{ marginBottom: '20px' }}>
              המייל עם <span className="highlight">המתנה</span> כבר בדרך אלייך!
            </p>
            <p
              className="message"
              style={{
                marginTop: 'clamp(32px, 6vw, 48px)',
                paddingTop: 'clamp(28px, 5vw, 40px)',
                borderTop: '2px solid rgba(255, 0, 128, 0.15)',
                fontWeight: '600',
              }}
            >
              מעבירה אותך לדף תודה...
            </p>
          </div>
        </section>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="waitlist-landing">
      {/* Hero Section */}
      <section className="waitlist-hero">
        <div className="hero-content">
          <h1>
            🌸 מפת החירום:
            <br />
            מה לעזאזל קורה לי
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container">
        {/* Opening */}
        <h2 style={{ textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 32px)' }}>
          הכל בסדר איתך.
        </h2>

        <p style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
          marginBottom: 'clamp(40px, 7vw, 60px)'
        }}>
          זה רק הגוף שלך מבקש ממך להבין אותו, סוף־סוף.
        </p>

        {/* Main Message Box */}
        <div className="content-box" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 242, 250, 0.5) 0%, rgba(255, 235, 248, 0.3) 100%)'
        }}>
          <h3 style={{ textAlign: 'center' }}>
            🔥 גיל המעֵבֶר: לא סוף. <span className="highlight">התחלה!</span>
          </h3>
          
          <p>
            רוב הנשים נכנסות לשלב הזה בלי הכנה מוקדמת, בלי הסברים, ועם הרבה פחד.
          </p>

          <p style={{ fontWeight: '600', marginTop: '28px', marginBottom: '20px' }}>
            פתאום:
          </p>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '12px' }}>❌ השינה נהיית שבורה</li>
            <li style={{ marginBottom: '12px' }}>❌ גלי חום באמצע היום</li>
            <li style={{ marginBottom: '12px' }}>❌ ערפל מוחי</li>
            <li style={{ marginBottom: '12px' }}>❌ בטן שלא יורדת</li>
            <li style={{ marginBottom: '12px' }}>❌ רגישות רגשית</li>
            <li style={{ marginBottom: '12px' }}>❌ ירידה בחשק</li>
            <li style={{ marginBottom: '12px' }}>❌ "אני לא מזהה את עצמי"</li>
          </ul>

          <p style={{ marginTop: '28px', fontWeight: '600' }}>
            וזה מרגיש כמו תקלה פנימית.
          </p>

          <p style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', fontWeight: '600' }}>
            אבל זו <span className="highlight">לא תקלה</span>.
          </p>

          <p style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', fontWeight: '600' }}>
            זו ביולוגיה.
          </p>

          <p style={{ 
            fontSize: 'clamp(1.25rem, 2.8vw, 1.5rem)', 
            fontWeight: '700',
            marginTop: '24px',
            color: 'var(--magenta)'
          }}>
            וכשמבינים אותה - הכול מתחיל להסתדר.
          </p>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <p style={{ textAlign: 'center', lineHeight: '1.6' }}>
            הכניסי את המייל שלך וקבלי <span className="highlight">מתנה מדריך חינמי</span> שיעשה לך סוף־סוף סדר בראש, בגוף ובנשמה - ב־10 דקות בלבד.
          </p>
        </div>

        {/* Form */}
        <div className="waitlist-form">
          <form onSubmit={handleSubmit}>
            <h2 className="waitlist-form-title">הירשמי לקבלת מדריך חינמי</h2>
            <p className="waitlist-form-subtitle">הכניסי את הפרטים כאן למטה והצטרפי לגלי ההשראה</p>
            
            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Name */}
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="שם"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="אימייל"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="waitlist-form-consent">
              <label className="waitlist-consent-label">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  disabled={isSubmitting}
                />
                <span className="waitlist-consent-text">
                  אני מאשרת להצטרף לגלי ההשראה ולקבל עדכונים, כלים מעשיים ומסרים מעצימים.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="cta-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שולחת...' : 'שלחי לי את המדריך החינמי 🎁'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

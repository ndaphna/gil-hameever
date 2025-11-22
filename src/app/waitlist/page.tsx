'use client';

import { useState } from 'react';
import '@/styles/waitlist.css';
import '../globals.css';
import { landingCopy } from '@/content/landing-copy';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    console.log('📤 Submitting waitlist form...', { name: formData.name, email: formData.email });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      console.log('📥 Response status:', response.status, response.statusText);

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Response is not JSON:', contentType);
        throw new Error('שגיאת תקשורת עם השרת. נסי שוב מאוחר יותר.');
      }

      const data = await response.json();
      console.log('📥 API response:', { status: response.status, data });

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      console.log('✅ Form submitted successfully!');
      setIsSubmitted(true);
      // Redirect to gift page after a moment
      setTimeout(() => {
        window.location.href = '/waitlist/gift';
      }, 2000);
    } catch (err) {
      console.error('❌ Form submission error:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="waitlist-landing">
        <section className="container" style={{ 
          paddingTop: 'clamp(80px, 14vw, 120px)',
          paddingBottom: 'clamp(60px, 10vw, 80px)',
          textAlign: 'center'
        }}>
          <div className="thank-you-card">
            <p>
              <span className="emoji">🌸</span>
              תודה שבחרת להצטרף
            </p>
            <p className="message" style={{ marginBottom: '20px' }}>
              ביחד נגדיר מחדש את <span className="highlight">גיל המעבר</span>
            </p>
            <p className="message">
              לא גיל הבלות, אלא <span className="highlight">גיל הפריחה</span> 🌸
            </p>
            <p className="message" style={{ 
              marginTop: 'clamp(32px, 6vw, 48px)', 
              paddingTop: 'clamp(28px, 5vw, 40px)',
              borderTop: '2px solid rgba(255, 0, 128, 0.15)',
              fontWeight: '600'
            }}>
              מעבירה אותך לדף המתנה...
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="waitlist-landing">
      {/* Hero Section */}
      <section className="waitlist-hero">
        <div className="hero-content">
          <h1>
            {landingCopy.mainTitle}
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container">
        <h2>
          <span dangerouslySetInnerHTML={{ __html: landingCopy.subTitleBlock[0].replace(/ספר/g, '<span class="highlight">ספר</span>') }} />
        </h2>
        <p>
          {landingCopy.subTitleBlock[1]}
        </p>
        <p>
          {landingCopy.subTitleBlock[2]}
        </p>
        <p style={{ 
          color: 'var(--magenta)',
          fontWeight: '700',
          marginBottom: 'clamp(40px, 7vw, 60px)'
        }}>
          <span dangerouslySetInnerHTML={{ __html: landingCopy.subTitleBlock[3].replace(/(המתנה|בלעדי)/gi, '<span class="highlight">$1</span>') }} />
        </p>

        {/* About Section */}
        <div className="content-box" style={{ marginTop: '0' }}>
          <p style={{ fontWeight: '600', marginBottom: 'clamp(20px, 4vw, 28px)' }}>
            היי, אני ענבל דפנה.
          </p>
          <p>
            לפני כמה שנים הגוף שלי התחיל לדבר איתי בשפה שלא הכרתי - כאבי ראש, גלי חום, עייפות מוזרה, דיכדוך, עצבים בלי סיבה.
          </p>
          <p>
            ואת האמת? לא ידעתי למי לפנות, ואף אחד לא הכין אותי לזה.
          </p>
          <p>
            ברגע שהבנתי כמה נשים עוברות את זה בשקט, החלטתי לכתוב ספר שיעשה סוף לשתיקה, וייתן לנו מילים, ידע, הומור ותקווה.
          </p>
          <p>
            אם את רוצה להיות בין הראשונות לקבל הצצה, עדכונים
            <br />
            ומתנה ממני לדרך - אני אשמח שתצטרפי.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="content-box" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 242, 250, 0.5) 0%, rgba(255, 235, 248, 0.3) 100%)'
        }}>
          <h3>
            <span dangerouslySetInnerHTML={{ __html: landingCopy.whatYouGetTitle.replace(/(בלעדי|ראשונות)/g, '<span class="highlight">$1</span>') }} />
          </h3>
          <ul>
            {landingCopy.whatYouGet.map((item, index) => (
              <li key={index}>
                <span>✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Who I Am Section */}
        <div className="content-box">
          <h3>
            <span dangerouslySetInnerHTML={{ __html: landingCopy.whoAmITitle.replace(/(מנופאוזה|מי אני)/gi, '<span class="highlight">$1</span>') }} />
          </h3>
          <p>
            אני כותבת, חוקרת ומדברת על מנופאוזה ופרימנופאוזה
            <br />
            עם כתיבה מהלב, הומור והרבה אמת.
          </p>
          <p style={{ fontWeight: '600' }}>
            המטרה שלי פשוטה:
          </p>
          <p>
            לעזור לנשים בגיל 45-60 להבין מה קורה בגוף ובנפש, להרגיש טוב יותר, ולגלות מחדש שזו לא ירידה - זו התחלה של גיל המעֵבֶר.
          </p>
        </div>

        {/* CTA Button */}
        <div className="cta-section">
          <p>
            <span className="emoji">🎁</span>
            אני בפנים - שלחי לי את <span className="highlight">המתנה</span>
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="waitlist-form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">
                {landingCopy.formFields.fullName}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="הכנסי את שמך המלא"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                {landingCopy.formFields.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className="cta-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'שולח...' : landingCopy.ctaButton}
            </button>
          </form>
        </div>

        {/* Thank You Message */}
        <div className="thank-you-card">
          <p>
            <span className="emoji">🌸</span>
            תודה שבחרת להצטרף
          </p>
          <p className="message">
            ביחד נגדיר מחדש את <span className="highlight">גיל המעבר</span> 
            <br />
            לא גיל הבלות, אלא <span className="highlight">גיל הפריחה</span> 🌸
          </p>
        </div>
      </section>
    </div>
  );
}

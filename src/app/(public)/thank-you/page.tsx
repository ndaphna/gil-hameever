/**
 * ========================================
 * THANK YOU PAGE
 * Displayed after successful lead magnet signup
 * ========================================
 * 
 * This page is shown after a user successfully signs up
 * from any lead-gift landing page and the gift email is sent.
 */

'use client';

import Link from 'next/link';
import '@/styles/waitlist.css';

export default function ThankYouPage() {
  return (
    <div className="waitlist-landing">
      {/* Hero Section */}
      <section className="waitlist-hero">
        <div className="hero-content">
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            תודה שהצטרפת! 🌸
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container">
        {/* Success Message */}
        <div
          className="content-box"
          style={{
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(255, 242, 250, 0.8) 0%, rgba(255, 235, 248, 0.6) 100%)',
            border: '2px solid rgba(255, 0, 128, 0.2)',
            boxShadow: '0 12px 48px rgba(255, 0, 128, 0.15)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 1.875rem)',
              fontWeight: '700',
              marginBottom: 'clamp(24px, 5vw, 32px)',
            }}
          >
            <span style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>🎁</span>
            <br />
            המתנה שלך בדרך אלייך!
          </p>
          <p style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)' }}>
            בדקי את תיבת הדואר האלקטרוני שלך
            <br />
            (וגם את תיקיית הספאם, למקרה שהמייל החליט להתחבא שם 😊)
          </p>
        </div>

        {/* What's Next Section */}
        <div className="content-box">
          <h3>⭐ מה הלאה?</h3>
          <p>
            <strong>המייל עם המדריך המתנה</strong> כבר נשלח אלייך והוא מחכה לך
            בתיבת הדואר.
          </p>
          <p>
            בינתיים, אני שמחה להזמין אותך להמשיך להכיר את{' '}
            <span className="highlight">מנופאוזית וטוב לה</span> - המקום שלנו בגיל
            המעבר.
          </p>
          <p>כאן תמצאי:</p>
          <ul style={{ textAlign: 'right', marginTop: '20px' }}>
            <li>
              <span>🌿</span>
              מאמרים מעשיים ומדעיים על גיל המעבר
            </li>
            <li>
              <span>💪</span>
              כלים וטיפים להתמודדות עם תסמינים
            </li>
            <li>
              <span>🤝</span>
              קהילה תומכת של נשים שעוברות את אותו הדבר
            </li>
            <li>
              <span>💗</span>
              הומור, כנות והרבה תמיכה
            </li>
          </ul>
        </div>

        {/* Articles Section */}
        <div className="content-box" style={{ textAlign: 'center' }}>
          <h3>📚 קראי מאמרים נוספים</h3>
          <p style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
            גלי לך במגוון מאמרים מעמיקים על גיל המעבר, בריאות, תזונה ואורח חיים בריא
          </p>
          <Link href="/articles" style={{ textDecoration: 'none' }}>
            <button className="cta-button" style={{ minWidth: '280px' }}>
              📖 גלי למאמרים שלנו
            </button>
          </Link>
        </div>

        {/* CTA to Homepage */}
        <div className="cta-section">
          <p style={{ marginBottom: 'clamp(28px, 5vw, 36px)' }}>
            מוכנה להמשיך את המסע?
          </p>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="cta-button">
              בואי נכיר את האתר! 🌸
            </button>
          </Link>
        </div>

        {/* Social Media Section */}
        <div
          className="content-box"
          style={{
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 242, 250, 0.6) 100%)',
          }}
        >
          <h3>📱 בואי נישאר בקשר</h3>
          <p style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
            עקבי אחרי <span className="highlight">מנופאוזית וטוב לה</span>{' '}
            באינסטגרם
            <br />
            לתוכן יומיומי, טיפים ושיחות כנות על גיל המעבר
          </p>
          <a
            href="https://www.instagram.com/inbal_daphna/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button
              className="cta-button"
              style={{
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                minWidth: '260px',
              }}
            >
              📸 עקבי אחרי באינסטגרם (@inbal_daphna)
            </button>
          </a>
        </div>

        {/* Final Thank You */}
        <div className="thank-you-card">
          <p>
            <span className="emoji">💗</span>
            תודה ששילבת אותי במסע שלך
          </p>
          <p className="message">
            ביחד נגלה שגיל המעבר זה לא סוף,
            <br />
            זו <span className="highlight">התחלה חדשה</span> 🌸
          </p>
          <p
            className="message"
            style={{
              marginTop: 'clamp(32px, 6vw, 48px)',
              paddingTop: 'clamp(28px, 5vw, 40px)',
              borderTop: '2px solid rgba(255, 0, 128, 0.15)',
            }}
          >
            באהבה,
            <br />
            <span
              style={{
                color: 'var(--magenta)',
                fontWeight: '700',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              }}
            >
              ענבל דפנה
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}


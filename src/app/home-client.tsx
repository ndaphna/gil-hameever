'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, FormEvent } from 'react';
import './home.css';

function useInViewOnce<T extends HTMLElement>(amount = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, inView]);
  return { ref, inView };
}

const heartFilled = (
  <svg viewBox="0 0 24 22" aria-hidden="true">
    <path
      d="M12 20.5C12 20.5 4 15.7 2.4 10.6C1.2 6.7 3.7 3 7.5 3C9.5 3 11 4.1 12 5.6C13 4.1 14.5 3 16.5 3C20.3 3 22.8 6.7 21.6 10.6C20 15.7 12 20.5 12 20.5Z"
      fill="currentColor"
    />
  </svg>
);

const heartOutline = (
  <svg viewBox="0 0 24 22" aria-hidden="true">
    <path
      d="M12 20.5C12 20.5 4 15.7 2.4 10.6C1.2 6.7 3.7 3 7.5 3C9.5 3 11 4.1 12 5.6C13 4.1 14.5 3 16.5 3C20.3 3 22.8 6.7 21.6 10.6C20 15.7 12 20.5 12 20.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    />
  </svg>
);

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const pain = useInViewOnce<HTMLElement>(0.2);
  const worlds = useInViewOnce<HTMLElement>(0.2);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('יש לאשר את תנאי ההרשמה');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/inspiration-waves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }
      setIsSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home">
      {/* ============================================
          1 · HERO — light editorial, photo bleeds edge-to-edge
          ============================================ */}
      <section className="home-hero" aria-labelledby="hero-headline">
        <div className="hero-grid">
          <div className="hero-photo">
            <Image
              src="/inbal-hero-book-v2.png"
              alt="ענבל דפנה עם הספר 'לא גברת, גיבורה'"
              fill
              sizes="(max-width: 900px) 45vw, 42vw"
              priority
              className="hero-photo-img"
            />
          </div>

          <div className="hero-text">
            <h1 id="hero-headline" className="hero-headline">
              <span className="hero-line-plain">לא ״גברת״,</span>
              <span className="hero-gibora">גי-<br />בו-<br />רה!</span>
            </h1>
            <p className="hero-sub">סיפור מסע אל גיל המעבר</p>
            <div className="hero-ctas">
              <Link href="/menopause-roadmap" className="btn btn-primary btn-pulse">
                קחי את מפת הדרכים
              </Link>
              <Link href="/book-preview" className="btn btn-ghost-dark">
                ספרי לי על הספר
              </Link>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-dot" aria-hidden="true" />
              מאות נשים כבר במסע
              <span className="hero-trust-sep">·</span>
              חינמי
              <span className="hero-trust-sep">·</span>
              ללא ספאם
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          2 · PAIN — "מכירה את הימים האלה ש…"
          ============================================ */}
      <section
        ref={pain.ref}
        className={`pain${pain.inView ? ' is-in' : ''}`}
        aria-labelledby="pain-headline"
      >
        <div className="container">
          <div className="eyebrow eyebrow-muted">אולי גם את</div>
          <h2 id="pain-headline" className="section-h2">
            מכירה את ה־ימים האלה ש…
          </h2>
          <div className="pain-grid">
            <article className="pain-card">
              <h3>הגוף שלך כותב לך, ואת עוד מנסה לקרוא את כתב היד</h3>
              <p>
                קמת בבוקר אחרי עוד לילה שהתעוררת בשלוש. הסתכלת במראה ושאלת:{' '}
                <em>רגע, מתי הג&apos;ינס הפך לאויב, ולמה אני עייפה משינה?</em>
              </p>
            </article>
            <article className="pain-card">
              <h3>השינה כבר לא עושה את העבודה</h3>
              <p>
                את נכנסת למיטה בעייפות של 11, ובשלוש את ערה, מזיעה, פותחת את המזגן ומתכננת מחר. וכשהשעון
                מצלצל, את מתעוררת כאילו לא היית בכלל.
              </p>
            </article>
            <article className="pain-card">
              <h3>את ממשיכה לתפקד, ובפנים מישהי מבקשת הפסקה</h3>
              <p>
                עבודה, בית, ילדים, הורים, זוגיות, רשימת מטלות שמתחדשת מעצמה. את מחזיקה הכול, מחייכת,
                ובינתיים שואלת בשקט: <em>איפה אני בתוך כל זה?</em>
              </p>
            </article>
            <article className="pain-card">
              <h3>את לא רוצה לחזור להיות מי שהיית. את רוצה להרגיש שוב חיה</h3>
              <p>
                לא להישרד עוד יום. לא להיות יעילה. להרגיש. לצחוק. לרצות משהו. להבין מה הגוף שלך מבקש,
                ולמה זה לא &quot;סתם הגיל&quot;.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================
          3 · BIG IDEA — reframe, dark editorial breath
          ============================================ */}
      <section className="big-idea" aria-labelledby="big-idea-quote">
        <p id="big-idea-quote" className="big-idea-quote">
          גיל המעבר הוא <strong>לא</strong> סוף.
          <br />
          הוא <strong>שער</strong>.
        </p>
        <p className="big-idea-sub">
          רגע שבו אישה יכולה לעבור מעייפות לפריחה, משתיקה לקול, מבלבול למפה. בלי לאבד את ההומור
          בדרך.
        </p>
      </section>

      {/* ============================================
          4 · THREE WORLDS — gateways
          ============================================ */}
      <section
        ref={worlds.ref}
        className={`worlds${worlds.inView ? ' is-in' : ''}`}
        aria-labelledby="worlds-headline"
      >
        <div className="container">
          <div className="eyebrow eyebrow-muted">שלושה שערים להתחיל מהם</div>
          <h2 id="worlds-headline" className="section-h2">
            מאיפה את רוצה להיכנס?
          </h2>
          <div className="worlds-grid">
            <article className="world-card world-book">
              <div className="world-micro">הספר</div>
              <h3>לא &quot;גברת&quot;, גיבורה!</h3>
              <p>
                המסע האישי, המצחיק והמרגש ששם מילים על מה שעובר עלייך, ודמות אחת שאומרת בקול את מה שלא
                העזת.
              </p>
              <Link href="/menopause-book" className="btn btn-primary btn-sm">
                הצצה לספר
              </Link>
            </article>
            <article className="world-card world-map">
              <div className="world-micro">מפת הדרכים</div>
              <h3>ווייז למנופאוזית המתחילה</h3>
              <p>
                מפה קטנה וברורה להתחיל לעשות סדר בגוף, בשינה, ובראש, בלי לחכות שיתאים לך לוח הזמנים של
                רופאה.
              </p>
              <Link href="/menopause-roadmap" className="btn btn-primary btn-sm">
                קחי את המפה
              </Link>
            </article>
            <article className="world-card world-aliza">
              <div className="world-micro">עליזה שנקין</div>
              <h3>מנופאוזית, וטוב לה (רוב הזמן)</h3>
              <p>
                הקול שאומר את מה שאת חושבת בלב. צינית, חצופה, מצחיקה, תמיד לצד נשים, אף פעם לא נגדן.
              </p>
              <a href="#aliza" className="btn btn-ghost-dark btn-sm">
                תכירי את עליזה
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================
          5 · MEET INBAL
          ============================================ */}
      <section className="meet" aria-labelledby="meet-headline">
        <div className="container meet-grid">
          <div className="meet-photo">
            <Image
              src="/inbal-laptop.jpg"
              alt="ענבל ליד הלפטופ במטבח"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="meet-photo-img"
            />
          </div>
          <div className="meet-text">
            <div className="eyebrow eyebrow-muted">מי אני</div>
            <h2 id="meet-headline" className="section-h2">
              ענבל דפנה.
              <br />
              מנהלת IT ביום, כותבת בלילה, מנופאוזית כל הזמן.
            </h2>
            <p>
              אני בת 52, חיה בקיבוץ בדרום, ולפני כמה שנים הבנתי שאני לא משתגעת, אני פשוט לא קיבלתי אף
              פעם את הוראות ההפעלה.
            </p>
            <p>
              אז עשיתי מה שאשת IT עושה: אספתי דאטה, בדקתי מערכות, וכתבתי את המדריך שהייתי צריכה בעצמי.
            </p>
            <p>
              מזה נולד הספר, מזה נולדה המפה, ומזה נולדה עליזה, שלפעמים אומרת את מה שאני לא מעיזה.
            </p>
            <p className="meet-disclaimer">
              <strong>
                אני לא רופאה. אני לא מחליפה ייעוץ רפואי. אני מביאה את הסיפור, השפה וההומור שהיו חסרים
                לי.
              </strong>
            </p>
            <Link href="/about" className="btn btn-ghost-dark btn-sm">
              עוד עליי ←
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          6 · BOOK
          ============================================ */}
      <section className="book" aria-labelledby="book-headline">
        <div className="container book-grid">
          <div className="book-text">
            <div className="eyebrow eyebrow-gold">הספר</div>
            <h2 id="book-headline" className="book-title">
              לא &quot;גברת&quot;, גיבורה!
            </h2>
            <p className="book-subline">סיפור מסע אל גיל הַמֵעֵבֶר</p>
            <p>
              ספר שאני הייתי צריכה ולא מצאתי. סיפור אישי, תובנות שעבדו בשבילי, כלים מעשיים, ועליזה,
              שמחכה לך בין הפרקים עם הערה צינית בדיוק ברגע שיהיה לך כבד.
            </p>
            <p>זה לא ספר רפואי. זה ספר של מישהי שעברה את זה, ושמה את זה במילים.</p>
            <Link href="/menopause-book" className="btn btn-primary">
              הצצה לספר
            </Link>
          </div>
          <div className="book-cover">
            <Image
              src="/book-mockup-v2.png"
              alt="לא גברת, גיבורה — ספרה של ענבל דפנה"
              fill
              sizes="(max-width: 800px) 70vw, 36vw"
              className="book-cover-img"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          7 · ROADMAP CTA — primary conversion
          ============================================ */}
      <section className="roadmap" aria-labelledby="roadmap-headline">
        <div className="container roadmap-inner">
          <div className="eyebrow eyebrow-muted">מפת הדרכים</div>
          <h2 id="roadmap-headline" className="section-h2">
            ווייז למנופאוזית המתחילה
          </h2>
          <p>
            מפה קצרה, ברורה, חינמית. בלי דרמה, בלי טיפים גנריים, בלי הבטחות לחזור לגיל 30.
          </p>
          <p>פשוט מה כדאי לדעת ראשון, ואיך מתחילים לעשות סדר.</p>
          <Link href="/menopause-roadmap" className="btn btn-primary">
            קחי את המפה
          </Link>
          <p className="roadmap-micro">✨ נשלח למייל. בלי ספאם, בלי תפוצות חיצוניות.</p>
        </div>
      </section>

      {/* ============================================
          8 · ALIZA — humor break
          ============================================ */}
      <section className="aliza" id="aliza" aria-labelledby="aliza-headline">
        <div className="container">
          <div className="aliza-deco aliza-deco-1" aria-hidden="true">
            {heartFilled}
          </div>
          <div className="aliza-deco aliza-deco-2" aria-hidden="true">
            {heartOutline}
          </div>
          <div className="aliza-deco aliza-deco-3" aria-hidden="true">
            {heartFilled}
          </div>
          <div className="eyebrow eyebrow-fuchsia">עליזה אומרת</div>
          <h2 id="aliza-headline" className="section-h2 aliza-h">
            &quot;תקשיבי לי טוב, מאמי&quot;
          </h2>
          <div className="aliza-grid">
            <blockquote className="aliza-quote">
              גל חום זה לא תסמין. זה הגוף עושה הכרזה דרמטית על נוכחות.
            </blockquote>
            <blockquote className="aliza-quote">
              מאמי, את לא עצלנית. את מערכת שעבדה שנים בלי תחזוקה.
            </blockquote>
            <blockquote className="aliza-quote">
              אם עוד מישהו אומר לי &apos;זה הגיל&apos;, אני שולחת אותו לעבור בעצמו מעבר.
            </blockquote>
          </div>
        </div>
      </section>

      {/* ============================================
          9 · ARTICLES TEASER (placeholders — replace with dynamic feed)
          ============================================ */}
      <section className="articles" aria-labelledby="articles-headline">
        <div className="container">
          <div className="eyebrow eyebrow-muted">יומנה של מנופאוזית</div>
          <h2 id="articles-headline" className="section-h2">
            מה כתבתי השבוע
          </h2>
          <p className="articles-intro">
            רגעים יומיומיים, תובנות קטנות, ולפעמים גם בועה של עליזה. כל פעם משהו אחר.
          </p>
          <div className="articles-grid">
            <article className="article-card">
              <div className="article-date">בקרוב</div>
              <h3>הספר נולד בלילה אחד עם מזגן על 16</h3>
              <p>שני משפטים על הרגע שבו הבנתי שאני לא משתגעת, אני פשוט באמצע עדכון גרסה…</p>
              <Link href="/articles">המשך לקרוא ←</Link>
            </article>
            <article className="article-card">
              <div className="article-date">בקרוב</div>
              <h3>למה אני מסרבת לקרוא לזה &quot;גיל הבלות&quot;</h3>
              <p>על המילה שהורידה דורות של נשים לקרקע, ועל מה שקורה כשמחליפים אותה במילה אחרת…</p>
              <Link href="/articles">המשך לקרוא ←</Link>
            </article>
            <article className="article-card">
              <div className="article-date">בקרוב</div>
              <h3>47 הטאבים שהמוח שלי פתח השבוע</h3>
              <p>איך אישה אחת בגיל המעבר מנהלת ערפל מוחי, רשימות מטלות, ושיחת ועידה בו זמנית…</p>
              <Link href="/articles">המשך לקרוא ←</Link>
            </article>
          </div>
          <Link href="/articles" className="btn btn-ghost-dark btn-sm articles-more">
            כל המאמרים ←
          </Link>
        </div>
      </section>

      {/* ============================================
          10 · NEWSLETTER — Inspiration Waves
          ============================================ */}
      <section className="newsletter" id="newsletter" aria-labelledby="newsletter-headline">
        <div className="container newsletter-grid">
          <div className="newsletter-intro">
            <div className="eyebrow eyebrow-muted">גלי השראה</div>
            <h2 id="newsletter-headline" className="section-h2">
              רוצה לקבל גל פעם בשבועיים?
            </h2>
            <p className="newsletter-sub">
              מיילים קצרים, חכמים ומרימים. לפעמים תובנה, לפעמים סיפור, לפעמים תזכורת שאת לא לבד.
            </p>
            <div className="aliza-bubble">
              <span className="aliza-bubble-label">💬 בועה של עליזה</span>
              &quot;אל תדאגי, מאמי. לא שולחת לך כלום לפני הקפה.&quot;
            </div>
          </div>

          <div className="newsletter-form-wrap">
            {isSubmitted ? (
              <div className="newsletter-success" role="status" aria-live="polite">
                <p className="newsletter-success-icon">✨</p>
                <h3>ברוכה הבאה לגלי ההשראה!</h3>
                <p>תודה שהצטרפת. בקרוב תקבלי את הגל הראשון שלך.</p>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleFormSubmit}>
                {error && (
                  <div className="newsletter-error" role="alert">
                    {error}
                  </div>
                )}
                <div className="newsletter-field">
                  <label htmlFor="newsletter-name" className="sr-only">
                    שם
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    name="name"
                    placeholder="שם"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>
                <div className="newsletter-field">
                  <label htmlFor="newsletter-email" className="sr-only">
                    אימייל
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                <label className="newsletter-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    disabled={isSubmitting}
                  />
                  <span>
                    אני מאשרת להצטרף לרשימת התפוצה. אפשר להסיר את עצמך בלחיצה בכל מייל.
                  </span>
                </label>
                <button type="submit" className="btn btn-primary newsletter-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'מצטרפת…' : 'הצטרפי לגלי ההשראה'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============================================
          11 · FOOTER
          ============================================ */}
      <footer className="home-footer">
        <div className="container home-footer-inner">
          <div className="home-footer-brand">
            <h3>הבית של גיל הַמֵעֵבֶר</h3>
            <p>מקום של נשים שעוברות אל גיל הַמֵעֵבֶר, עם שפה, מפה, חמלה והומור.</p>
          </div>

          <nav className="home-footer-links" aria-label="קישורי תחתית">
            <Link href="/about">אודות</Link>
            <Link href="/menopause-book">הספר</Link>
            <Link href="/menopause-roadmap">מפת הדרכים</Link>
            <Link href="/articles">מאמרים</Link>
            <Link href="/inspiration-waves">גלי השראה</Link>
            <Link href="/privacy-policy">מדיניות פרטיות</Link>
          </nav>

          <div className="home-footer-social">
            <a
              href="https://www.facebook.com/profile.php?id=61560682721423&locale=he_IL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="עקבי אחרינו בפייסבוק"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/inbal_daphna/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="עקבי אחרינו באינסטגרם"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <p className="home-footer-copy">© 2026 גיל הַמֵעֵבֶר · כל הזכויות שמורות</p>
          <p className="home-footer-tagline">לא רופאות. לא גורואיות. נשים שמדברות אותך.</p>
        </div>
      </footer>
    </div>
  );
}

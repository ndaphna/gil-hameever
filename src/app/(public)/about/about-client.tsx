'use client';

import Link from 'next/link';
import Image from 'next/image';
import './about.css';

const testimonials = [
  {
    name: 'סיגל, 52',
    text: 'הפוסטים שלך זה כמו לדבר עם חברה שמבינה אותי באמת.',
  },
  {
    name: 'דנה, 48',
    text: 'אני צוחקת, בוכה, ואז פתאום נופל לי אסימון.',
  },
  {
    name: 'מיכל, 50',
    text: 'בפעם הראשונה בחיים אני מרגישה שלא איבדתי את זה. אני פשוט משתנה.',
  },
];

const alizaQuotes = [
  'גל חום זה לא תסמין. זה הגוף עושה הכרזה דרמטית על נוכחות.',
  'מאמי, את לא עצלנית. את מערכת שעבדה שנים בלי תחזוקה.',
  'אם עוד מישהו אומר לי "זה הגיל", אני שולחת אותו לעבור בעצמו מעבר.',
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* ============================================
          1 · HERO — Meet Inbal, editorial portrait
          ============================================ */}
      <section className="about-hero" aria-labelledby="about-hero-headline">
        <div className="about-hero-grid">
          <div className="about-hero-text">
            <div className="about-eyebrow about-eyebrow-gold">לא גברת. גיבורה.</div>
            <h1 id="about-hero-headline" className="about-hero-headline">
              ענבל דפנה.
              <br />
              מנופאוזית, וטוב לה.
            </h1>
            <p className="about-hero-sub">
              האישה שהפסיקה להילחם בגוף שלה, והתחילה לדבר איתו.
            </p>
            <div className="about-hero-ctas">
              <Link href="/menopause-roadmap" className="about-btn about-btn-primary">
                קחי את מפת הדרכים
              </Link>
              <Link href="/book-preview" className="about-btn about-btn-ghost">
                ספרי לי על הספר
              </Link>
            </div>
          </div>
          <div className="about-hero-photo">
            <Image
              src="/inbal-wheat-field.jpg"
              alt="ענבל דפנה בשדה חיטה"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
              className="about-hero-photo-img"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          2 · STORY — how I got here
          ============================================ */}
      <section className="about-story" aria-labelledby="about-story-headline">
        <div className="about-container about-story-grid">
          <div className="about-story-photo">
            <Image
              src="/inbal-laptop.jpg"
              alt="ענבל כותבת מהמטבח"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="about-story-photo-img"
            />
          </div>
          <div className="about-story-text">
            <div className="about-eyebrow about-eyebrow-muted">איך הגעתי לזה</div>
            <h2 id="about-story-headline" className="about-h2">
              במשך שנים הייתי כמו רוב הנשים שאני פוגשת היום.
            </h2>
            <p>חזקה, מתפקדת, מצליחה. אבל בפנים? עייפה. מוצפת.</p>
            <p>
              עם גוף שפתאום מתנהג כמו מיקרוגל תקול, ומוח שעושה ריסטארט כל שלוש דקות.
            </p>
            <p>ניסיתי הכל. דיאטות, תוספים, טיפולים, שיחות.</p>
            <p className="about-story-tag">עד שיום אחד הבנתי משהו אחר.</p>
          </div>
        </div>
      </section>

      {/* ============================================
          3 · THE MOMENT — breathing quote, no image
          ============================================ */}
      <section className="about-moment" aria-labelledby="about-moment-quote">
        <div className="about-container">
          <div className="about-eyebrow about-eyebrow-fuchsia">רגע אחד שינה הכל</div>
          <p id="about-moment-quote" className="about-moment-quote">
            אני לא צריכה עוד פתרון.
            <br />
            אני צריכה מהפכה.
          </p>
          <p className="about-moment-sub">
            וככה נולד גיל המֵעֵבֶר. המקום שבו נשים לא מתנצלות, לא נעלמות, ולא מתפשרות.
            הן מתעוררות.
          </p>
        </div>
      </section>

      {/* ============================================
          4 · WHY NOT "גיל הבלות"
          ============================================ */}
      <section className="about-reframe" aria-labelledby="about-reframe-headline">
        <div className="about-container about-reframe-grid">
          <div className="about-reframe-text">
            <div className="about-eyebrow about-eyebrow-muted">על המילה</div>
            <h2 id="about-reframe-headline" className="about-h2">
              זה לא "גיל הבלות".
              <br />
              זה גיל המֵעֵבֶר.
            </h2>
            <p>
              "גיל הבלות". מילה שהורידה דורות של נשים לקרקע. בלות. שחיקה. דהייה. סוף.
            </p>
            <p>
              "גיל המֵעֵבֶר". מילה אחרת לגמרי. תנועה. את לא קפואה במקום, את עוברת.
            </p>
            <p className="about-reframe-tag">
              מלהיות "גברת" ללהיות גיבורה.
            </p>
          </div>
          <div className="about-reframe-photo">
            <Image
              src="/inbal-contemplative.jpg"
              alt="ענבל, פורטרט מהורהר"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="about-reframe-photo-img"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          5 · ALIZA — the inner voice
          ============================================ */}
      <section className="about-aliza" aria-labelledby="about-aliza-headline">
        <div className="about-container">
          <div className="about-aliza-intro">
            <div className="about-eyebrow about-eyebrow-fuchsia">עליזה שנקין</div>
            <h2 id="about-aliza-headline" className="about-h2">
              היא לא דמות.
              <br />
              היא הקול הפנימי שלי.
            </h2>
            <p>
              עליזה נולדה ביום שהבנתי שהאמיתות הכי גדולות שלי יוצאות אצלי בצחוק.
            </p>
            <p>
              היא צינית, חצופה, מצחיקה, ולפעמים אומרת בדיוק את מה שאני לא מעיזה.
              היא הצד שמסרב להתנצל, ואני שמחה שהיא איתי.
            </p>
          </div>

          <div className="about-aliza-stage">
            <div className="about-aliza-portrait about-aliza-portrait-main">
              <Image
                src="/aliza/aliza-main.png"
                alt="עליזה שנקין, פורטרט"
                fill
                sizes="(max-width: 900px) 60vw, 280px"
                className="about-aliza-portrait-img"
              />
            </div>
            <ul className="about-aliza-quotes">
              {alizaQuotes.map((quote) => (
                <li key={quote} className="about-aliza-quote">
                  {quote}
                </li>
              ))}
            </ul>
            <div className="about-aliza-portrait about-aliza-portrait-side">
              <Image
                src="/aliza/aliza-what.png"
                alt="עליזה, הבעה"
                fill
                sizes="(max-width: 900px) 40vw, 200px"
                className="about-aliza-portrait-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          6 · TESTIMONIALS — נשים שכותבות לי
          ============================================ */}
      <section className="about-letters" aria-labelledby="about-letters-headline">
        <div className="about-container about-letters-grid">
          <div className="about-letters-photo">
            <Image
              src="/inbal-cafe.jpg"
              alt="ענבל, בית קפה"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="about-letters-photo-img"
            />
          </div>
          <div className="about-letters-text">
            <div className="about-eyebrow about-eyebrow-muted">נשים שכותבות לי</div>
            <h2 id="about-letters-headline" className="about-h2">
              כל ציטוט אמיתי.
              <br />
              כל אישה, סיפור.
            </h2>
            <p className="about-letters-note">
              השמות שונו לשמירה על פרטיות. המילים, שלהן.
            </p>
            <ul className="about-letters-list">
              {testimonials.map((t) => (
                <li key={t.name} className="about-letter">
                  <p className="about-letter-text">{t.text}</p>
                  <p className="about-letter-name">{t.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================
          7 · CTA + SIGNATURE
          ============================================ */}
      <section className="about-cta" aria-labelledby="about-cta-headline">
        <div className="about-container about-cta-inner">
          <div className="about-eyebrow about-eyebrow-gold">המעבר שלך מתחיל</div>
          <h2 id="about-cta-headline" className="about-cta-headline">
            גיל המעבר הוא לא הסוף של שום דבר.
            <br />
            הוא ההתחלה של החיים שאת סוף סוף בוחרת בעצמך.
          </h2>
          <Link href="/menopause-roadmap" className="about-btn about-btn-primary about-btn-lg">
            קחי את מפת הדרכים
          </Link>
          <div className="about-signature">
            <p className="about-signature-line">ברוכה הבאה הביתה.</p>
            <p className="about-signature-name">ענבל דפנה</p>
            <p className="about-signature-tagline">מנופאוזית, וטוב לה.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

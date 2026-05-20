'use client';
import { useState } from 'react';
import MoodGuideOptInModal from './mood-guide-opt-in-modal';

export default function MoodGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="lm-page-container" dir="rtl">
      <div className="lm-top-banner">
        <p className="lm-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="lm-hero-section">
        <div className="lm-hero-content">
          <div className="lm-headline-section">
            <p className="lm-hook">בכית על משהו קטן, ואחר כך חשבת: מה קרה לי?</p>
            <h1 className="lm-main-headline">עזרה ראשונה לנפילת מצב רוח</h1>
            <p className="lm-sub-headline">
              5 כלים מיידיים לגיבורה שהגוף שלה מגיב לפני שהמוח מספיק להבין
            </p>
          </div>
          <div className="lm-body-cta-section">
            <ul className="lm-bullets">
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>פרוטוקול 5 הדקות, מה לעשות כשהגל מגיע</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>לוח מצב הרוח, כלי לזיהוי דפוסים ביחס לשלב הורמונלי</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>רשימת מזונות לסרוטונין, מה לאכול כשמגיע גל</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>הגרסה הגיבורה, משפטים מדויקים לדבר עם הסביבה בלי להתנצל</span>
              </li>
            </ul>
            <p className="lm-closing">
              את לא מאבדת את שפיות דעתך. קרה לך שהאסטרוגן ירד, ולקח איתו חלק מהסרוטונין. זה לא חולשה. זה כימיה. ויש מה לעשות.
            </p>
            <div className="lm-cta-area">
              <button className="lm-cta-button" onClick={() => setIsModalOpen(true)}>
                כן, שלחי לי את המדריך
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lm-bg-decoration lm-bg-decoration-1" aria-hidden="true" />
      <div className="lm-bg-decoration lm-bg-decoration-2" aria-hidden="true" />
      <MoodGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

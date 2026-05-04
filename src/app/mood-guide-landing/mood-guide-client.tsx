'use client';
import { useState } from 'react';
import './mood-guide-landing.css';
import MoodGuideOptInModal from './mood-guide-opt-in-modal';

export default function MoodGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mg-page-container" dir="rtl">
      <div className="mg-top-banner">
        <p className="mg-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="mg-hero-section">
        <div className="mg-hero-content">
          <div className="mg-headline-section">
            <p className="mg-hook">בכית על משהו קטן, ואחר כך חשבת: מה קרה לי?</p>
            <h1 className="mg-main-headline">עזרה ראשונה לנפילת מצב רוח</h1>
            <p className="mg-sub-headline">
              5 כלים מיידיים לגיבורה שהגוף שלה מגיב לפני שהמוח מספיק להבין
            </p>
          </div>
          <div className="mg-body-cta-section">
            <ul className="mg-bullets">
              <li className="mg-bullet-item">
                <span className="mg-bullet-check">✓</span>
                <span>פרוטוקול 5 הדקות, מה לעשות כשהגל מגיע</span>
              </li>
              <li className="mg-bullet-item">
                <span className="mg-bullet-check">✓</span>
                <span>לוח מצב הרוח, כלי לזיהוי דפוסים ביחס לשלב הורמונלי</span>
              </li>
              <li className="mg-bullet-item">
                <span className="mg-bullet-check">✓</span>
                <span>רשימת מזונות לסרוטונין, מה לאכול כשמגיע גל</span>
              </li>
              <li className="mg-bullet-item">
                <span className="mg-bullet-check">✓</span>
                <span>הגרסה הגיבורה, משפטים מדויקים לדבר עם הסביבה בלי להתנצל</span>
              </li>
            </ul>
            <p className="mg-closing">
              את לא מאבדת את שפיות דעתך. קרה לך שהאסטרוגן ירד, ולקח איתו חלק מהסרוטונין. זה לא חולשה. זה כימיה. ויש מה לעשות.
            </p>
            <div className="mg-cta-area">
              <button className="mg-cta-button" onClick={() => setIsModalOpen(true)}>
                כן, שלחי לי את המדריך
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mg-bg-decoration mg-bg-decoration-1" aria-hidden="true" />
      <div className="mg-bg-decoration mg-bg-decoration-2" aria-hidden="true" />
      <MoodGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

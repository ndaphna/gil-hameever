'use client';
import { useState } from 'react';
import MorningResetOptInModal from './morning-reset-opt-in-modal';

export default function MorningResetLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="lm-page-container" dir="rtl">
      <div className="lm-top-banner">
        <p className="lm-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="lm-hero-section">
        <div className="lm-hero-content">
          <div className="lm-headline-section">
            <p className="lm-hook">5 הדקות הראשונות של הבוקר קובעות את האיזון ההורמונלי של כל היום.</p>
            <h1 className="lm-main-headline">פרוטוקול הבוקר של הגיבורה</h1>
            <p className="lm-sub-headline">5 דקות. 5 פעולות. יום שלם שונה.</p>
          </div>
          <div className="lm-body-cta-section">
            <ul className="lm-bullets">
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>5 פעולות ספציפיות לפי סדר, כל אחת עם הסבר קצר למה היא עובדת</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>כיצד מים ואור ונשימה משפיעים ישירות על הקורטיזול שלך</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>הטריק של &quot;דבר אחד&quot; שמשנה את כל הפרודוקטיביות</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>גרסת &quot;דקה אחת&quot; לימים שאין זמן</span>
              </li>
            </ul>
            <p className="lm-closing">לא שגרת בוקר של שעה. לא מדיטציה מושלמת. לא יוגה לפני הקפה. 5 דקות, לפני שהטלפון פותח את היום שלך.</p>
            <div className="lm-cta-area">
              <button className="lm-cta-button" onClick={() => setIsModalOpen(true)}>
                שלחי לי את הפרוטוקול
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lm-bg-decoration lm-bg-decoration-1" aria-hidden="true" />
      <div className="lm-bg-decoration lm-bg-decoration-2" aria-hidden="true" />
      <MorningResetOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

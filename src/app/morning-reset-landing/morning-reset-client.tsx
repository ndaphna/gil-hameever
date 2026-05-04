'use client';
import { useState } from 'react';
import './morning-reset-landing.css';
import MorningResetOptInModal from './morning-reset-opt-in-modal';

export default function MorningResetLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="mr-page-container" dir="rtl">
      <div className="mr-top-banner">
        <p className="mr-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="mr-hero-section">
        <div className="mr-hero-content">
          <div className="mr-headline-section">
            <p className="mr-hook">5 הדקות הראשונות של הבוקר קובעות את האיזון ההורמונלי של כל היום.</p>
            <h1 className="mr-main-headline">פרוטוקול הבוקר של הגיבורה</h1>
            <p className="mr-sub-headline">5 דקות. 5 פעולות. יום שלם שונה.</p>
          </div>
          <div className="mr-body-cta-section">
            <ul className="mr-bullets">
              <li className="mr-bullet-item">
                <span className="mr-bullet-check">✓</span>
                <span>5 פעולות ספציפיות לפי סדר, כל אחת עם הסבר קצר למה היא עובדת</span>
              </li>
              <li className="mr-bullet-item">
                <span className="mr-bullet-check">✓</span>
                <span>כיצד מים ואור ונשימה משפיעים ישירות על הקורטיזול שלך</span>
              </li>
              <li className="mr-bullet-item">
                <span className="mr-bullet-check">✓</span>
                <span>הטריק של "דבר אחד" שמשנה את כל הפרודוקטיביות</span>
              </li>
              <li className="mr-bullet-item">
                <span className="mr-bullet-check">✓</span>
                <span>גרסת "דקה אחת" לימים שאין זמן</span>
              </li>
            </ul>
            <p className="mr-closing">לא שגרת בוקר של שעה. לא מדיטציה מושלמת. לא יוגה לפני הקפה. 5 דקות, לפני שהטלפון פותח את היום שלך.</p>
            <div className="mr-cta-area">
              <button className="mr-cta-button" onClick={() => setIsModalOpen(true)}>
                שלחי לי את הפרוטוקול
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mr-bg-decoration mr-bg-decoration-1" aria-hidden="true" />
      <div className="mr-bg-decoration mr-bg-decoration-2" aria-hidden="true" />
      <MorningResetOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

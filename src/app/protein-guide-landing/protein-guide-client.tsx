'use client';

import { useState } from 'react';
import ProteinGuideOptInModal from './protein-guide-opt-in-modal';

export default function ProteinGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="lm-page-container" dir="rtl">
      <div className="lm-top-banner">
        <p className="lm-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>

      <div className="lm-hero-section">
        <div className="lm-hero-content">
          <div className="lm-headline-section">
            <p className="lm-hook">את יודעת כמה חלבון את אוכלת ביום? (רמז: רובנו חיות על שליש מהכמות שהגוף צריך)</p>
            <h1 className="lm-main-headline">רשימת הגיבורה לחלבון</h1>
            <p className="lm-sub-headline">כל מה שצריך לדעת כדי לאכול מספיק חלבון בגיל המעבר</p>
          </div>

          <div className="lm-body-cta-section">
            <ul className="lm-bullets">
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>
                  <strong>הרשימה המלאה: 10 מקורות חלבון</strong> עם כמויות מדויקות + הכנה של פחות מ-10 דקות
                </span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>
                  <strong>פרוטוקול 3 נקודות ביום,</strong> תפריט לדוגמה עם 100 גרם חלבון שלא צריך שייקים מיוחדים
                </span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>
                  <strong>3 הטעויות שאני עצמי עשיתי,</strong> כולל למה &quot;סלט עם טונה&quot; לא מספיק
                </span>
              </li>
            </ul>

            <p className="lm-closing">המדריך הזה הוא מה שהייתי רוצה שמישהו יתן לי לפני שנה. עכשיו הוא שלך, חינם.</p>

            <div className="lm-cta-area">
              <button
                className="lm-cta-button"
                onClick={() => setIsModalOpen(true)}
              >
                שלחי לי את הרשימה!
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lm-bg-decoration lm-bg-decoration-1" aria-hidden="true" />
      <div className="lm-bg-decoration lm-bg-decoration-2" aria-hidden="true" />

      <ProteinGuideOptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

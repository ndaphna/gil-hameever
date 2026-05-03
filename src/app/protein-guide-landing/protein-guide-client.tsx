'use client';

import { useState } from 'react';
import './protein-guide-landing.css';
import ProteinGuideOptInModal from './protein-guide-opt-in-modal';

export default function ProteinGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pg-page-container" dir="rtl">
      {/* Top Banner */}
      <div className="pg-top-banner">
        <p className="pg-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>

      {/* Hero */}
      <div className="pg-hero-section">
        <div className="pg-hero-content">

          <div className="pg-headline-section">
            <p className="pg-hook">את יודעת כמה חלבון את אוכלת ביום? (רמז: רובנו חיות על שליש מהכמות שהגוף צריך)</p>
            <h1 className="pg-main-headline">רשימת הגיבורה לחלבון</h1>
            <p className="pg-sub-headline">כל מה שצריך לדעת כדי לאכול מספיק חלבון בגיל המעבר</p>
          </div>

          <div className="pg-body-cta-section">
            <ul className="pg-bullets">
              <li className="pg-bullet-item">
                <span className="pg-bullet-check">✓</span>
                <span>
                  <strong>הרשימה המלאה: 10 מקורות חלבון</strong> עם כמויות מדויקות + הכנה של פחות מ-10 דקות
                </span>
              </li>
              <li className="pg-bullet-item">
                <span className="pg-bullet-check">✓</span>
                <span>
                  <strong>פרוטוקול 3 נקודות ביום,</strong> תפריט לדוגמה עם 100 גרם חלבון שלא צריך שייקים מיוחדים
                </span>
              </li>
              <li className="pg-bullet-item">
                <span className="pg-bullet-check">✓</span>
                <span>
                  <strong>3 הטעויות שאני עצמי עשיתי,</strong> כולל למה &quot;סלט עם טונה&quot; לא מספיק
                </span>
              </li>
            </ul>

            <p className="pg-closing">המדריך הזה הוא מה שהייתי רוצה שמישהו יתן לי לפני שנה. עכשיו הוא שלך, חינם.</p>

            <div className="pg-cta-area">
              <button
                className="pg-cta-button"
                onClick={() => setIsModalOpen(true)}
              >
                שלחי לי את הרשימה!
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative blobs */}
      <div className="pg-bg-decoration pg-bg-decoration-1" aria-hidden="true" />
      <div className="pg-bg-decoration pg-bg-decoration-2" aria-hidden="true" />

      {/* Modal */}
      <ProteinGuideOptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

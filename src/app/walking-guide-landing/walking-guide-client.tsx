'use client';
import { useState } from 'react';
import './walking-guide-landing.css';
import WalkingGuideOptInModal from './walking-guide-opt-in-modal';

export default function WalkingGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="wg-page-container" dir="rtl">
      <div className="wg-top-banner">
        <p className="wg-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="wg-hero-section">
        <div className="wg-hero-content">
          <div className="wg-headline-section">
            <p className="wg-hook">כמה פעמים אמרת לעצמך "ממחר, אני מתחילה הליכות"?</p>
            <h1 className="wg-main-headline">עזרה ראשונה: איך תתחילי רוטינת הליכות, וגם תתמידי בזה</h1>
            <p className="wg-sub-headline">פרוטוקול 5 צעדים לנשים שיודעות שהליכה חשובה, אבל לא מצליחות להתחיל</p>
          </div>
          <div className="wg-body-cta-section">
            <ul className="wg-bullets">
              <li className="wg-bullet-item">
                <span className="wg-bullet-check">✓</span>
                <span>פרוטוקול "10 דקות, וזה מספיק", למה לא צריך שעה כדי שזה יספור</span>
              </li>
              <li className="wg-bullet-item">
                <span className="wg-bullet-check">✓</span>
                <span>הסוד שגיליתי הליכה בבוקר, ולמה המוח שלך שותק</span>
              </li>
              <li className="wg-bullet-item">
                <span className="wg-bullet-check">✓</span>
                <span>טריק ה"קישוט" שגורם לך לחכות להליכה במקום לדחות</span>
              </li>
              <li className="wg-bullet-item">
                <span className="wg-bullet-check">✓</span>
                <span>שיטת 7 ימים, איך יוצרים רצף שמחזיק</span>
              </li>
            </ul>
            <p className="wg-closing">גם אם ניסית כבר עשר פעמים. גם אם אין לך זמן. גם אם הגוף שלך מרגיש עייף מרגע שאת קמה.</p>
            <div className="wg-cta-area">
              <button className="wg-cta-button" onClick={() => setIsModalOpen(true)}>
                שלחי לי את הפרוטוקול
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="wg-bg-decoration wg-bg-decoration-1" aria-hidden="true" />
      <div className="wg-bg-decoration wg-bg-decoration-2" aria-hidden="true" />
      <WalkingGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

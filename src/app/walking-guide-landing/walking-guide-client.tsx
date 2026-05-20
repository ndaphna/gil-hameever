'use client';
import { useState } from 'react';
import WalkingGuideOptInModal from './walking-guide-opt-in-modal';

export default function WalkingGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="lm-page-container" dir="rtl">
      <div className="lm-top-banner">
        <p className="lm-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="lm-hero-section">
        <div className="lm-hero-content">
          <div className="lm-headline-section">
            <p className="lm-hook">כמה פעמים אמרת לעצמך &quot;ממחר, אני מתחילה הליכות&quot;?</p>
            <h1 className="lm-main-headline">עזרה ראשונה: איך תתחילי רוטינת הליכות, וגם תתמידי בזה</h1>
            <p className="lm-sub-headline">פרוטוקול 5 צעדים לנשים שיודעות שהליכה חשובה, אבל לא מצליחות להתחיל</p>
          </div>
          <div className="lm-body-cta-section">
            <ul className="lm-bullets">
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>פרוטוקול &quot;10 דקות, וזה מספיק&quot;, למה לא צריך שעה כדי להרגיש את ההשפעה</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>הסוד שגיליתי הליכה בבוקר, ולמה המוח שלך שותק</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>טריק ה&quot;קישוט&quot; שגורם לך לחכות להליכה במקום לדחות</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>שיטת 7 ימים, איך יוצרים רצף שמחזיק</span>
              </li>
            </ul>
            <p className="lm-closing">גם אם ניסית כבר עשר פעמים. גם אם אין לך זמן. גם אם הגוף שלך מרגיש עייף מרגע שאת קמה.</p>
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
      <WalkingGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

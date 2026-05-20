'use client';
import { useState } from 'react';
import BrainFogGuideOptInModal from './brain-fog-guide-opt-in-modal';

export default function BrainFogGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="lm-page-container" dir="rtl">
      <div className="lm-top-banner">
        <p className="lm-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="lm-hero-section">
        <div className="lm-hero-content">
          <div className="lm-headline-section">
            <p className="lm-hook">גם את שוכחת מילים באמצע משפט, ופוחדת שמישהו יבחין?</p>
            <h1 className="lm-main-headline">הערפל הזה הוא לא את.</h1>
            <p className="lm-sub-headline">5 כלים שעוזרים לך לחשוב בבהירות שוב</p>
          </div>
          <div className="lm-body-cta-section">
            <ul className="lm-bullets">
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>תביני למה את שוכחת מילים, וזה לא מה שאת חושבת שזה</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>תקבלי פרוטוקול לפני פגישה, שאני עושה בשירותים ולא מספרת לאף אחד</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>תגלי מה אכלת הבוקר שהורס את המוח שלך עד הצהריים</span>
              </li>
            </ul>
            <p className="lm-closing">5 כלים. 10 דקות קריאה. ואת יוצאת ממנה עם תוכנית.</p>
            <div className="lm-cta-area">
              <button className="lm-cta-button" onClick={() => setIsModalOpen(true)}>
                שלחי לי את המדריך!
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lm-bg-decoration lm-bg-decoration-1" aria-hidden="true" />
      <div className="lm-bg-decoration lm-bg-decoration-2" aria-hidden="true" />
      <BrainFogGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

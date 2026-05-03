'use client';
import { useState } from 'react';
import './brain-fog-guide-landing.css';
import BrainFogGuideOptInModal from './brain-fog-guide-opt-in-modal';

export default function BrainFogGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="bfg-page-container" dir="rtl">
      <div className="bfg-top-banner">
        <p className="bfg-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="bfg-hero-section">
        <div className="bfg-hero-content">
          <div className="bfg-headline-section">
            <p className="bfg-hook">גם את שוכחת מילים באמצע משפט, ופוחדת שמישהו יבחין?</p>
            <h1 className="bfg-main-headline">הערפל הזה הוא לא את.</h1>
            <p className="bfg-sub-headline">5 כלים שעוזרים לך לחשוב בבהירות שוב</p>
          </div>
          <div className="bfg-body-cta-section">
            <ul className="bfg-bullets">
              <li className="bfg-bullet-item">
                <span className="bfg-bullet-check">✓</span>
                <span>תביני למה את שוכחת מילים, וזה לא מה שאת חושבת שזה</span>
              </li>
              <li className="bfg-bullet-item">
                <span className="bfg-bullet-check">✓</span>
                <span>תקבלי פרוטוקול לפני פגישה, שאני עושה בשירותים ולא מספרת לאף אחד</span>
              </li>
              <li className="bfg-bullet-item">
                <span className="bfg-bullet-check">✓</span>
                <span>תגלי מה אכלת הבוקר שהורס את המוח שלך עד הצהריים</span>
              </li>
            </ul>
            <p className="bfg-closing">5 כלים. 10 דקות קריאה. ואת יוצאת ממנה עם תוכנית.</p>
            <div className="bfg-cta-area">
              <button className="bfg-cta-button" onClick={() => setIsModalOpen(true)}>
                שלחי לי את המדריך!
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bfg-bg-decoration bfg-bg-decoration-1" aria-hidden="true" />
      <div className="bfg-bg-decoration bfg-bg-decoration-2" aria-hidden="true" />
      <BrainFogGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

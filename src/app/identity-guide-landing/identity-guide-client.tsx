'use client';
import { useState } from 'react';
import IdentityGuideOptInModal from './identity-guide-opt-in-modal';

export default function IdentityGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="lm-page-container" dir="rtl">
      <div className="lm-top-banner">
        <p className="lm-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="lm-hero-section">
        <div className="lm-hero-content">
          <div className="lm-headline-section">
            <p className="lm-hook">יש רגע שמסתכלים בראי ולא מכירים את האישה שמחזירה מבט.</p>
            <h1 className="lm-main-headline">ברגע שהחלטתי: לא גברת. גיבורה.</h1>
            <p className="lm-sub-headline">
              ברגע שהפסקתי לחכות שהחיים יחזרו להרגיש נורמלים, התחיל המסע שלי
            </p>
          </div>
          <div className="lm-body-cta-section">
            <ul className="lm-bullets">
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>היה רגע אחד מול הראי שאחריו שום דבר לא היה אותו דבר</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>3 שלבי המסע: הכחשה, בלבול, בחירה, מה קורה בכל שלב ולמה זה טבעי</span>
              </li>
              <li className="lm-bullet-item">
                <span className="lm-bullet-check">✓</span>
                <span>הגיבורה לא מחכה שהגוף יחזור, התפנית שמשנה הכל</span>
              </li>
            </ul>
            <p className="lm-closing">
              לא קרה לך כלום. לא משהו נשבר בך. לא עברת מועד תפוגה. אבל הכללים שידעת השתנו. והגוף הרגיש זאת לפני שהמוח הספיק לעבד.
            </p>
            <div className="lm-cta-area">
              <button className="lm-cta-button" onClick={() => setIsModalOpen(true)}>
                כן, אני רוצה לקרוא על המסע
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lm-bg-decoration lm-bg-decoration-1" aria-hidden="true" />
      <div className="lm-bg-decoration lm-bg-decoration-2" aria-hidden="true" />
      <IdentityGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

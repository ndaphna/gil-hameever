'use client';
import { useState } from 'react';
import './identity-guide-landing.css';
import IdentityGuideOptInModal from './identity-guide-opt-in-modal';

export default function IdentityGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="ig-page-container" dir="rtl">
      <div className="ig-top-banner">
        <p className="ig-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>
      <div className="ig-hero-section">
        <div className="ig-hero-content">
          <div className="ig-headline-section">
            <p className="ig-hook">יש רגע שמסתכלים בראי ולא מכירים את האישה שמחזירה מבט.</p>
            <h1 className="ig-main-headline">ברגע שהחלטתי: לא גברת. גיבורה.</h1>
            <p className="ig-sub-headline">
              ברגע שהפסקתי לחכות שהחיים יחזרו להרגיש נורמלים, התחיל המסע שלי
            </p>
          </div>
          <div className="ig-body-cta-section">
            <ul className="ig-bullets">
              <li className="ig-bullet-item">
                <span className="ig-bullet-check">✓</span>
                <span>היה רגע אחד מול הראי שאחריו שום דבר לא היה אותו דבר</span>
              </li>
              <li className="ig-bullet-item">
                <span className="ig-bullet-check">✓</span>
                <span>3 שלבי המסע: הכחשה, בלבול, בחירה, מה קורה בכל שלב ולמה זה טבעי</span>
              </li>
              <li className="ig-bullet-item">
                <span className="ig-bullet-check">✓</span>
                <span>הגיבורה לא מחכה שהגוף יחזור, התפנית שמשנה הכל</span>
              </li>
            </ul>
            <p className="ig-closing">
              לא קרה לך כלום. לא משהו נשבר בך. לא עברת מועד תפוגה. אבל הכללים שידעת השתנו. והגוף הרגיש זאת לפני שהמוח הספיק לעבד.
            </p>
            <div className="ig-cta-area">
              <button className="ig-cta-button" onClick={() => setIsModalOpen(true)}>
                כן, אני רוצה לקרוא על המסע
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="ig-bg-decoration ig-bg-decoration-1" aria-hidden="true" />
      <div className="ig-bg-decoration ig-bg-decoration-2" aria-hidden="true" />
      <IdentityGuideOptInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

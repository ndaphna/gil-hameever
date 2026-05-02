'use client';

import { useState } from 'react';
import './hot-flash-zoom-landing.css';
import HotFlashZoomOptInModal from './hot-flash-zoom-opt-in-modal';

export default function HotFlashZoomLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="hfz-page" dir="rtl">
      {/* Top Banner */}
      <div className="hfz-banner">
        <p className="hfz-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>

      {/* Hero */}
      <div className="hfz-hero">
        <div className="hfz-hero-inner">

          {/* Hook */}
          <p className="hfz-hook">גל חום בדיוק כשהמצלמה דולקת?</p>

          {/* Headline */}
          <h1 className="hfz-h1">עזרה ראשונה לגל חום באמצע זום</h1>
          <p className="hfz-subtitle">
            (בלי &quot;סליחה&quot;. בלי לכבות מצלמה ולהיעלם. רק פרוטוקול שעובד תוך 60 שניות.)
          </p>

          {/* Bullets */}
          <ul className="hfz-bullets">
            <li className="hfz-bullet-item">
              <span className="hfz-bullet-check">✓</span>
              <span>
                <strong>שליטה מיידית:</strong> 3 צעדים פיזיים שמורידים את הגל בתוך הפגישה, בלי שאף אחת תבחין
              </span>
            </li>
            <li className="hfz-bullet-item">
              <span className="hfz-bullet-check">✓</span>
              <span>
                <strong>הראש שלך:</strong> איך להפוך את הרגע הכי מביך לרגע שמראה בדיוק מי את — מנהלת שיודעת לנהל גם את עצמה
              </span>
            </li>
            <li className="hfz-bullet-item">
              <span className="hfz-bullet-check">✓</span>
              <span>
                <strong>המפה לעתיד:</strong> איך לזהות מה מפעיל אצלך גלי חום ולהתחיל לשלוט בתזמון שלהם, לא רק לשרוד אותם
              </span>
            </li>
          </ul>

          {/* Closing + CTA */}
          <p className="hfz-closing">הפסיקי לחכות שהגל יחלוף לבד. תתחילי לנהל אותו.</p>
          <div className="hfz-cta-area">
            <button
              id="hfz-cta-main-button"
              className="hfz-cta-button"
              onClick={() => setIsModalOpen(true)}
            >
              שלחי לי את הפרוטוקול!
            </button>
          </div>

        </div>
      </div>

      {/* Decorative blobs */}
      <div className="hfz-blob hfz-blob-1" aria-hidden="true" />
      <div className="hfz-blob hfz-blob-2" aria-hidden="true" />
      <div className="hfz-blob hfz-blob-3" aria-hidden="true" />

      {/* Modal */}
      <HotFlashZoomOptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

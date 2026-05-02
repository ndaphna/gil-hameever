'use client';

import { useState } from 'react';
import './sleep-guide-landing.css';
import SleepGuideOptInModal from './sleep-guide-opt-in-modal';

export default function SleepGuideLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="sg-page-container" dir="rtl">
      {/* Top Banner */}
      <div className="sg-top-banner">
        <p className="sg-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>

      {/* Hero */}
      <div className="sg-hero-section">
        <div className="sg-hero-content">

          {/* Headline */}
          <div className="sg-headline-section">
            <p className="sg-hook">את גם שוכבת ב-3 לפנות בוקר עם עיניים פקוחות ומחר יש לך יום מלא?</p>
            <h1 className="sg-main-headline">
              המדריך שרציתי שיהיה לי לפני שנתיים:
              <span className="sg-headline-sub"> 5 צעדים להחזיר לעצמך את הלילה</span>
            </h1>
            <p className="sg-sub-headline">
              לא ספירת כבשים. לא &quot;הירגעי&quot;. פרוטוקול מדעי פשוט שמלמד את הגוף שלך לישון שוב, גם בזמן גיל המעבר.
            </p>
          </div>

          {/* Body + CTA */}
          <div className="sg-body-cta-section">
            <ul className="sg-bullets">
              <li className="sg-bullet-item">
                <span className="sg-bullet-check">✓</span>
                <span><strong>תגלי מה האסטרוגן עושה לשינה שלך</strong> ולמה זה לא &quot;לחץ&quot; ולא &quot;בראש&quot;</span>
              </li>
              <li className="sg-bullet-item">
                <span className="sg-bullet-check">✓</span>
                <span><strong>תקבלי פרוטוקול שלוש בבוקר</strong>, מה עושים כשמתעוררות ולא חוזרות לישון</span>
              </li>
              <li className="sg-bullet-item">
                <span className="sg-bullet-check">✓</span>
                <span><strong>תדעי מה לאכול ב-21:00</strong>, ואיזו שתייה הורסת לך את הלילה בלי שידעת</span>
              </li>
            </ul>

            <div className="sg-cta-area">
              <button
                className="sg-cta-button"
                onClick={() => setIsModalOpen(true)}
              >
                שלחי לי את המדריך!
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative blobs */}
      <div className="sg-bg-decoration sg-bg-decoration-1" aria-hidden="true" />
      <div className="sg-bg-decoration sg-bg-decoration-2" aria-hidden="true" />

      {/* Modal */}
      <SleepGuideOptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

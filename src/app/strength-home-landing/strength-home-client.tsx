'use client';

import { useState } from 'react';
import './strength-home-landing.css';
import StrengthHomeOptInModal from './strength-home-opt-in-modal';

export default function StrengthHomeLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="sh-page-container" dir="rtl">
      {/* Top Banner */}
      <div className="sh-top-banner">
        <p className="sh-banner-logo">Gil HaMeever | גיל המעבר</p>
      </div>

      {/* Hero */}
      <div className="sh-hero-section">
        <div className="sh-hero-content">

          <div className="sh-headline-section">
            <p className="sh-hook">אם הרגשת שהגוף שלך &apos;הרים ידיים&apos;, זה לא בראש.</p>
            <h1 className="sh-main-headline">האם גיל המעבר שלך קורא לך להרים משקולות?</h1>
            <p className="sh-sub-headline">7 סימנים שכדאי להכיר, ופרוטוקול 20 דקות להתחיל בבית</p>
          </div>

          <div className="sh-body-cta-section">
            <ul className="sh-bullets">
              <li className="sh-bullet-item">
                <span className="sh-bullet-check">✓</span>
                <span>
                  <strong>7 סימנים</strong> שמראים שגיל המעבר שלך דורש אימון כוח, עם רשימה לסימון עצמי
                </span>
              </li>
              <li className="sh-bullet-item">
                <span className="sh-bullet-check">✓</span>
                <span>
                  <strong>המדע בשפה פשוטה:</strong> מה קורה לשריר כשהאסטרוגן יורד
                </span>
              </li>
              <li className="sh-bullet-item">
                <span className="sh-bullet-check">✓</span>
                <span>
                  <strong>פרוטוקול בית:</strong> 20 דקות, 2x שבוע, 3 תרגילים, ללא ציוד
                </span>
              </li>
              <li className="sh-bullet-item">
                <span className="sh-bullet-check">✓</span>
                <span>
                  <strong>איך מתקדמים</strong> בלי להתאמן יותר מדי
                </span>
              </li>
            </ul>

            <p className="sh-closing">המדריך הזה הוא מה שהייתי רוצה שמישהי תספר לי אז.</p>

            <div className="sh-cta-area">
              <button
                className="sh-cta-button"
                onClick={() => setIsModalOpen(true)}
              >
                שלחי לי את המדריך
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative blobs */}
      <div className="sh-bg-decoration sh-bg-decoration-1" aria-hidden="true" />
      <div className="sh-bg-decoration sh-bg-decoration-2" aria-hidden="true" />

      {/* Modal */}
      <StrengthHomeOptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

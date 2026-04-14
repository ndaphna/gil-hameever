'use client';

import { useState } from 'react';
import './heroine-checklist-landing.css';
import HeroineOptInModal from './HeroineOptInModal';

export default function HeroineChecklistLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="hc-page-container" dir="rtl">
      {/* Top Banner */}
      <div className="hc-top-banner">
        <p className="hc-banner-logo">
          Gil HaMeever | גיל המעבר
        </p>
      </div>

      {/* Hero Section */}
      <div className="hc-hero-section">
        <div className="hc-hero-content">

          {/* Headline - First on mobile, right column on desktop */}
          <div className="hc-headline-section">
            <h1 className="hc-main-headline">
              מותשת כבר ב-20:00 בערב? הגיע הזמן להחזיר לעצמך את השליטה (ואת הערב).
            </h1>
            <h2 className="hc-sub-headline">
              הצטרפי לניסוי ה&quot;ריסט&quot;: 5 האקים פשוטים ומפתיעים שיעזרו לך לנצח את עייפות אמצע החיים ולהישאר הגיבורה של הסיפור שלך.
            </h2>
          </div>

          {/* Image - Second on mobile, left column on desktop */}
          <div className="hc-image-container">
            <img
              src="https://i.imghippo.com/files/twk9075TzY.png"
              alt="צ׳קליסט הגיבורות - 5 האקים לנצח את עייפות אמצע החיים"
              className="hc-guide-image"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          {/* Body Text & CTA - Third on mobile, right column on desktop */}
          <div className="hc-body-cta-section">
            <p className="hc-body-text">
              זיקקתי עבורך את התגליות הכי יעילות שמצאתי – האקים קטנים, מגובים במחקרים וקלים ליישום, שיעשו לך סדר ביומיום וימנעו את הצניחה של שעות הערב.
            </p>

            <div className="hc-cta-area">
              <button
                id="heroine-cta-main-button"
                className="hc-cta-button"
                onClick={() => setIsModalOpen(true)}
              >
                שלחי לי את הצ&#8217;קליסט ✨
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="hc-bg-decoration hc-bg-decoration-1" aria-hidden="true"></div>
      <div className="hc-bg-decoration hc-bg-decoration-2" aria-hidden="true"></div>
      <div className="hc-bg-decoration hc-bg-decoration-3" aria-hidden="true"></div>

      {/* Opt-In Modal */}
      <HeroineOptInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

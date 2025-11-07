'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './CookieBanner.css';

type CookiePreferences = {
  necessary: boolean;
  performance: boolean;
  marketing: boolean;
};

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  performance: false,
  marketing: false,
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => {
        setShowBanner(true);
      }, 500);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(cookieConsent);
        setPreferences(saved);
      } catch (e) {
        // Invalid saved data, show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    
    // Here you can add logic to actually set/remove cookies based on preferences
    updateCookies(prefs);
  };

  const updateCookies = (prefs: CookiePreferences) => {
    // Necessary cookies are always on
    // Here you would implement actual cookie setting/removal logic
    // For example:
    if (prefs.performance) {
      // Set performance cookies
    } else {
      // Remove performance cookies
    }
    
    if (prefs.marketing) {
      // Set marketing cookies
    } else {
      // Remove marketing cookies
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      performance: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleNecessaryOnly = () => {
    savePreferences(defaultPreferences);
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <h3 id="cookie-banner-title" className="cookie-banner-title">
            אנחנו משתמשים בעוגיות כדי לשפר את החוויה
          </h3>
          <p className="cookie-banner-description">
            אנא אשר/הסר שימוש בעוגיות ביצועים ושיווקיות שמאפשרות לנו לנתח שימוש ולשלוח הצעות מותאמות. עוגיות הכרחיות ממשיכות לפעול גם ללא הסכמתך.
          </p>
          <Link href="/privacy-policy" className="cookie-banner-link">
            למידע נוסף לחץ כאן
          </Link>
        </div>

        {!showSettings ? (
          <div className="cookie-banner-actions">
            <button
              type="button"
              className="cookie-btn cookie-btn-secondary"
              onClick={handleNecessaryOnly}
              aria-label="רק עוגיות הכרחיות"
            >
              רק עוגיות הכרחיות
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn-primary"
              onClick={() => setShowSettings(true)}
              aria-label="הגדר עוגיות"
            >
              הגדר עוגיות
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn-accept"
              onClick={handleAcceptAll}
              aria-label="קבל את כל העוגיות"
            >
              קבל את כל העוגיות
            </button>
          </div>
        ) : (
          <div className="cookie-settings">
            <h4 className="cookie-settings-title">הגדר העדפות עוגיות</h4>
            
            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <label className="cookie-setting-label">
                  <strong>עוגיות הכרחיות</strong>
                  <span className="cookie-setting-description">
                    עוגיות אלה נחוצות לפעולת האתר ואי אפשר לבטלן.
                  </span>
                </label>
              </div>
              <div className="cookie-toggle disabled">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  aria-label="עוגיות הכרחיות - פעיל תמיד"
                />
                <span className="cookie-toggle-slider"></span>
              </div>
            </div>

            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <label className="cookie-setting-label">
                  <strong>עוגיות ביצועים</strong>
                  <span className="cookie-setting-description">
                    עוגיות אלה עוזרות לנו להבין כיצד משתמשים באתר ולשפר את החוויה.
                  </span>
                </label>
              </div>
              <div className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.performance}
                  onChange={() => togglePreference('performance')}
                  aria-label="עוגיות ביצועים"
                />
                <span className="cookie-toggle-slider"></span>
              </div>
            </div>

            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <label className="cookie-setting-label">
                  <strong>עוגיות שיווקיות</strong>
                  <span className="cookie-setting-description">
                    עוגיות אלה מאפשרות לנו לשלוח לך תוכן ופרסומות מותאמות אישית.
                  </span>
                </label>
              </div>
              <div className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                  aria-label="עוגיות שיווקיות"
                />
                <span className="cookie-toggle-slider"></span>
              </div>
            </div>

            <div className="cookie-settings-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-secondary"
                onClick={() => setShowSettings(false)}
                aria-label="ביטול"
              >
                ביטול
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-accept"
                onClick={handleSaveSettings}
                aria-label="שמור העדפות"
              >
                שמור העדפות
              </button>
            </div>

            <p className="cookie-settings-note">
              ניתן לשנות את העדפות העוגיות בכל עת דרך: <Link href="/privacy-policy">מדיניות פרטיות</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


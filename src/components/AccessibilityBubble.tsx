'use client';

import React, { useState, useEffect } from 'react';
import './AccessibilityBubble.css';
import { useAccessibility } from '../hooks/useAccessibility';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import FocusManager from './FocusManager';
import AccessibilityChecker from './AccessibilityChecker';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  cursorSize: 'normal' | 'large';
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

const AccessibilityBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'checker'>('settings');
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    contrast: 'normal',
    cursorSize: 'normal',
    screenReader: false,
    keyboardNavigation: false,
    reducedMotion: false
  });

  const { applyAccessibilitySettings, announceToScreenReader } = useAccessibility();
  const { trapFocus } = useKeyboardNavigation();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applyAccessibilitySettings(parsedSettings);
    }
  }, [applyAccessibilitySettings]);

  const handleSettingChange = (key: keyof AccessibilitySettings, value: string | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyAccessibilitySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    
    // Announce change to screen reader
    const settingNames: Record<string, string> = {
      fontSize: 'גודל טקסט',
      contrast: 'ניגודיות',
      cursorSize: 'גודל סמן',
      screenReader: 'תמיכה בקוראי מסך',
      keyboardNavigation: 'ניווט במקלדת',
      reducedMotion: 'הפחתת אנימציות'
    };
    
    const valueNames: Record<string, Record<string, string>> = {
      fontSize: { normal: 'רגיל', large: 'גדול', 'extra-large': 'גדול מאוד' },
      contrast: { normal: 'רגיל', high: 'גבוה' },
      cursorSize: { normal: 'רגיל', large: 'גדול' }
    };
    
    const settingName = settingNames[key];
    const valueName = valueNames[key]?.[value] || (value ? 'מופעל' : 'מבוטל');
    announceToScreenReader(`${settingName} שונה ל-${valueName}`);
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 'normal',
      contrast: 'normal',
      cursorSize: 'normal',
      screenReader: false,
      keyboardNavigation: false,
      reducedMotion: false
    };
    setSettings(defaultSettings);
    applyAccessibilitySettings(defaultSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(defaultSettings));
    announceToScreenReader('הגדרות נגישות אופסו למצב ברירת המחדל');
  };

  return (
    <>
      {/* Accessibility Bubble Button */}
      <button
        className="accessibility-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="פתח הגדרות נגישות"
        aria-expanded={isOpen}
        title="הגדרות נגישות"
      >
        <span className="accessibility-icon" aria-hidden="true">
          ♿
        </span>
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <FocusManager isActive={isOpen} restoreFocus={true}>
          <div 
            className="accessibility-panel" 
            role="dialog" 
            aria-labelledby="accessibility-title"
            ref={(el) => el && trapFocus(el)}
          >
            <div className="accessibility-header">
              <h2 id="accessibility-title">הגדרות נגישות</h2>
              <button
                className="accessibility-close"
                onClick={() => setIsOpen(false)}
                aria-label="סגור הגדרות נגישות"
              >
                ×
              </button>
            </div>

            <div className="accessibility-tabs">
              <button
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
                aria-label="הגדרות נגישות"
              >
                ⚙️ הגדרות
              </button>
              <button
                className={`tab-button ${activeTab === 'checker' ? 'active' : ''}`}
                onClick={() => setActiveTab('checker')}
                aria-label="בדיקת נגישות"
              >
                🔍 בדיקה
              </button>
            </div>

            <div className="accessibility-content">
              {activeTab === 'settings' ? (
                <>
                  {/* Font Size */}
                  <div className="accessibility-group">
                    <label htmlFor="font-size">גודל טקסט:</label>
                    <select
                      id="font-size"
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      aria-describedby="font-size-help"
                    >
                      <option value="normal">רגיל</option>
                      <option value="large">גדול</option>
                      <option value="extra-large">גדול מאוד</option>
                    </select>
                    <small id="font-size-help">בחר גודל טקסט נוח לקריאה</small>
                  </div>

                  {/* Contrast */}
                  <div className="accessibility-group">
                    <label htmlFor="contrast">ניגודיות:</label>
                    <select
                      id="contrast"
                      value={settings.contrast}
                      onChange={(e) => handleSettingChange('contrast', e.target.value)}
                      aria-describedby="contrast-help"
                    >
                      <option value="normal">רגיל</option>
                      <option value="high">גבוה</option>
                    </select>
                    <small id="contrast-help">הגדל ניגודיות לצפייה טובה יותר</small>
                  </div>

                  {/* Cursor Size */}
                  <div className="accessibility-group">
                    <label htmlFor="cursor-size">גודל סמן:</label>
                    <select
                      id="cursor-size"
                      value={settings.cursorSize}
                      onChange={(e) => handleSettingChange('cursorSize', e.target.value)}
                      aria-describedby="cursor-help"
                    >
                      <option value="normal">רגיל</option>
                      <option value="large">גדול</option>
                    </select>
                    <small id="cursor-help">הגדל את הסמן לניווט קל יותר</small>
                  </div>

                  {/* Screen Reader */}
                  <div className="accessibility-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.screenReader}
                        onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                        aria-describedby="screen-reader-help"
                      />
                      <span className="checkmark"></span>
                      תמיכה בקוראי מסך
                    </label>
                    <small id="screen-reader-help">משפר את התמיכה בקוראי מסך</small>
                  </div>

                  {/* Keyboard Navigation */}
                  <div className="accessibility-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.keyboardNavigation}
                        onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                        aria-describedby="keyboard-help"
                      />
                      <span className="checkmark"></span>
                      ניווט במקלדת
                    </label>
                    <small id="keyboard-help">משפר את הניווט במקלדת</small>
                  </div>

                  {/* Reduced Motion */}
                  <div className="accessibility-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                        aria-describedby="motion-help"
                      />
                      <span className="checkmark"></span>
                      הפחתת אנימציות
                    </label>
                    <small id="motion-help">מפחית אנימציות לנוחות טובה יותר</small>
                  </div>

                  {/* Reset Button */}
                  <div className="accessibility-actions">
                    <button
                      className="accessibility-reset"
                      onClick={resetSettings}
                      aria-describedby="reset-help"
                    >
                      איפוס הגדרות
                    </button>
                    <small id="reset-help">מחזיר את כל ההגדרות למצב ברירת המחדל</small>
                  </div>
                </>
              ) : (
                <AccessibilityChecker />
              )}
            </div>
          </div>
        </FocusManager>
      )}

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={(e) => e.target.style.display = 'block'}
        onBlur={(e) => e.target.style.display = 'none'}
      >
        דלג לתוכן הראשי
      </a>
    </>
  );
};

export default AccessibilityBubble;
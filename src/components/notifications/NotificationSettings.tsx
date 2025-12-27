'use client';

import { useState, useEffect } from 'react';
import { NotificationPreferences } from '@/types/notifications';
import { NotificationService } from '@/lib/notification-service';
import './NotificationSettings.css';

interface NotificationSettingsProps {
  userId: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [notificationService] = useState(new NotificationService(userId));

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      const prefs = await notificationService.getNotificationPreferences();
      if (prefs) {
        setPreferences(prefs);
      } else {
        // יצירת העדפות ברירת מחדל (לא נשמרות במסד נתונים עדשתמשת תשמור)
        const defaultPreferences: NotificationPreferences = {
          userId,
          email: {
            enabled: true,
            frequency: 'weekly',
            time: '09:00',
            newsletter_interval_days: 4
          },
          whatsapp: {
            enabled: false,
            frequency: 'daily',
            time: '20:00'
          },
          push: {
            enabled: true,
            frequency: 'daily',
            time: '09:00'
          },
          categories: {
            reminders: true,
            insights: true,
            encouragements: true,
            warnings: true
          },
          updatedAt: new Date().toISOString()
        };
        setPreferences(defaultPreferences);
      }
    } catch (error: any) {
      console.error('Error loading preferences:', error);
      // אם הטבלה לא קיימת, נציג הודעה ידידותית
      if (error?.code === 'PGRST205' || error?.message?.includes('table') || error?.message?.includes('schema cache')) {
        console.warn('⚠️ Notification tables not found. Please run CREATE_NOTIFICATION_TABLES.sql in Supabase SQL Editor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!preferences) return;
    
    setSaving(true);
    try {
      await notificationService.updateNotificationPreferences(preferences);
      alert('ההעדפות נשמרו בהצלחה!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('שגיאה בשמירת ההעדפות');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (path: string, value: unknown) => {
    if (!preferences) return;
    
    const newPreferences = { ...preferences };
    const keys = path.split('.');
    let current: Record<string, unknown> = newPreferences as Record<string, unknown>;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const next = current[keys[i]];
      if (next && typeof next === 'object') {
        current = next as Record<string, unknown>;
      } else {
        current[keys[i]] = {};
        current = current[keys[i]] as Record<string, unknown>;
      }
    }
    
    current[keys[keys.length - 1]] = value;
    setPreferences(newPreferences);
  };

  if (loading) {
    return (
      <div className="notification-settings-loading">
        <div className="loading-spinner"></div>
        <p>טוען הגדרות...</p>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="notification-settings-error">
        <p>שגיאה בטעינת ההגדרות</p>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h2>🔔 הגדרות התראות</h2>
        <p>בחרי איך ואיך תרצי לקבל התראות מעליזה</p>
      </div>

      <div className="settings-sections">
        {/* Email Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3>📧 אימייל</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={preferences.email.enabled}
                onChange={(e) => updatePreference('email.enabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {preferences.email.enabled && (
            <div className="section-content">
              <div className="setting-row">
                <label>תדירות:</label>
                <select
                  value={preferences.email.frequency}
                  onChange={(e) => updatePreference('email.frequency', e.target.value)}
                >
                  <option value="daily">יומי</option>
                  <option value="weekly">שבועי</option>
                  <option value="monthly">חודשי</option>
                </select>
              </div>
              
              <div className="setting-row">
                <label>שעה:</label>
                <input
                  type="time"
                  value={preferences.email.time}
                  onChange={(e) => updatePreference('email.time', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h3>💬 ווטסאפ</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={preferences.whatsapp.enabled}
                onChange={(e) => updatePreference('whatsapp.enabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {preferences.whatsapp.enabled && (
            <div className="section-content">
              <div className="setting-row">
                <label>מספר טלפון:</label>
                <input
                  type="tel"
                  placeholder="050-123-4567"
                  value={preferences.whatsapp.phoneNumber || ''}
                  onChange={(e) => updatePreference('whatsapp.phoneNumber', e.target.value)}
                />
              </div>
              
              <div className="setting-row">
                <label>תדירות:</label>
                <select
                  value={preferences.whatsapp.frequency}
                  onChange={(e) => updatePreference('whatsapp.frequency', e.target.value)}
                >
                  <option value="daily">יומי</option>
                  <option value="weekly">שבועי</option>
                  <option value="monthly">חודשי</option>
                </select>
              </div>
              
              <div className="setting-row">
                <label>שעה:</label>
                <input
                  type="time"
                  value={preferences.whatsapp.time}
                  onChange={(e) => updatePreference('whatsapp.time', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Push Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <h3>📱 התראות אפליקציה</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={preferences.push.enabled}
                onChange={(e) => updatePreference('push.enabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          {preferences.push.enabled && (
            <div className="section-content">
              <div className="setting-row">
                <label>תדירות:</label>
                <select
                  value={preferences.push.frequency}
                  onChange={(e) => updatePreference('push.frequency', e.target.value)}
                >
                  <option value="daily">יומי</option>
                  <option value="weekly">שבועי</option>
                  <option value="monthly">חודשי</option>
                </select>
              </div>
              
              <div className="setting-row">
                <label>שעה:</label>
                <input
                  type="time"
                  value={preferences.push.time}
                  onChange={(e) => updatePreference('push.time', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="settings-section">
          <div className="section-header">
            <h3>📂 סוגי התראות</h3>
          </div>
          
          <div className="section-content">
            <div className="category-settings">
              <label className="category-item">
                <input
                  type="checkbox"
                  checked={preferences.categories.reminders}
                  onChange={(e) => updatePreference('categories.reminders', e.target.checked)}
                />
                <span className="category-label">
                  <span className="category-icon">⏰</span>
                  תזכורות
                </span>
              </label>
              
              <label className="category-item">
                <input
                  type="checkbox"
                  checked={preferences.categories.insights}
                  onChange={(e) => updatePreference('categories.insights', e.target.checked)}
                />
                <span className="category-label">
                  <span className="category-icon">💡</span>
                  תובנות
                </span>
              </label>
              
              <label className="category-item">
                <input
                  type="checkbox"
                  checked={preferences.categories.encouragements}
                  onChange={(e) => updatePreference('categories.encouragements', e.target.checked)}
                />
                <span className="category-label">
                  <span className="category-icon">🌟</span>
                  עידוד
                </span>
              </label>
              
              <label className="category-item">
                <input
                  type="checkbox"
                  checked={preferences.categories.warnings}
                  onChange={(e) => updatePreference('categories.warnings', e.target.checked)}
                />
                <span className="category-label">
                  <span className="category-icon">⚠️</span>
                  אזהרות
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="save-button"
          onClick={savePreferences}
          disabled={saving}
        >
          {saving ? 'שומר...' : 'שמור הגדרות'}
        </button>
        
        <button
          className="test-button"
          onClick={async () => {
            setSendingTest(true);
            try {
              // שליחת התראה בדיקה - שולח מייל
              await notificationService.sendImmediateNotification(
                'encouragement',
                'בדיקת התראות',
                'זוהי הודעת בדיקה מעליזה! הכל עובד כמו שצריך 🌸',
                'email' // שולח מייל במקום push notification
              );
              alert('✅ התראת הבדיקה נשלחה בהצלחה!\n\nהמייל נשלח לכתובת המייל שלך. בדקי את תיבת הדואר הנכנס.');
            } catch (error) {
              console.error('Error sending test notification:', error);
              alert('❌ שגיאה בשליחת התראת הבדיקה. בדוק את הקונסול לפרטים.');
            } finally {
              setSendingTest(false);
            }
          }}
          disabled={sendingTest}
        >
          {sendingTest ? 'שולח...' : 'שלח התראה בדיקה'}
        </button>
      </div>
    </div>
  );
}

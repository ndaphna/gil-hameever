'use client';

import { useEffect, useState } from 'react';
import './TokenTransparencyNotification.css';

export interface TokenTransparencyNotificationProps {
  message: string;
  warningMessage?: string;
  tokensDeducted?: number;
  tokensRemaining?: number;
  autoHide?: boolean;
  duration?: number;
}

/**
 * TokenTransparencyNotification Component
 * 
 * Displays a notification whenever tokens are deducted from the user's balance.
 * This ensures complete transparency about AI usage.
 * 
 * Features:
 * - Shows tokens deducted and remaining
 * - Displays warning messages if balance is low
 * - Auto-hides after specified duration
 * - Supports Hebrew RTL layout
 */
export function TokenTransparencyNotification({
  message,
  warningMessage,
  tokensDeducted,
  tokensRemaining,
  autoHide = true,
  duration = 5000,
}: TokenTransparencyNotificationProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoHide && duration > 0) {
      // Start exit animation 500ms before hiding
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, duration - 500);

      // Hide completely
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [autoHide, duration]);

  if (!visible) {
    return null;
  }

  const hasWarning = !!warningMessage;
  const severity = tokensRemaining !== undefined && tokensRemaining < 100 ? 'critical' : 
                   tokensRemaining !== undefined && tokensRemaining < 1000 ? 'warning' : 
                   'info';

  return (
    <div 
      className={`token-transparency-notification ${severity} ${isExiting ? 'exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="notification-icon">
        {severity === 'critical' ? '⚠️' : 
         severity === 'warning' ? '⚡' : 
         '💡'}
      </div>
      
      <div className="notification-content">
        <div className="notification-message">
          {message}
        </div>
        
        {tokensDeducted !== undefined && (
          <div className="notification-details">
            <span className="tokens-deducted">
              נוצלו: {tokensDeducted.toLocaleString()}
            </span>
            {tokensRemaining !== undefined && (
              <>
                <span className="separator">•</span>
                <span className="tokens-remaining">
                  יתרה: {tokensRemaining.toLocaleString()}
                </span>
              </>
            )}
          </div>
        )}
        
        {hasWarning && (
          <div className="notification-warning">
            {warningMessage}
          </div>
        )}
      </div>
      
      <button
        className="notification-close"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => setVisible(false), 300);
        }}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * TokenTransparencyToast - Simplified version for quick notifications
 */
export function TokenTransparencyToast({
  message,
  duration = 3000,
}: {
  message: string;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="token-transparency-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}












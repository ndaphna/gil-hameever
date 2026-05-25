'use client';

import { useEffect, useState } from 'react';
import './TokenTransparencyNotification.css';

export interface TokenTransparencyNotificationProps {
  message: string;
  warningMessage?: string;
  /** Credits charged for the action that triggered this notification. */
  creditsDeducted?: number;
  /** Post-deduction balance of the wallet that was charged. */
  creditsRemaining?: number;
  /** Which wallet was charged ('chat' | 'analysis'). Drives the label text. */
  wallet?: 'chat' | 'analysis';
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
  creditsDeducted,
  creditsRemaining,
  wallet = 'chat',
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
  // Credit-scale thresholds: chat uses CRITICAL=5/LOW=20, analysis uses 1/3.
  // Mirror token-engine.CHAT_WARNING_THRESHOLDS / ANALYSIS_WARNING_THRESHOLDS.
  const critical = wallet === 'chat' ? 5 : 1;
  const low = wallet === 'chat' ? 20 : 3;
  const severity = creditsRemaining !== undefined && creditsRemaining <= critical ? 'critical' :
                   creditsRemaining !== undefined && creditsRemaining <= low ? 'warning' :
                   'info';
  const walletLabel = wallet === 'chat' ? 'שיחות' : 'ניתוחים';

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
        
        {creditsDeducted !== undefined && (
          <div className="notification-details">
            <span className="tokens-deducted">
              ניצול: {creditsDeducted.toLocaleString()} {walletLabel}
            </span>
            {creditsRemaining !== undefined && (
              <>
                <span className="separator">•</span>
                <span className="tokens-remaining">
                  יתרה: {creditsRemaining.toLocaleString()}
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











































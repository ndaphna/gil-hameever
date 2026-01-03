'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTokenWarningMessage, TOKEN_WARNING_THRESHOLDS } from '@/config/token-engine';
import './LowBalanceWarning.css';

export interface LowBalanceWarningProps {
  balance: number;
  onRefillClick?: () => void;
  dismissible?: boolean;
}

/**
 * LowBalanceWarning Component
 * 
 * Displays a warning banner when the user's token balance is low.
 * Encourages users to refill before running out completely.
 * 
 * Features:
 * - Severity levels (critical/warning/reminder)
 * - Gentle, non-intrusive messaging in Aliza's tone
 * - Call-to-action button for refilling
 * - Dismissible (saves to localStorage)
 */
export function LowBalanceWarning({
  balance,
  onRefillClick,
  dismissible = true,
}: LowBalanceWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this level of warning
    const dismissedKey = `token-warning-dismissed-${balance}`;
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';
    setDismissed(isDismissed);
  }, [balance]);

  const handleDismiss = () => {
    const dismissedKey = `token-warning-dismissed-${balance}`;
    localStorage.setItem(dismissedKey, 'true');
    setDismissed(true);
  };

  const warningMessage = getTokenWarningMessage(balance, 'hebrew');

  // Don't show if no warning needed or if dismissed
  if (!warningMessage || dismissed) {
    return null;
  }

  // Determine severity
  const severity = balance <= TOKEN_WARNING_THRESHOLDS.CRITICAL ? 'critical' :
                   balance <= TOKEN_WARNING_THRESHOLDS.LOW ? 'warning' :
                   'reminder';

  const icon = severity === 'critical' ? '⚠️' :
               severity === 'warning' ? '⚡' :
               '💡';

  return (
    <div className={`low-balance-warning ${severity}`} role="alert">
      <div className="warning-icon">{icon}</div>
      
      <div className="warning-content">
        <div className="warning-message">
          {warningMessage}
        </div>
        
        {severity === 'critical' && (
          <div className="warning-subtitle">
            היי, אני עליזה. שימי לב שהטוקנים שלך כמעט אזלו. מלאי מחדש כדי שאוכל להמשיך לעזור לך! 💕
          </div>
        )}
        
        {severity === 'warning' && (
          <div className="warning-subtitle">
            היי יקרה, אני רואה שהיתרה נמוכה. כדאי למלא מחדש בקרוב כדי שלא תפספסי את התובנות היומיות שלך. 🌸
          </div>
        )}
      </div>
      
      <div className="warning-actions">
        <Link 
          href="/dashboard?refill=true" 
          className="refill-button"
          onClick={onRefillClick}
        >
          מלאי מחדש
        </Link>
        
        {dismissible && severity !== 'critical' && (
          <button 
            className="dismiss-button"
            onClick={handleDismiss}
            aria-label="Dismiss warning"
          >
            הבנתי
          </button>
        )}
      </div>
      
      {dismissible && severity !== 'critical' && (
        <button
          className="close-button"
          onClick={handleDismiss}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * InlineTokenWarning - Smaller inline variant
 */
export function InlineTokenWarning({ balance }: { balance: number }) {
  if (balance > TOKEN_WARNING_THRESHOLDS.REMINDER) {
    return null;
  }

  const severity = balance <= TOKEN_WARNING_THRESHOLDS.CRITICAL ? 'critical' :
                   balance <= TOKEN_WARNING_THRESHOLDS.LOW ? 'warning' :
                   'reminder';

  const message = severity === 'critical' ? 
    'טוקנים אזלו - מלאי מחדש עכשיו' :
    severity === 'warning' ?
    'יתרה נמוכה - מומלץ למלא מחדש' :
    'התקרבת לסיום היתרה';

  return (
    <div className={`inline-token-warning ${severity}`}>
      <span className="warning-icon-small">
        {severity === 'critical' ? '⚠️' : severity === 'warning' ? '⚡' : '💡'}
      </span>
      <span className="warning-text">{message}</span>
      <Link href="/dashboard?refill=true" className="warning-link">
        מלאי
      </Link>
    </div>
  );
}




































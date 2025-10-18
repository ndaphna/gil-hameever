'use client';

import React, { useState, useEffect } from 'react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  fix?: string;
}

const AccessibilityChecker: React.FC = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkAccessibility = () => {
    setIsChecking(true);
    const newIssues: AccessibilityIssue[] = [];

    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        newIssues.push({
          type: 'error',
          message: 'תמונה ללא טקסט חלופי',
          element: img as HTMLElement,
          fix: 'הוסף alt attribute לתמונה'
        });
      }
    });

    // Check for missing labels on form elements
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!id && !ariaLabel && !ariaLabelledBy) {
        newIssues.push({
          type: 'error',
          message: 'שדה טופס ללא תווית',
          element: input as HTMLElement,
          fix: 'הוסף label או aria-label לשדה'
        });
      }
    });

    // Check for missing headings structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        newIssues.push({
          type: 'warning',
          message: `דילוג ברמת כותרת מ-${previousLevel} ל-${level}`,
          element: heading as HTMLElement,
          fix: 'תקן את מבנה הכותרות'
        });
      }
      previousLevel = level;
    });

    // Check for sufficient color contrast
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified check - in a real implementation,
      // you'd want to use a proper contrast ratio calculation
      if (color === backgroundColor) {
        newIssues.push({
          type: 'warning',
          message: 'ניגודיות צבעים לא מספקת',
          element: element as HTMLElement,
          fix: 'שנה את הצבעים לניגודיות טובה יותר'
        });
      }
    });

    // Check for keyboard navigation
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && !element.getAttribute('aria-hidden')) {
        newIssues.push({
          type: 'info',
          message: 'אלמנט אינטראקטיבי לא נגיש במקלדת',
          element: element as HTMLElement,
          fix: 'הסר tabindex="-1" או הוסף aria-hidden="true"'
        });
      }
    });

    setIssues(newIssues);
    setIsChecking(false);
  };

  useEffect(() => {
    // Run initial check
    checkAccessibility();
  }, []);

  const fixIssue = (issue: AccessibilityIssue) => {
    if (issue.element && issue.fix) {
      // This is a simplified fix - in a real implementation,
      // you'd want more sophisticated fixing logic
      console.log(`Fixing: ${issue.message}`, issue.element);
    }
  };

  return (
    <div className="accessibility-checker">
      <div className="checker-header">
        <h3>בדיקת נגישות</h3>
        <button 
          onClick={checkAccessibility}
          disabled={isChecking}
          className="check-button"
        >
          {isChecking ? 'בודק...' : 'בדוק שוב'}
        </button>
      </div>

      <div className="issues-list">
        {issues.length === 0 ? (
          <p className="no-issues">✅ לא נמצאו בעיות נגישות!</p>
        ) : (
          issues.map((issue, index) => (
            <div key={index} className={`issue issue-${issue.type}`}>
              <div className="issue-content">
                <span className="issue-type">
                  {issue.type === 'error' ? '❌' : 
                   issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span className="issue-message">{issue.message}</span>
                {issue.fix && (
                  <span className="issue-fix">פתרון: {issue.fix}</span>
                )}
              </div>
              {issue.element && (
                <button 
                  onClick={() => issue.element?.scrollIntoView({ behavior: 'smooth' })}
                  className="highlight-button"
                >
                  הצג אלמנט
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="checker-summary">
        <p>
          נמצאו {issues.filter(i => i.type === 'error').length} שגיאות,{' '}
          {issues.filter(i => i.type === 'warning').length} אזהרות,{' '}
          {issues.filter(i => i.type === 'info').length} הערות
        </p>
      </div>
    </div>
  );
};

export default AccessibilityChecker;

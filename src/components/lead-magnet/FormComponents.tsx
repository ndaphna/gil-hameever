/**
 * ========================================
 * LEAD FORM COMPONENTS
 * ========================================
 * 
 * Reusable form components for lead magnet pages
 */

'use client';

import { ChangeEvent } from 'react';

// ========================================
// ERROR MESSAGE COMPONENT
// ========================================

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="error-message">
      {message}
    </div>
  );
}

// ========================================
// FORM INPUT COMPONENT
// ========================================

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete,
}: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
      />
    </div>
  );
}

// ========================================
// SUBMIT BUTTON COMPONENT
// ========================================

interface SubmitButtonProps {
  isSubmitting: boolean;
  submitText?: string;
  loadingText?: string;
}

export function SubmitButton({
  isSubmitting,
  submitText = 'שלחי לי את המדריך החינמי 🎁',
  loadingText = 'שולחת...',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="cta-button"
      disabled={isSubmitting}
    >
      {isSubmitting ? loadingText : submitText}
    </button>
  );
}

// ========================================
// SUCCESS MESSAGE COMPONENT
// ========================================

interface SuccessMessageProps {
  message?: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="waitlist-landing">
      <section
        className="container"
        style={{
          paddingTop: 'clamp(80px, 14vw, 120px)',
          paddingBottom: 'clamp(60px, 10vw, 80px)',
          textAlign: 'center',
        }}
      >
        <div className="thank-you-card">
          <p>
            <span className="emoji">🌸</span>
            תודה שבחרת להצטרף
          </p>
          <p className="message" style={{ marginBottom: '20px' }}>
            {message || (
              <>
                המייל עם <span className="highlight">המתנה</span> כבר בדרך אלייך!
              </>
            )}
          </p>
          <p
            className="message"
            style={{
              marginTop: 'clamp(32px, 6vw, 48px)',
              paddingTop: 'clamp(28px, 5vw, 40px)',
              borderTop: '2px solid rgba(255, 0, 128, 0.15)',
              fontWeight: '600',
            }}
          >
            מעבירה אותך לדף תודה...
          </p>
        </div>
      </section>
    </div>
  );
}


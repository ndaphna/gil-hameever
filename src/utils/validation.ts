/**
 * Utility functions for form validation and data validation
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('הסיסמה חייבת להכיל לפחות 8 תווים');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות גדולה אחת');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות אות קטנה אחת');
  }
  
  if (!/\d/.test(password)) {
    errors.push('הסיסמה חייבת להכיל לפחות ספרה אחת');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateJournalEntry(notes: string): { isValid: boolean; error?: string } {
  if (!notes.trim()) {
    return {
      isValid: false,
      error: 'אנא כתבי משהו ביומן'
    };
  }
  
  if (notes.trim().length < 3) {
    return {
      isValid: false,
      error: 'הטקסט חייב להכיל לפחות 3 תווים'
    };
  }
  
  if (notes.length > 1000) {
    return {
      isValid: false,
      error: 'הטקסט ארוך מדי (מקסימום 1000 תווים)'
    };
  }
  
  return { isValid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}



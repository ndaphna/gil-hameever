/**
 * ========================================
 * LEAD MAGNET TYPES
 * ========================================
 * 
 * Shared TypeScript types for the lead magnet flow
 */

// ========================================
// FORM TYPES
// ========================================

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface LeadFormState {
  data: LeadFormData;
  isSubmitting: boolean;
  error: string;
  success: boolean;
}

export interface LeadFormProps {
  listId: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// ========================================
// API TYPES
// ========================================

export interface LeadGiftAPIRequest {
  firstName: string;
  lastName: string;
  email: string;
  listId: number;
}

export interface LeadGiftAPIResponse {
  success: boolean;
  message?: string;
}

// ========================================
// BREVO TYPES
// ========================================

export interface BrevoContact {
  email: string;
  attributes: {
    FIRSTNAME: string;
    LASTNAME: string;
  };
  listIds: number[];
  updateEnabled: boolean;
}

export interface BrevoEmail {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  subject: string;
  htmlContent: string;
}

export interface BrevoAPIError {
  code?: string;
  message?: string;
}

// ========================================
// EMAIL TEMPLATE TYPES
// ========================================

export interface EmailTemplateData {
  firstName: string;
  lastName: string;
  giftUrl: string;
  instagramUrl: string;
}

// ========================================
// VALIDATION TYPES
// ========================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}


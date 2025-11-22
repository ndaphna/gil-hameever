/**
 * ========================================
 * USE LEAD FORM HOOK
 * ========================================
 * 
 * Reusable hook for lead magnet form logic
 */

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  LeadFormData, 
  LeadFormState, 
  LeadFormProps 
} from '@/types/lead-magnet';

export function useLeadForm({ listId, onSuccess, onError }: LeadFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead-gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          listId,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('שגיאת תקשורת עם השרת. נסי שוב מאוחר יותר.');
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'שגיאה בשליחת הטופס');
      }

      setSuccess(true);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default: redirect to thank you page
        setTimeout(() => {
          router.push('/thank-you');
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.';

      setError(errorMessage);
      setIsSubmitting(false);

      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
    });
    setError('');
    setSuccess(false);
    setIsSubmitting(false);
  };

  return {
    formData,
    isSubmitting,
    error,
    success,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}


/**
 * Utility functions for API calls and error handling
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export async function handleApiCall<T>(
  apiCall: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await apiCall();
    return {
      data,
      success: true
    };
  } catch (error: unknown) {
    console.error('API Error:', error);
    
    const errorMessage = (error as Error)?.message || 
                        (error as { error_description?: string })?.error_description || 
                        'שגיאה לא ידועה';
    
    return {
      error: errorMessage,
      success: false
    };
  }
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if ((error as Error)?.message) {
    return (error as Error).message;
  }
  
  if ((error as { error_description?: string })?.error_description) {
    return (error as { error_description: string }).error_description;
  }
  
  return 'שגיאה לא ידועה';
}

export function showErrorAlert(error: unknown, context: string = ''): void {
  const message = getErrorMessage(error);
  const fullMessage = context ? `${context}: ${message}` : message;
  alert(fullMessage);
}

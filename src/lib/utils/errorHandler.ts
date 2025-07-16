import { toast } from 'react-toastify';

export interface ErrorResult {
  success: false;
  error: string;
  code?: string;
  isNetworkError?: boolean;
}

export const handleApiError = (
  error: ErrorResult,
  customMessages?: {
    networkError?: string;
    defaultError?: string;
  }
) => {
  const messages = {
    networkError: customMessages?.networkError || 'Network error - Unable to connect to server',
    defaultError: customMessages?.defaultError || 'An error occurred',
    ...customMessages,
  };

  if (error.isNetworkError) {
    toast.error(messages.networkError);
    console.error('Network Error:', error);
  } else {
    toast.error(error.error || messages.defaultError);
    console.error('API Error:', error);
  }
};

// Helper function for i18n error messages
export const handleApiErrorWithTranslation = (
  error: ErrorResult,
  t: (key: string) => string,
  errorKeys?: {
    networkError?: string;
    defaultError?: string;
  }
) => {
  const keys = {
    networkError: errorKeys?.networkError || 'messages.networkError',
    defaultError: errorKeys?.defaultError || 'messages.error',
  };

  if (error.isNetworkError) {
    toast.error(t(keys.networkError));
    console.error('Network Error:', error);
  } else {
    toast.error(error.error || t(keys.defaultError));
    console.error('API Error:', error);
  }
}; 
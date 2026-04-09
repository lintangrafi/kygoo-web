// Form validation utility functions
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (international format)
const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/;

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const validators = {
  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Invalid email format';
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return 'Phone number is required';
    if (value.length < 10) return 'Phone number must be at least 10 characters';
    if (!PHONE_REGEX.test(value)) return 'Invalid phone format';
    return null;
  },

  text: (value: string, minLength = 1, maxLength = 255): string | null => {
    if (!value) return 'This field is required';
    if (value.trim().length < minLength) return `Minimum ${minLength} characters required`;
    if (value.length > maxLength) return `Maximum ${maxLength} characters allowed`;
    return null;
  },

  textarea: (value: string, minLength = 10, maxLength = 5000): string | null => {
    if (!value) return 'This field is required';
    if (value.trim().length < minLength) return `Minimum ${minLength} characters required`;
    if (value.length > maxLength) return `Maximum ${maxLength} characters allowed`;
    return null;
  },

  select: (value: string | null): string | null => {
    if (!value) return 'Please select an option';
    return null;
  },

  date: (value: string): string | null => {
    if (!value) return 'Date is required';
    const dateObj = new Date(value);
    if (isNaN(dateObj.getTime())) return 'Invalid date format';
    const now = new Date();
    if (dateObj < now) return 'Date must be in the future';
    return null;
  },

  time: (value: string): string | null => {
    if (!value) return 'Time is required';
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) return 'Invalid time format (HH:MM)';
    return null;
  },

  number: (value: string | number): string | null => {
    if (value === '' || value === null) return 'This field is required';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Must be a valid number';
    if (num <= 0) return 'Must be greater than 0';
    return null;
  },

  url: (value: string): string | null => {
    if (!value) return 'URL is required';
    if (!URL_REGEX.test(value)) return 'Invalid URL format';
    return null;
  },

  minLength: (value: string, length: number): string | null => {
    if (value.length < length) return `Minimum ${length} characters required`;
    return null;
  },

  maxLength: (value: string, length: number): string | null => {
    if (value.length > length) return `Maximum ${length} characters allowed`;
    return null;
  },

  confirm: (value: string, compareValue: string, fieldName = 'fields'): string | null => {
    if (value !== compareValue) return `${fieldName} do not match`;
    return null;
  },
};

// Form validation function
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): ValidationResult => {
  const errors: ValidationError[] = [];

  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Check if field has error
export const hasError = (fieldName: string, errors: ValidationError[]): boolean => {
  return errors.some((err) => err.field === fieldName);
};

// Get error message for field
export const getError = (fieldName: string, errors: ValidationError[]): string | null => {
  const error = errors.find((err) => err.field === fieldName);
  return error?.message || null;
};

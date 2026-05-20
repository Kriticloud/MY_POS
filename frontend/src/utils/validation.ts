// Lightweight validation helpers (no external dependency needed)

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(value: string | undefined, field: string, label?: string): ValidationError | null {
  if (!value || !value.trim()) return { field, message: `${label || field} is required` };
  return null;
}

export function validateEmail(value: string, field = 'email'): ValidationError | null {
  if (!value) return null; // optional unless combined with required
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { field, message: 'Invalid email address' };
  return null;
}

export function validatePhone(value: string, field = 'phone'): ValidationError | null {
  if (!value) return null;
  if (!/^[+]?[\d\s\-().]{7,20}$/.test(value)) return { field, message: 'Invalid phone number' };
  return null;
}

export function validateMinLength(value: string, min: number, field: string, label?: string): ValidationError | null {
  if (value && value.length < min) return { field, message: `${label || field} must be at least ${min} characters` };
  return null;
}

export function validatePositiveNumber(value: string | number, field: string, label?: string): ValidationError | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num < 0) return { field, message: `${label || field} must be a positive number` };
  return null;
}

export function validatePrice(value: string | number, field = 'price'): ValidationError | null {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num < 0) return { field, message: 'Price must be a valid positive number' };
  return null;
}

export function validateForm(rules: (ValidationError | null)[]): ValidationError[] {
  return rules.filter((r): r is ValidationError => r !== null);
}

// Quick toast-based validation — returns true if valid
import toast from 'react-hot-toast';

export function validate(rules: (ValidationError | null)[]): boolean {
  const errors = validateForm(rules);
  if (errors.length > 0) {
    toast.error(errors[0].message);
    return false;
  }
  return true;
}

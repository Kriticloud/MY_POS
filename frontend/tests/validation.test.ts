import { describe, it, expect } from 'vitest';
import { validate, validateRequired, validateEmail, validatePhone, validatePrice, validatePositiveNumber } from '../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateRequired', () => {
    it('returns error for empty string', () => {
      expect(validateRequired('', 'Name')).toBe('Name is required');
    });
    it('returns null for valid value', () => {
      expect(validateRequired('John', 'Name')).toBeNull();
    });
    it('returns error for whitespace-only string', () => {
      expect(validateRequired('   ', 'Name')).toBe('Name is required');
    });
  });

  describe('validateEmail', () => {
    it('returns null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
    });
    it('returns error for invalid email', () => {
      expect(validateEmail('invalid')).toBe('Invalid email format');
    });
    it('returns null for empty (optional)', () => {
      expect(validateEmail('')).toBeNull();
    });
  });

  describe('validatePhone', () => {
    it('returns null for valid phone', () => {
      expect(validatePhone('+1234567890')).toBeNull();
    });
    it('returns error for too short phone', () => {
      expect(validatePhone('123')).toBe('Invalid phone number');
    });
  });

  describe('validatePrice', () => {
    it('returns null for valid price', () => {
      expect(validatePrice(9.99)).toBeNull();
    });
    it('returns error for zero', () => {
      expect(validatePrice(0)).not.toBeNull();
    });
    it('returns error for negative', () => {
      expect(validatePrice(-5)).not.toBeNull();
    });
  });

  describe('validatePositiveNumber', () => {
    it('returns null for positive number', () => {
      expect(validatePositiveNumber(5, 'Qty')).toBeNull();
    });
    it('returns error for zero', () => {
      expect(validatePositiveNumber(0, 'Qty')).not.toBeNull();
    });
  });
});

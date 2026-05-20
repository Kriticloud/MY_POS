import { describe, it, expect } from 'vitest';
import { exportToCSV, parseCSV } from '../src/utils/csv';

describe('CSV Utils', () => {
  describe('parseCSV', () => {
    it('parses simple CSV', () => {
      const result = parseCSV('name,price\nProduct A,9.99\nProduct B,14.99');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Product A');
      expect(result[0].price).toBe('9.99');
      expect(result[1].name).toBe('Product B');
    });

    it('handles quoted fields with commas', () => {
      const result = parseCSV('name,desc\n"Product, Inc",Good');
      expect(result[0].name).toBe('Product, Inc');
    });

    it('returns empty array for empty input', () => {
      expect(parseCSV('')).toHaveLength(0);
    });

    it('handles header-only CSV', () => {
      expect(parseCSV('name,price')).toHaveLength(0);
    });
  });
});

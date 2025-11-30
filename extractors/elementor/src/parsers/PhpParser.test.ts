/**
 * Tests for PHP serialization parser
 */

import { describe, it, expect } from 'vitest';
import {
  parsePhpSerialized,
  parseElementorData,
  parseElementorSettings,
  sanitizeElementorData,
} from './PhpParser';

describe('PhpParser', () => {
  describe('parsePhpSerialized', () => {
    it('should parse valid PHP serialized string', () => {
      const serialized = 's:5:"hello";';
      const result = parsePhpSerialized(serialized);
      expect(result).toBe('hello');
    });

    it('should parse PHP serialized array', () => {
      const serialized = 'a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}';
      const result = parsePhpSerialized(serialized);
      expect(result).toEqual(['foo', 'bar']);
    });

    it('should return null for invalid data', () => {
      const result = parsePhpSerialized('not serialized');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parsePhpSerialized('');
      expect(result).toBeNull();
    });

    it('should return null for non-string input', () => {
      const result = parsePhpSerialized(123 as any);
      expect(result).toBeNull();
    });
  });

  describe('parseElementorData', () => {
    it('should return array if already parsed', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = parseElementorData(data);
      expect(result).toEqual(data);
    });

    it('should parse JSON string', () => {
      const jsonString = '[{"id":1},{"id":2}]';
      const result = parseElementorData(jsonString);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should parse PHP serialized array', () => {
      const serialized = 'a:2:{i:0;s:3:"foo";i:1;s:3:"bar";}';
      const result = parseElementorData(serialized);
      expect(result).toEqual(['foo', 'bar']);
    });

    it('should return null for non-array result', () => {
      const result = parseElementorData('s:5:"hello";');
      expect(result).toBeNull();
    });

    it('should return null for invalid data', () => {
      const result = parseElementorData('invalid');
      expect(result).toBeNull();
    });
  });

  describe('parseElementorSettings', () => {
    it('should return object if already parsed', () => {
      const settings = { template: 'default', width: 1140 };
      const result = parseElementorSettings(settings);
      expect(result).toEqual(settings);
    });

    it('should parse JSON string to object', () => {
      const jsonString = '{"template":"default","width":1140}';
      const result = parseElementorSettings(jsonString);
      expect(result).toEqual({ template: 'default', width: 1140 });
    });

    it('should return null for array result', () => {
      const jsonString = '[1,2,3]';
      const result = parseElementorSettings(jsonString);
      expect(result).toBeNull();
    });

    it('should return null for invalid data', () => {
      const result = parseElementorSettings('invalid');
      expect(result).toBeNull();
    });
  });

  describe('sanitizeElementorData', () => {
    it('should return null for null/undefined', () => {
      expect(sanitizeElementorData(null)).toBeNull();
      expect(sanitizeElementorData(undefined)).toBeNull();
    });

    it('should filter null values from arrays', () => {
      const data = [1, null, 2, undefined, 3];
      const result = sanitizeElementorData(data);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should filter null values from objects', () => {
      const data = { a: 1, b: null, c: undefined, d: 2 };
      const result = sanitizeElementorData(data);
      expect(result).toEqual({ a: 1, d: 2 });
    });

    it('should recursively sanitize nested structures', () => {
      const data = {
        sections: [
          { id: 1, name: 'section1', meta: null },
          null,
          { id: 2, name: 'section2', widgets: [{ id: 1 }, null, { id: 2 }] },
        ],
        settings: { width: 1140, height: null },
      };
      const result = sanitizeElementorData(data);
      expect(result).toEqual({
        sections: [
          { id: 1, name: 'section1' },
          { id: 2, name: 'section2', widgets: [{ id: 1 }, { id: 2 }] },
        ],
        settings: { width: 1140 },
      });
    });

    it('should preserve primitive values', () => {
      expect(sanitizeElementorData('test')).toBe('test');
      expect(sanitizeElementorData(123)).toBe(123);
      expect(sanitizeElementorData(true)).toBe(true);
    });
  });
});

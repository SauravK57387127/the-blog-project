import { describe, test, expect } from '@jest/globals';
import { sanitizeHTML, sanitizePlainText, sanitizeArray } from '../../apps/backend/src/utils/sanitize.js';

describe('Sanitization Utils', () => {
  describe('sanitizeHTML', () => {
    test('should remove dangerous script tags', () => {
      const dirty = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).toBe('<p>Hello</p>');
      expect(clean).not.toContain('<script>');
    });

    test('should keep safe HTML tags', () => {
      const dirty = '<p><strong>Bold</strong> and <em>italic</em></p>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).toBe('<p><strong>Bold</strong> and <em>italic</em></p>');
    });

    test('should remove event handlers', () => {
      const dirty = '<img src=x onerror="alert(1)">';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('onerror');
    });

    test('should handle null/undefined', () => {
      expect(sanitizeHTML(null)).toBe('');
      expect(sanitizeHTML(undefined)).toBe('');
    });
  });

  describe('sanitizePlainText', () => {
    test('should remove all HTML', () => {
      const dirty = '<p>Hello <script>alert("XSS")</script></p>';
      const clean = sanitizePlainText(dirty);
      
      expect(clean).toBe('Hello ');
      expect(clean).not.toContain('<');
    });
  });

  describe('sanitizeArray', () => {
    test('should sanitize array of strings', () => {
      const dirty = ['tag1', '<script>alert(1)</script>', 'tag2'];
      const clean = sanitizeArray(dirty);
      
      expect(clean).toEqual(['tag1', '', 'tag2']);
    });

    test('should filter non-strings', () => {
      const dirty = ['tag1', 123, { tag: 'tag2' }, null];
      const clean = sanitizeArray(dirty);
      
      expect(clean).toEqual(['tag1']);
    });
  });
});

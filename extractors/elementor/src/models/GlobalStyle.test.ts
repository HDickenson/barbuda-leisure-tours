/**
 * Tests for GlobalStyle model helpers
 */

import { describe, it, expect } from 'vitest';
import {
  resolveGlobalColor,
  resolveGlobalTypography,
} from './GlobalStyle';
import type { GlobalStyle } from './GlobalStyle';

describe('GlobalStyle', () => {
  describe('resolveGlobalColor', () => {
    it('should resolve existing color', () => {
      const globalStyle: GlobalStyle = {
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
        },
      };

      expect(resolveGlobalColor(globalStyle, 'primary')).toBe('#ff0000');
      expect(resolveGlobalColor(globalStyle, 'secondary')).toBe('#00ff00');
    });

    it('should return undefined for non-existent color', () => {
      const globalStyle: GlobalStyle = {
        colors: {
          primary: '#ff0000',
        },
      };

      expect(resolveGlobalColor(globalStyle, 'accent')).toBeUndefined();
    });

    it('should return undefined when no colors defined', () => {
      const globalStyle: GlobalStyle = {};

      expect(resolveGlobalColor(globalStyle, 'primary')).toBeUndefined();
    });

    it('should return undefined when globalStyle is undefined', () => {
      expect(resolveGlobalColor(undefined, 'primary')).toBeUndefined();
    });
  });

  describe('resolveGlobalTypography', () => {
    it('should resolve existing typography', () => {
      const globalStyle: GlobalStyle = {
        typography: {
          primary: {
            fontFamily: 'Arial',
            fontSize: { size: 16, unit: 'px' },
            fontWeight: '400',
            fontStyle: 'normal',
            textTransform: 'none',
            textDecoration: 'none',
            lineHeight: { size: 1.5, unit: 'em' },
            letterSpacing: { size: 0, unit: 'px' },
          },
        },
      };

      const typography = resolveGlobalTypography(globalStyle, 'primary');
      expect(typography).toBeDefined();
      expect(typography?.fontFamily).toBe('Arial');
      expect(typography?.fontSize.size).toBe(16);
    });

    it('should return undefined for non-existent typography', () => {
      const globalStyle: GlobalStyle = {
        typography: {
          primary: {
            fontFamily: 'Arial',
            fontSize: { size: 16, unit: 'px' },
            fontWeight: '400',
            fontStyle: 'normal',
            textTransform: 'none',
            textDecoration: 'none',
            lineHeight: { size: 1.5, unit: 'em' },
            letterSpacing: { size: 0, unit: 'px' },
          },
        },
      };

      expect(resolveGlobalTypography(globalStyle, 'secondary')).toBeUndefined();
    });

    it('should return undefined when no typography defined', () => {
      const globalStyle: GlobalStyle = {};

      expect(resolveGlobalTypography(globalStyle, 'primary')).toBeUndefined();
    });

    it('should return undefined when globalStyle is undefined', () => {
      expect(resolveGlobalTypography(undefined, 'primary')).toBeUndefined();
    });
  });
});

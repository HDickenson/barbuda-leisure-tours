/**
 * Tests for ElementorWidget model helpers
 */

import { describe, it, expect } from 'vitest';
import { isWidgetType } from './ElementorWidget';
import type { ElementorWidget } from './ElementorWidget';

describe('ElementorWidget', () => {
  describe('isWidgetType', () => {
    it('should return true for matching widget type', () => {
      const widget: ElementorWidget = {
        id: 'widget1',
        elType: 'widget',
        widgetType: 'heading',
        content: { title: 'Test', htmlTag: 'h1' },
        style: {},
        advanced: {},
      };

      expect(isWidgetType(widget, 'heading')).toBe(true);
    });

    it('should return false for non-matching widget type', () => {
      const widget: ElementorWidget = {
        id: 'widget1',
        elType: 'widget',
        widgetType: 'heading',
        content: { title: 'Test', htmlTag: 'h1' },
        style: {},
        advanced: {},
      };

      expect(isWidgetType(widget, 'text-editor')).toBe(false);
    });

    it('should narrow type for TypeScript', () => {
      const widget: ElementorWidget = {
        id: 'widget1',
        elType: 'widget',
        widgetType: 'heading',
        content: { title: 'Test', htmlTag: 'h1' },
        style: {},
        advanced: {},
      };

      if (isWidgetType(widget, 'heading')) {
        // TypeScript should know widgetType is 'heading'
        const type: 'heading' = widget.widgetType;
        expect(type).toBe('heading');
      }
    });
  });
});

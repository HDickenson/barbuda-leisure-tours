'use client';

import { useState } from 'react';

/**
 * Generic Accordion Item Type Definition
 * Can be extended for different use cases
 */
export interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

/**
 * Single Accordion Item Component
 * Displays a collapsible question/answer or title/content pair
 */
export function AccordionItem({
  item,
  isOpen,
  onToggle,
  renderContent,
}: {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
  renderContent?: (item: AccordionItemData) => React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
      >
        <h3 className="text-lg font-semibold text-gray-800 text-left">{item.title}</h3>
        <span
          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </span>
      </button>

      <div
        id={`accordion-content-${item.id}`}
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
        role="region"
        aria-labelledby={`accordion-button-${item.id}`}
      >
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {renderContent ? (
            renderContent(item)
          ) : (
            <p className="text-gray-700 leading-relaxed">{item.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Accordion Container Component
 * Manages state and renders multiple accordion items
 */
export interface AccordionProps {
  items: AccordionItemData[];
  title?: string;
  subtitle?: string;
  renderContent?: (item: AccordionItemData) => React.ReactNode;
  allowMultiple?: boolean; // Allow multiple items open at once
  className?: string;
}

export default function Accordion({
  items,
  title,
  subtitle,
  renderContent,
  allowMultiple = true,
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-lg text-gray-700">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-0">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            renderContent={renderContent}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Grouped Accordion Component
 * Renders multiple accordion sections with category headings
 */
export interface GroupedAccordionProps {
  groups: Array<{
    category: string;
    items: AccordionItemData[];
  }>;
  renderContent?: (item: AccordionItemData) => React.ReactNode;
  allowMultiple?: boolean;
}

export function GroupedAccordion({
  groups,
  renderContent,
  allowMultiple = true,
}: GroupedAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full space-y-12">
      {groups.map((group) => (
        <div key={group.category}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
            {group.category}
          </h2>
          <div className="space-y-0">
            {group.items.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                renderContent={renderContent}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

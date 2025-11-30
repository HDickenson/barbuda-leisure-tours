'use client';

import { useState } from 'react';
import InnerPageHero from '@/components/InnerPageHero';

// FAQ Item Type Definition
interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

// FAQ Data - Extracted from live WordPress site
const faqData: FAQItem[] = [
  // Getting Started
  {
    id: 'start-01',
    category: 'Getting Started',
    question: "What's included in my tour package?",
    answer: 'Our tour package includes return trip by air or sea, transport in Barbuda, sightseeing at historical landmarks, BBQ lunch with optional seafood upgrades, bottled water, and beach time in Barbuda.'
  },
  {
    id: 'start-02',
    category: 'Getting Started',
    question: "What's not included in my tour package?",
    answer: 'Taxi fares to and from your hotel, breakfast, water sports such as scuba diving or kayaking, travel insurance, and gratuities are not included in our tour package.'
  },
  {
    id: 'start-03',
    category: 'Getting Started',
    question: 'What should I bring with me on the tour?',
    answer: 'Please bring sunscreen, a hat, sunglasses, swimwear, a towel, and any personal items you may need, such as a camera or snorkelling gear, as well as your ID and necessary travel documents.'
  },
  {
    id: 'start-04',
    category: 'Getting Started',
    question: 'Is the tour suitable for young children?',
    answer: 'Unfortunately, our tours are not suitable for children under the age of 2 due to the activities involved.'
  },
  {
    id: 'start-05',
    category: 'Getting Started',
    question: 'What happens if the weather is bad on the day of my tour?',
    answer: 'If the weather is bad, we will offer a full refund or the option to rebook for another day.'
  },
  {
    id: 'start-06',
    category: 'Getting Started',
    question: 'Where is the meeting point to start our tours?',
    answer: 'For the Discover Barbuda by Air Tour, please meet your Tour Representative at V.C. Bird International Airport. For the Discover Barbuda by Sea Tour, please meet at the Heritage Quay Ferry Dock.'
  },

  // Booking & Payment
  {
    id: 'booking-01',
    category: 'Booking & Payment',
    question: 'Can I customise my itinerary?',
    answer: 'Yes, you can customise your itinerary, but please note that the package cost will remain the same.'
  },
  {
    id: 'booking-02',
    category: 'Booking & Payment',
    question: 'How do I book a tour?',
    answer: 'You can book a tour by visiting our website, choosing your tour, and following the booking process, or by contacting us directly via phone or email.'
  },
  {
    id: 'booking-03',
    category: 'Booking & Payment',
    question: 'Is there a cancellation policy?',
    answer: 'Yes, you can cancel up to 72 hours before departure for a refund, excluding flight costs.'
  },
  {
    id: 'booking-04',
    category: 'Booking & Payment',
    question: 'Are flights or ferry tickets included in the price?',
    answer: 'Yes, return transport by air or sea is included in the price, but please note that flight prices are non-refundable if cancelled after booking.'
  },

  // Tour Details
  {
    id: 'details-01',
    category: 'Tour Details',
    question: 'How long is the tour?',
    answer: 'Yes, we offer complimentary upgrades for groups of two or more, as well as seasonal offers, so please ask about our current deals.'
  },
  {
    id: 'details-02',
    category: 'Tour Details',
    question: 'Is travel insurance necessary?',
    answer: 'We highly recommend purchasing travel insurance to cover unexpected events.'
  },
  {
    id: 'details-03',
    category: 'Tour Details',
    question: 'What is the best time to visit Barbuda?',
    answer: 'Barbuda is beautiful year-round, but the best time for outdoor activities is during the dry season, from December to April.'
  },
  {
    id: 'details-04',
    category: 'Tour Details',
    question: 'Are there weight restrictions on flights?',
    answer: 'Yes, please provide your weight at the time of booking so we can make the necessary arrangements for your flight.'
  },
  {
    id: 'details-05',
    category: 'Tour Details',
    question: 'Do I need to bring cash?',
    answer: "While some services are prepaid, it's a good idea to bring some cash for gratuities and any extras you might want to purchase during your leisure time."
  },

  // Travel & Safety
  {
    id: 'travel-01',
    category: 'Travel & Safety',
    question: 'How long does it take to get to Barbuda from Antigua by ferry?',
    answer: 'The ferry ride from Antigua to Barbuda is approximately 90 minutes each way.'
  },
  {
    id: 'travel-02',
    category: 'Travel & Safety',
    question: 'How long does it take to get to Barbuda from Antigua by air?',
    answer: 'The flight from Antigua to Barbuda is approximately 15 minutes each way.'
  },
  {
    id: 'travel-03',
    category: 'Travel & Safety',
    question: 'Do you offer a vegetarian meal option?',
    answer: 'Yes, we offer a vegetarian meal option, so please let us know in advance if you have any dietary requirements.'
  },
  {
    id: 'travel-04',
    category: 'Travel & Safety',
    question: 'Can I bring my snorkelling gear?',
    answer: "Yes, you're welcome to bring your own snorkelling gear, however, this activity is not supervised."
  },
  {
    id: 'travel-05',
    category: 'Travel & Safety',
    question: 'Do you offer chartered trips to Barbuda?',
    answer: 'Yes, we offer private charters to Barbuda via boat or helicopter through our affiliate partners.'
  },
];

// Accordion Component
function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-0 rounded-none overflow-hidden mb-[10px] shadow-none">
      <button
        onClick={onToggle}
        className={`w-full px-[20px] py-[15px] flex items-center justify-between transition-colors border border-[#d5d8dc] rounded-[5px] ${
          isOpen ? 'bg-[#30bbd8] text-white border-[#30bbd8]' : 'bg-white text-[#333333] hover:text-[#30bbd8]'
        }`}
        aria-expanded={isOpen}
      >
        <h3 className={`text-[16px] font-normal text-left font-['Lexend_Deca'] ${isOpen ? 'text-white' : 'text-[#333333]'}`}>
          {item.question}
        </h3>
        <span
          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-white' : 'text-[#333333]'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-[30px] pb-[30px] pl-[65px] pr-[85px] bg-[rgba(48,187,216,0.06)] border-0">
          <p className="font-['Open_Sans'] text-[14px] leading-[24px] text-[rgb(122,122,122)]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// Category Section Component
function FAQCategory({
  category,
  items,
  openItems,
  toggleItem,
}: {
  category: string;
  items: FAQItem[];
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}) {
  return (
    <div className="mb-12">
      <h2 className="font-['Open_Sans'] text-[24px] font-semibold text-[rgb(84,89,95)] mb-[20px]">
        {category}
      </h2>
      <div className="space-y-0">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Main FAQ Page Component
export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Group FAQ items by category
  const groupedFAQ = faqData.reduce(
    (acc, item) => {
      const categoryIndex = acc.findIndex((g) => g.category === item.category);
      if (categoryIndex > -1) {
        acc[categoryIndex].items.push(item);
      } else {
        acc.push({ category: item.category, items: [item] });
      }
      return acc;
    },
    [] as Array<{ category: string; items: FAQItem[] }>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <InnerPageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Barbuda Leisure Day Tours"
        backgroundImage="/images/downloaded/BarbudaLeisureTours-6.jpg"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      <div className="page-content">

      {/* FAQ Content Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* FAQ Accordion */}
          <div className="space-y-8">
            {groupedFAQ.map((group) => (
              <FAQCategory
                key={group.category}
                category={group.category}
                items={group.items}
                openItems={openItems}
                toggleItem={toggleItem}
              />
            ))}
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}

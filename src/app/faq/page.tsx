'use client';

import { useState } from 'react';
import ContactForm from '@/components/ContactForm';
import InnerPageHero from '@/components/InnerPageHero';

// FAQ Item Type Definition
interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

// FAQ Data
const faqData: FAQItem[] = [
  // Booking and Reservations
  {
    id: 'booking-01',
    category: 'Booking and Reservations',
    question: 'How do I book a tour?',
    answer: 'Booking a tour with Barbuda Leisure is easy! You can book directly through our website, call us by phone, or email us with your preferred tour and dates. Our booking team will confirm availability and send you a booking confirmation with all tour details and payment instructions. Deposits are typically required to secure your reservation.'
  },
  {
    id: 'booking-02',
    category: 'Booking and Reservations',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and digital payment options. A non-refundable deposit of 30% is required at booking, with the remaining balance due 14 days before your tour date. Full payment is required for all bookings made within 14 days of the tour date.'
  },
  {
    id: 'booking-03',
    category: 'Booking and Reservations',
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 4-6 weeks in advance to secure your preferred dates and tour type. However, we do accept last-minute bookings subject to availability. Peak season (December to April) books up quickly, so advance booking is especially important during these months.'
  },
  {
    id: 'booking-04',
    category: 'Booking and Reservations',
    question: 'Do you offer discounts for group bookings?',
    answer: 'Yes! We offer special discounts for group bookings of 10 or more people. Contact our group booking specialist for customized quotes and packages. Groups can also enjoy flexible scheduling and personalized itineraries based on your preferences.'
  },

  // Tour Details and What's Included
  {
    id: 'details-01',
    category: 'Tour Details and What\'s Included',
    question: 'What is included in the tour package?',
    answer: 'Our tour packages include professional guide services, transportation to/from your accommodation, all entrance fees and permits, lunch, snacks, drinking water, and basic travel insurance. Specific inclusions vary by tour type. Please refer to your tour details or contact us for a complete breakdown of what\'s included in your specific tour.'
  },
  {
    id: 'details-02',
    category: 'Tour Details and What\'s Included',
    question: 'What is not included in the tour?',
    answer: 'Typically not included are alcoholic beverages (beyond complimentary drinks), personal equipment rental (snorkeling gear, cameras), tips/gratuities, travel insurance beyond basic coverage, and any personal shopping or activities on your own. Optional add-ons are available at an additional cost.'
  },
  {
    id: 'details-03',
    category: 'Tour Details and What\'s Included',
    question: 'How long are the tours?',
    answer: 'Tour durations vary based on the type of experience. Half-day tours typically last 4-5 hours, while full-day tours run 8-10 hours. Special sunset and evening tours are usually 2-3 hours. Exact times are provided in your booking confirmation and include travel time from your accommodation.'
  },
  {
    id: 'details-04',
    category: 'Tour Details and What\'s Included',
    question: 'Can I customize my tour itinerary?',
    answer: 'Absolutely! We offer customizable private tours to suit your interests and schedule. Whether you want more time at specific locations, prefer certain activities, or have dietary restrictions, our team will work with you to create the perfect experience. Custom tours may have adjusted pricing based on your specifications.'
  },

  // Transportation Options
  {
    id: 'transport-01',
    category: 'Transportation Options',
    question: 'What are the transportation options?',
    answer: 'We offer three primary transportation options: Air tours via chartered aircraft for spectacular aerial views of Barbuda, Sea tours using our modern catamaran for water-based exploration and water activities, and Land tours with comfortable ground vehicles for cultural and nature experiences. Choose based on your preference and interests.'
  },
  {
    id: 'transport-02',
    category: 'Transportation Options',
    question: 'Is the air tour safe for flying with a helicopter/plane?',
    answer: 'Yes, safety is our top priority. All our aircraft are regularly maintained and certified by aviation authorities. Our pilots are experienced and hold all necessary licenses and certifications. We conduct comprehensive safety briefings before every flight. Aircraft meet all international safety standards and carry full insurance coverage.'
  },
  {
    id: 'transport-03',
    category: 'Transportation Options',
    question: 'How many passengers can the catamaran accommodate?',
    answer: 'Our catamarans can comfortably accommodate groups of 6-50+ passengers depending on the specific vessel used. We have multiple boats available to match group size and tour type. All vessels are equipped with safety equipment, restroom facilities, and covered areas for shade.'
  },
  {
    id: 'transport-04',
    category: 'Transportation Options',
    question: 'Will I get seasick on the catamaran?',
    answer: 'Our catamarans are specifically designed for stability in various sea conditions and are considerably less likely to cause seasickness compared to single-hull boats. We recommend taking seasickness medication before boarding if you\'re prone to motion sickness. Our crew can also recommend preventative measures and provide assistance if needed.'
  },

  // What to Bring
  {
    id: 'bring-01',
    category: 'What to Bring',
    question: 'What should I pack for the tour?',
    answer: 'Pack light, comfortable clothing suitable for tropical weather, swimwear, a light cover-up, and water shoes or sandals. Bring sunscreen (reef-safe), sunglasses, a hat or cap, a reusable water bottle, and a dry bag for valuables. For air tours, wear comfortable clothes you can move in. Avoid heavy jewelry and loose items.'
  },
  {
    id: 'bring-02',
    category: 'What to Bring',
    question: 'Should I bring my own snorkeling gear?',
    answer: 'You don\'t need to! We provide high-quality snorkeling equipment including masks, fins, and snorkels at no extra cost. If you prefer using your own gear, you\'re welcome to bring it. We recommend having your own if you have specific size or comfort preferences.'
  },
  {
    id: 'bring-03',
    category: 'What to Bring',
    question: 'Can I bring my camera or GoPro?',
    answer: 'Absolutely! Cameras and GoPros are highly encouraged. Bring them in a waterproof case or bag, especially for water activities. We also have a professional photographer available for purchase of high-quality photos from your tour. Battery life can be limited in heat, so pack extra batteries or a power bank if possible.'
  },
  {
    id: 'bring-04',
    category: 'What to Bring',
    question: 'What about bringing drinks or food?',
    answer: 'Meals and beverages are included in your tour package, so you don\'t need to bring your own. However, if you have specific dietary requirements or preferences, notify us in advance and we\'ll accommodate you. Personal bottled water is welcome, though we provide complimentary water throughout the tour.'
  },

  // Weather and Best Times to Visit
  {
    id: 'weather-01',
    category: 'Weather and Best Times to Visit',
    question: 'What is the best time to visit Barbuda?',
    answer: 'The best time to visit is from December to April when weather is sunny, dry, and comfortable (75-85°F). This is high season with the most stable weather. The shoulder seasons (May, November) offer pleasant weather with fewer crowds. Hurricane season runs June-November; we operate tours year-round with appropriate precautions.'
  },
  {
    id: 'weather-02',
    category: 'Weather and Best Times to Visit',
    question: 'What should I expect weather-wise?',
    answer: 'Barbuda has a tropical climate with warm temperatures year-round (70-90°F). December-April is dry with gentle trade winds. May-November is wetter with afternoon showers, though most storms pass quickly. We monitor weather carefully and adjust itineraries as needed for safety. All our tours operate in safe weather conditions only.'
  },
  {
    id: 'weather-03',
    category: 'Weather and Best Times to Visit',
    question: 'Do you operate tours during hurricane season?',
    answer: 'Yes, we operate year-round, but we follow strict safety protocols during hurricane season (June-November). We continuously monitor weather forecasts and adjust tours as necessary. If severe weather is expected, we offer full refunds or rescheduling at no additional cost. Your safety is always our top priority.'
  },
  {
    id: 'weather-04',
    category: 'Weather and Best Times to Visit',
    question: 'What if it rains during my tour?',
    answer: 'Tropical showers are brief and often followed by sunshine. All our vessels have covered areas for protection. We carry rain gear and provide it upon request. Tours continue safely in light rain. For severe weather, we reschedule your tour or provide a full refund. Tours are designed to be enjoyable regardless of minor weather changes.'
  },

  // Group Bookings
  {
    id: 'group-01',
    category: 'Group Bookings',
    question: 'What is considered a group booking?',
    answer: 'A group booking is any party of 10 or more people. Groups receive special pricing, dedicated guides, and customizable itineraries. We can accommodate groups ranging from small teams to 100+ people with multiple boats/aircraft. Contact our group specialist for personalized quotes and packages.'
  },
  {
    id: 'group-02',
    category: 'Group Bookings',
    question: 'What discounts do you offer for groups?',
    answer: 'Group discounts typically start at 10% off for groups of 10-20 people and increase with larger groups. Volume discounts, special packages, and flexible payment terms are available. Contact us directly with your group size and preferences for a customized quote.'
  },
  {
    id: 'group-03',
    category: 'Group Bookings',
    question: 'Can we have a private guide for our group?',
    answer: 'Yes! All group bookings include dedicated guide(s) assigned specifically to your group. For larger groups, we assign multiple guides to ensure excellent service and safety. Private customized itineraries can be arranged based on your group\'s interests and requirements.'
  },
  {
    id: 'group-04',
    category: 'Group Bookings',
    question: 'Do you accommodate corporate team building events?',
    answer: 'Absolutely! We specialize in corporate group experiences including team building activities, customized itineraries, and catering options. Our tours provide excellent opportunities for team bonding in a beautiful natural setting. We work closely with corporate groups to ensure events meet your objectives.'
  },

  // Cancellation Policy
  {
    id: 'cancel-01',
    category: 'Cancellation Policy',
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 30+ days before tour date receive a full refund minus the 30% non-refundable deposit. Cancellations 15-29 days before receive 50% refund. Cancellations less than 15 days receive no refund. Tours cancelled by us due to weather receive full refunds or rescheduling options. Travel insurance is recommended.'
  },
  {
    id: 'cancel-02',
    category: 'Cancellation Policy',
    question: 'Can I reschedule instead of cancel?',
    answer: 'Yes! We encourage rescheduling. If you need to reschedule, notify us as soon as possible. Rescheduling to a different date within 12 months has no additional fees if done within our standard cancellation windows. Subject to availability, rescheduling is often the best option to preserve your booking.'
  },
  {
    id: 'cancel-03',
    category: 'Cancellation Policy',
    question: 'What if I get sick and can\'t make my tour?',
    answer: 'If you\'re unable to travel due to illness, contact us immediately. We\'ll reschedule your tour at no additional cost, subject to availability. If you have travel insurance that covers medical cancellation, you may be able to recover more of your costs. We\'re flexible with health-related changes.'
  },
  {
    id: 'cancel-04',
    category: 'Cancellation Policy',
    question: 'Do you offer refunds if we cancel due to bad weather?',
    answer: 'If we cancel due to severe weather, you receive a full refund or can reschedule your tour at no additional cost. If you prefer to proceed despite poor weather (at your own risk), adjusted pricing may apply. We prioritize safety and won\'t operate tours in dangerous weather conditions.'
  },

  // Safety and Requirements
  {
    id: 'safety-01',
    category: 'Safety and Requirements',
    question: 'Is travel insurance required?',
    answer: 'Travel insurance is not required but highly recommended. It protects against cancellations, medical emergencies, lost luggage, and flight delays. Given the nature of adventure tourism, comprehensive travel insurance with trip cancellation coverage provides important protection and peace of mind.'
  },
  {
    id: 'safety-02',
    category: 'Safety and Requirements',
    question: 'What documents do I need for entry?',
    answer: 'Most visitors need a valid passport valid for at least 6 months beyond their stay. Visa requirements vary by nationality; US citizens, EU citizens, and many others enjoy visa-free access for tourism. Check current requirements with your country\'s consulate. We recommend obtaining travel insurance that covers medical and trip cancellation.'
  },
  {
    id: 'safety-03',
    category: 'Safety and Requirements',
    question: 'Are there age restrictions for tours?',
    answer: 'Most tours are suitable for all ages. Children as young as 3-5 can participate in certain tours with adult supervision. Some activities like snorkeling require basic swimming ability. Pregnant women should avoid strenuous activities. Contact us with details about your group to confirm suitability and any necessary arrangements.'
  },
  {
    id: 'safety-04',
    category: 'Safety and Requirements',
    question: 'What happens in case of emergencies during the tour?',
    answer: 'All our tours operate with certified first aid trained guides. We carry emergency communication equipment and maintain protocols with local emergency services. Barbuda has a medical clinic and nearby hospital access. We have emergency contacts, insurance coverage, and evacuation procedures in place. Your safety is our paramount concern.'
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
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-800 text-left">{item.question}</h3>
        <span
          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
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
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-turquoise">
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
        backgroundImage="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureToursSection-2-2.jpg"
        showWave={false}
      />

      {/* FAQ Content Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Introduction */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Got Questions? We Have Answers
            </h2>
            <p className="text-lg text-gray-700">
              Find answers to common questions about our tours, booking process, safety,
              and more. Can&apos;t find what you&apos;re looking for? Contact us directly and our
              team will be happy to help.
            </p>
          </div>

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

      {/* Contact CTA Section */}
      <section className="py-12 bg-blue-50 border-y border-gray-200">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team is here to help! If you don&apos;t find the answer you&apos;re looking for,
            please don&apos;t hesitate to get in touch. We&apos;re available to answer any questions
            and help you plan the perfect Barbuda experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+1-268-460-3000"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us
            </a>
            <a
              href="mailto:info@barbudaleisure.com"
              className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />

      {/* Quick Info Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quick Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Operating Hours */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">24/7</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Available</h3>
              <p className="text-gray-700">
                Book your tour anytime online or contact us for immediate assistance
              </p>
            </div>

            {/* Fastest Booking */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">24 Hours</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmation</h3>
              <p className="text-gray-700">
                Get confirmation of your tour booking within 24 hours of submission
              </p>
            </div>

            {/* Group Sizes */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">1-100+</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Group Sizes</h3>
              <p className="text-gray-700">
                We accommodate everyone from solo travelers to large group tours
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

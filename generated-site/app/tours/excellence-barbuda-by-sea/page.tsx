'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function ExcellenceBarbudaBySeaPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'excellence',
    tourName: 'Excellence Barbuda by Sea',
    transportMethod: 'sea',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 190,
      child: 120,
      infant: 0,
    },
    mealUpgrades: {
      lobster: 0,
      fish: 0,
      conch: 0,
      shrimp: 0,
      vegetarian: 0,
    },
    restrictions: {
      minAge: 5,
      daysOfWeek: [5],
      seasonStart: new Date('2025-05-01'),
      seasonEnd: new Date('2025-10-31'),
    },
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Excellence Barbuda by Sea
            </h1>
            <p className="text-2xl text-white">
              Exclusive Friday departures - May to October
            </p>
          </div>
        </div>
      </section>

      {/* Tour Details */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:max-w-[1000px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8">
                  Experience Barbuda in style with our premium Excellence tour. Departing exclusively on Fridays
                  during the summer season, this tour offers a refined exploration of Barbuda's natural wonders with
                  premium amenities, smaller groups, and an included gourmet lunch experience.
                </p>

                <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Exclusive Availability
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Fridays Only</strong> - Limited weekly departures</li>
                    <li>• <strong>May 1 to October 31</strong> - Summer season exclusive</li>
                    <li>• <strong>Ages 5+</strong> - Children under 5 not permitted</li>
                    <li>• <strong>Small Groups</strong> - Enhanced experience with limited capacity</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Premium ferry transportation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Expert guided island tour</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Frigate Bird Sanctuary visit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Extended beach time at pink sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Gourmet lunch included (no upgrades needed)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Premium beverages and refreshments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>All ground transportation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Snorkeling equipment</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    Highlights
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Premium small-group experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Gourmet lunch included in price</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Exclusive Friday-only departures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>World's largest Frigate Bird colony</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Pristine beaches with extra time to relax</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Enhanced service and amenities</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Fridays only</strong> - No other day options available</li>
                    <li>• <strong>May 1 - October 31</strong> - Seasonal tour</li>
                    <li>• <strong>Minimum age 5 years</strong> - No infants or toddlers</li>
                    <li>• Duration: Full day (approximately 8 hours)</li>
                    <li>• Limited availability - advance booking highly recommended</li>
                    <li>• No passport required (inter-island travel)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-8 rounded-lg sticky top-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#4DD0E1' }}>
                  $190
                </div>
                <p className="text-gray-600 mb-6">per adult</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Pricing</h3>
                    <p className="text-lg">Adults: $190</p>
                    <p className="text-lg">Children (5-12): $120</p>
                    <p className="text-sm text-gray-600 italic">Under 5: Not permitted</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Schedule</h3>
                    <p className="text-lg">Fridays Only</p>
                    <p className="text-sm text-gray-600">May - October</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">Full Day (8 hours)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                    <p className="text-lg">Premium Ferry</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-cyan-500 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:bg-cyan-600 transition transform hover:scale-105"
                >
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Lunch included • Fridays only
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourConfig={tourConfig}
      />
    </main>
  )
}

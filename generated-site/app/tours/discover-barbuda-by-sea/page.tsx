'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function DiscoverBarbudaBySeaPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'discover-sea',
    tourName: 'Discover Barbuda by Sea',
    transportMethod: 'sea',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 249,
      child: 199,
      infant: 99,
    },
    mealUpgrades: {
      lobster: 15,
      fish: 10,
      conch: 10,
      shrimp: 10,
      vegetarian: 5,
    },
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Discover Barbuda by Sea
            </h1>
            <p className="text-2xl text-white">
              Sail to paradise and explore Barbuda by boat
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
                  Cruise across the stunning turquoise waters between Antigua and Barbuda on our comfortable ferry.
                  This signature tour offers a relaxed journey to Barbuda's pristine beaches, complete with island
                  exploration, authentic Caribbean cuisine, and plenty of time to soak up the sun.
                </p>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Round-trip ferry transportation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Guided tour of Barbuda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Visit to Frigate Bird Sanctuary</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Beach time at famous pink sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Traditional Caribbean BBQ lunch</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>All ground transportation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Professional guide and refreshments</span>
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
                      <span>Scenic ferry ride across crystal clear waters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>World's largest Frigate Bird colony</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Pristine pink and white sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Historic ruins and local culture</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Swimming and snorkeling opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Delicious meal upgrade options available</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• No passport required (inter-island travel)</li>
                    <li>• Duration: Full day (approximately 7-8 hours)</li>
                    <li>• Comfortable ferry with onboard facilities</li>
                    <li>• Minimum 3 days advance booking required</li>
                    <li>• Bring sunscreen, towel, and swimwear</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-8 rounded-lg sticky top-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#4DD0E1' }}>
                  $249
                </div>
                <p className="text-gray-600 mb-6">per adult</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Pricing</h3>
                    <p className="text-lg">Adults: $249</p>
                    <p className="text-lg">Children: $199</p>
                    <p className="text-lg">Infants: $99</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">Full Day (7-8 hours)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                    <p className="text-lg">Ferry / Boat</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Difficulty</h3>
                    <p className="text-lg">Easy</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-cyan-500 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:bg-cyan-600 transition transform hover:scale-105"
                >
                  Book Now
                </button>
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

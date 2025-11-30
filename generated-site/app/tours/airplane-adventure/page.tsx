'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function AirplaneAdventurePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'private-airplane',
    tourName: 'Barbuda Exclusive: Airplane Adventure',
    transportMethod: 'airplane',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 2800,
      child: 2800,
      infant: 1400,
    },
    mealUpgrades: {
      lobster: 50,
      fish: 30,
      conch: 30,
      shrimp: 30,
      vegetarian: 20,
    },
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="w-full h-full bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Barbuda Exclusive: Airplane Adventure
            </h1>
            <p className="text-2xl text-white">
              Your private aircraft charter - Luxury and flexibility combined
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
                  Fly to Barbuda in comfort and style aboard your own private aircraft. Perfect for those seeking
                  a premium aerial experience with more space and amenities than a helicopter. Enjoy spectacular
                  aerial views, smooth flights, and a fully customizable adventure to one of the Caribbean's most
                  beautiful islands.
                </p>

                <div className="mb-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Private Aircraft Charter Details
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Private Aircraft</strong> - Exclusive charter for your group</li>
                    <li>• <strong>Round Trip Service</strong> - Comfortable flights both ways</li>
                    <li>• <strong>Custom Schedule</strong> - Flexible departure and return times</li>
                    <li>• <strong>Premium Comfort</strong> - More spacious than helicopters</li>
                    <li>• <strong>Starting from $2,800</strong> - Based on group size</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Private aircraft charter with experienced pilot</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Round-trip flights to Barbuda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Scenic aerial tour of both islands</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Private guided island exploration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Visit to Frigate Bird Sanctuary</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Beach time at pristine pink sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Gourmet lunch with premium meal options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Premium beverages and refreshments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>All ground transportation in Barbuda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Personal concierge service</span>
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
                      <span>Private aircraft exclusively for your party</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Spectacular aerial views of the Caribbean</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>More space and comfort than helicopter flights</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Completely customizable itinerary</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>World-famous Frigate Bird Sanctuary</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Pristine beaches with private access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>VIP treatment throughout your journey</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Valid passport required for all passengers</li>
                    <li>• Weight information required for flight safety</li>
                    <li>• Fully customizable itinerary available</li>
                    <li>• Duration: Typically 5-7 hours (flexible)</li>
                    <li>• Pricing varies based on group size and requirements</li>
                    <li>• Minimum 7 days advance booking recommended</li>
                    <li>• Subject to weather and flight conditions</li>
                    <li>• Contact us to design your perfect experience</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#263238' }}>
                    Plan Your Custom Flight
                  </h3>
                  <p className="text-gray-700 mb-3">
                    This is a fully private aircraft charter tailored to your preferences. Submit your booking request
                    with group details and any special requests, and we'll create a personalized itinerary with exact
                    pricing based on your specific needs.
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Starting from $2,800 round trip - Final price depends on group size, duration, and custom requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-lg sticky top-4 border border-cyan-200">
                <div className="text-sm uppercase text-cyan-600 font-bold mb-2">Starting From</div>
                <div className="text-4xl font-bold mb-2" style={{ color: '#0288D1' }}>
                  $2,800
                </div>
                <p className="text-gray-600 mb-6">round trip charter</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Type</h3>
                    <p className="text-lg">Private Charter</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">5-7 hours (Flexible)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                    <p className="text-lg">Private Aircraft</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Capacity</h3>
                    <p className="text-lg">Up to 9 passengers</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:from-cyan-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
                >
                  Request Quote
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Custom pricing • Contact for details
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

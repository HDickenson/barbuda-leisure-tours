'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function YachtAdventurePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'private-yacht',
    tourName: 'Barbuda Exclusive: Yacht Adventure',
    transportMethod: 'yacht',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 1800,
      child: 1800,
      infant: 900,
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
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Barbuda Exclusive: Yacht Adventure
            </h1>
            <p className="text-2xl text-white">
              Your private yacht charter to paradise
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
                  Sail to Barbuda in style aboard your own private yacht. Experience the Caribbean Sea at its finest
                  with a fully customizable journey, premium amenities, and the freedom to explore at your own pace.
                  Perfect for families, groups, or romantic getaways seeking ultimate privacy and luxury.
                </p>

                <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Your Private Yacht Experience
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Private Yacht Charter</strong> - Exclusive to your group</li>
                    <li>• <strong>Flexible Departure</strong> - Dickenson Bay or Jolly Harbour</li>
                    <li>• <strong>Custom Itinerary</strong> - Your schedule, your preferences</li>
                    <li>• <strong>Premium Catering</strong> - Gourmet meals with upgrade options</li>
                    <li>• <strong>Starting from $1,800</strong> - Based on group size</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Private yacht charter with professional crew</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Round-trip sailing to Barbuda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Guided island tour upon arrival</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Frigate Bird Sanctuary visit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Extended beach time at pristine beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Gourmet BBQ lunch with premium options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Premium beverages, champagne, and cocktails</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Snorkeling equipment and water toys</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Onboard amenities and comfort</span>
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
                      <span>Private yacht exclusively for your group</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Sail through crystal-clear Caribbean waters</span>
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
                      <span>Pristine pink sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Gourmet dining with lobster and BBQ chicken options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Perfect for special occasions and celebrations</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• No passport required (inter-island travel)</li>
                    <li>• Departure from Dickenson Bay or Jolly Harbour</li>
                    <li>• Fully customizable itinerary - share your preferences</li>
                    <li>• Duration: Full day (typically 7-9 hours, flexible)</li>
                    <li>• Pricing varies based on group size and custom requests</li>
                    <li>• Minimum 7 days advance booking recommended</li>
                    <li>• Subject to weather and sea conditions</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#263238' }}>
                    Customize Your Journey
                  </h3>
                  <p className="text-gray-700 mb-3">
                    This is a fully private yacht charter tailored to your needs. Submit a booking request with your
                    group details and special requests, and we'll create a custom itinerary with exact pricing.
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Starting from $1,800 - Final price depends on group size, duration, and customizations.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-lg sticky top-4 border border-blue-200">
                <div className="text-sm uppercase text-blue-600 font-bold mb-2">Starting From</div>
                <div className="text-4xl font-bold mb-2" style={{ color: '#0277BD' }}>
                  $1,800
                </div>
                <p className="text-gray-600 mb-6">fully customizable</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Type</h3>
                    <p className="text-lg">Private Charter</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">Full Day (Flexible)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                    <p className="text-lg">Private Yacht</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Best For</h3>
                    <p className="text-lg">Groups & Families</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition transform hover:scale-105 shadow-lg"
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

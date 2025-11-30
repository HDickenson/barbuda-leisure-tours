'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function AlreadyInBarbudaPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'already-in-barbuda',
    tourName: 'Discover Barbuda - Local Guided Day Tour',
    transportMethod: 'sea',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 149,
      child: 99,
      infant: 29,
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
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-cyan-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Already in Barbuda?
            </h1>
            <p className="text-2xl text-white">
              Local Guided Day Tour - Perfect for yacht guests & island visitors
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
                  Already in Barbuda on a yacht, staying at a resort, or visiting independently? Join our
                  comprehensive guided day tour to discover everything this pristine island has to offer. Perfect
                  for those who've arranged their own transportation but want expert local guidance.
                </p>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Pickup from your location (hotel, yacht, or meeting point)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Comprehensive island tour with expert guide</span>
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
                      <span>Authentic Caribbean lunch with meal options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>All ground transportation during tour</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Beverages and refreshments</span>
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
                      <span>Local expert guide with insider knowledge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>World's largest Frigate Bird colony</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Famous pink and white sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Historic ruins and cultural sites</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Swimming, snorkeling, and beach activities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Perfect for yacht crews and resort guests</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• No transport to/from Antigua included</li>
                    <li>• Pickup available from hotels, River Wharf, or Princess Diana Beach</li>
                    <li>• Duration: 5-6 hours</li>
                    <li>• Best value for those already on island</li>
                    <li>• Bring sunscreen, towel, and swimwear</li>
                    <li>• Minimum 24 hours advance booking required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-8 rounded-lg sticky top-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#4DD0E1' }}>
                  $149
                </div>
                <p className="text-gray-600 mb-6">per adult</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Pricing</h3>
                    <p className="text-lg">Adults: $149</p>
                    <p className="text-lg">Children: $99</p>
                    <p className="text-lg">Infants: $29</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">5-6 hours</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Pickup</h3>
                    <p className="text-lg">Hotel or Wharf</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Best For</h3>
                    <p className="text-lg">Yacht Guests</p>
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

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function SharedBoatCharterPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'shared-boat',
    tourName: 'Shared Barbuda Boat Charter',
    transportMethod: 'private-boat',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 310,
      child: 220,
      infant: 75,
    },
    mealUpgrades: {
      lobster: 25,
      fish: 0,
      conch: 0,
      shrimp: 0,
      vegetarian: 0,
    },
    restrictions: {
      minAge: 0,
    },
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Shared Barbuda Boat Charter
            </h1>
            <p className="text-2xl text-white">
              Private boat experience at a shared price
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
                  Share the adventure and split the cost! Join other travelers for a private boat charter to Barbuda.
                  Enjoy the intimacy and flexibility of a private boat while keeping costs reasonable. Perfect for
                  couples and small groups looking for a more personalized experience.
                </p>

                <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Group Requirements
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Minimum 6 people required</strong> - Tour confirms with 6+ bookings</li>
                    <li>• <strong>Maximum 10 people</strong> - Intimate group size</li>
                    <li>• <strong>$20 deposit per person</strong> - Required to secure booking</li>
                    <li>• <strong>Free for children 2 and under</strong> - $75 for ages 3-5</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Private boat charter (shared with other guests)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Round-trip boat transportation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Guided island tour</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Frigate Bird Sanctuary visit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Beach time and swimming</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Lunch with special meal options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Snorkeling equipment</span>
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
                      <span>Private boat experience at shared cost</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Small intimate groups (6-10 people max)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Unique meal options: Grilled Chicken, Lobster +$25, Chicken Wings +$20</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Frigate Bird Sanctuary exploration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Pristine beaches and crystal waters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>More flexible schedule than large tours</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Minimum 6 people required for tour to operate</li>
                    <li>• Maximum 10 people for intimate experience</li>
                    <li>• $20 per person deposit required to secure booking</li>
                    <li>• Children 2 and under free, ages 3-5: $75, ages 6-12: $220</li>
                    <li>• Duration: Full day (approximately 7-8 hours)</li>
                    <li>• No passport required (inter-island travel)</li>
                    <li>• Bring sunscreen, towel, and swimwear</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-8 rounded-lg sticky top-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#4DD0E1' }}>
                  $310
                </div>
                <p className="text-gray-600 mb-6">per adult</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Pricing</h3>
                    <p className="text-lg">Adults: $310</p>
                    <p className="text-lg">Children (6-12): $220</p>
                    <p className="text-lg">Ages 3-5: $75</p>
                    <p className="text-sm text-gray-600 italic">2 and under: Free</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Group Size</h3>
                    <p className="text-lg">6-10 people</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">Full Day (7-8 hours)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                    <p className="text-lg">Private Boat</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-cyan-500 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:bg-cyan-600 transition transform hover:scale-105"
                >
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  $20 deposit per person required
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

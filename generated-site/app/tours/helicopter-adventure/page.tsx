'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export default function HelicopterAdventurePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'private-helicopter',
    tourName: 'Barbuda Exclusive: Helicopter Adventure',
    transportMethod: 'helicopter',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 3500,
      child: 3500,
      infant: 1750,
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
        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Barbuda Exclusive: Helicopter Adventure
            </h1>
            <p className="text-2xl text-white">
              The ultimate luxury experience - Your private helicopter charter
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
                  Experience Barbuda like never before with your own private helicopter charter. Soar above the
                  Caribbean in ultimate luxury, customize your itinerary completely, and land directly at the island's
                  most exclusive locations. This is the pinnacle of Barbuda exploration for those who demand the very best.
                </p>

                <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Fully Customizable Experience
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Private Helicopter Charter</strong> - Exclusive to your group</li>
                    <li>• <strong>Custom Itinerary</strong> - Design your perfect day</li>
                    <li>• <strong>Flexible Timing</strong> - Depart and return on your schedule</li>
                    <li>• <strong>Premium Service</strong> - White-glove treatment throughout</li>
                    <li>• <strong>Starting from $3,500</strong> - Contact us for exact pricing</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Private helicopter charter with experienced pilot</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Round-trip helicopter transportation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Aerial tour of Antigua and Barbuda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Private guided island exploration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Exclusive beach access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Gourmet lunch with premium meal options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Premium beverages and champagne</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Personal concierge service</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>All equipment and amenities</span>
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
                      <span>Breathtaking aerial views of the Caribbean</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Land at exclusive, hard-to-reach locations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Completely private and customizable experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Frigate Bird Sanctuary from the air and ground</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Private beach time at pink sand paradise</span>
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
                    <li>• Weight information critical for flight safety</li>
                    <li>• Fully customizable itinerary - tell us your dream day</li>
                    <li>• Pricing based on group size and custom requirements</li>
                    <li>• Minimum 7 days advance booking recommended</li>
                    <li>• Subject to weather conditions</li>
                    <li>• Contact us to design your perfect experience</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#263238' }}>
                    Design Your Dream Experience
                  </h3>
                  <p className="text-gray-700 mb-3">
                    This is a fully customizable private charter. Use the booking form to share your vision, and our
                    team will create a personalized itinerary and provide exact pricing based on your specific requirements.
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Starting from $3,500 - Final price depends on group size, duration, and custom requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg sticky top-4 border border-purple-200">
                <div className="text-sm uppercase text-purple-600 font-bold mb-2">Starting From</div>
                <div className="text-4xl font-bold mb-2" style={{ color: '#9C27B0' }}>
                  $3,500
                </div>
                <p className="text-gray-600 mb-6">fully customizable</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Type</h3>
                    <p className="text-lg">Private Charter</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">Flexible (Custom)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                    <p className="text-lg">Private Helicopter</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Experience</h3>
                    <p className="text-lg">Ultimate Luxury</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
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

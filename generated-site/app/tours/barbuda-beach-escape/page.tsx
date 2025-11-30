'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig, TransportMethod } from '@/app/components/booking/types'

export default function BarbudaBeachEscapePage() {
  const [selectedTransport, setSelectedTransport] = useState<TransportMethod>('air')
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const beachEscapeAirConfig: TourConfig = {
    tourType: 'beach-escape',
    tourName: 'Barbuda Beach Escape (By Air)',
    transportMethod: 'air',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 299,
      child: 299,
      infant: 150,
    },
    mealUpgrades: {
      lobster: 0,
      fish: 0,
      conch: 0,
      shrimp: 0,
      vegetarian: 0,
    },
  }

  const beachEscapeSeaConfig: TourConfig = {
    tourType: 'beach-escape',
    tourName: 'Barbuda Beach Escape (By Ferry)',
    transportMethod: 'sea',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 199,
      child: 199,
      infant: 100,
    },
    mealUpgrades: {
      lobster: 0,
      fish: 0,
      conch: 0,
      shrimp: 0,
      vegetarian: 0,
    },
  }

  const beachEscapeHelicopterConfig: TourConfig = {
    tourType: 'beach-escape',
    tourName: 'Barbuda Beach Escape (By Helicopter)',
    transportMethod: 'helicopter',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 699,
      child: 699,
      infant: 350,
    },
    mealUpgrades: {
      lobster: 0,
      fish: 0,
      conch: 0,
      shrimp: 0,
      vegetarian: 0,
    },
  }

  const beachEscapeBoatConfig: TourConfig = {
    tourType: 'beach-escape',
    tourName: 'Barbuda Beach Escape (By Private Boat)',
    transportMethod: 'private-boat',
    requiresPassport: false,
    requiresBodyWeight: false,
    pricing: {
      adult: 399,
      child: 399,
      infant: 200,
    },
    mealUpgrades: {
      lobster: 0,
      fish: 0,
      conch: 0,
      shrimp: 0,
      vegetarian: 0,
    },
  }

  const getTourConfig = (): TourConfig => {
    switch (selectedTransport) {
      case 'air':
        return beachEscapeAirConfig
      case 'sea':
        return beachEscapeSeaConfig
      case 'helicopter':
        return beachEscapeHelicopterConfig
      case 'private-boat':
        return beachEscapeBoatConfig
      default:
        return beachEscapeAirConfig
    }
  }

  const getPrice = () => {
    const config = getTourConfig()
    return config.pricing.adult
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-cyan-400" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 md:max-w-[1000px]">
            <h1
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Barbuda Beach Escape
            </h1>
            <p className="text-2xl text-white">
              Your way to paradise - Choose your transport!
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
                  Escape to Barbuda's pristine beaches your way! Choose from air, sea, helicopter, or private boat
                  transport to reach one of the Caribbean's most untouched beach paradises. Spend your day relaxing
                  on pink sand beaches, swimming in crystal-clear waters, and experiencing true island serenity.
                </p>

                {/* Transport Selector */}
                <div className="mb-12 bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: '#263238' }}>
                    Choose Your Transport
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedTransport('air')}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedTransport === 'air'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">By Air</div>
                      <div className="text-2xl font-bold text-cyan-500">$299</div>
                      <div className="text-sm text-gray-600">Quick flight, more beach time</div>
                    </button>

                    <button
                      onClick={() => setSelectedTransport('sea')}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedTransport === 'sea'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">By Ferry</div>
                      <div className="text-2xl font-bold text-cyan-500">$199</div>
                      <div className="text-sm text-gray-600">Scenic cruise, best value</div>
                    </button>

                    <button
                      onClick={() => setSelectedTransport('helicopter')}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedTransport === 'helicopter'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">By Helicopter</div>
                      <div className="text-2xl font-bold text-cyan-500">$699</div>
                      <div className="text-sm text-gray-600">Ultimate luxury experience</div>
                    </button>

                    <button
                      onClick={() => setSelectedTransport('private-boat')}
                      className={`p-4 rounded-lg border-2 transition text-left ${
                        selectedTransport === 'private-boat'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">By Private Boat</div>
                      <div className="text-2xl font-bold text-cyan-500">$399</div>
                      <div className="text-sm text-gray-600">Private charter, your pace</div>
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#263238' }}>
                    What's Included
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Round-trip transportation (your selected method)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Full day beach access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Beach chairs and umbrellas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Snorkeling equipment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Refreshments and beverages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">✓</span>
                      <span>Beach guide and assistance</span>
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
                      <span>World-famous pink sand beaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Pristine, uncrowded beach paradise</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Crystal-clear Caribbean waters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Excellent snorkeling opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Flexible transport options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">★</span>
                      <span>Perfect for relaxation and photography</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#263238' }}>
                    Important Information
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Lunch not included - bring your own or purchase on island</li>
                    <li>• Passport required for air and helicopter transport</li>
                    <li>• Bring sunscreen, towel, and swimwear</li>
                    <li>• Duration varies by transport method (4-6 hours)</li>
                    <li>• Minimum 3 days advance booking required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-8 rounded-lg sticky top-4">
                <div className="text-4xl font-bold mb-2" style={{ color: '#4DD0E1' }}>
                  ${getPrice()}
                </div>
                <p className="text-gray-600 mb-6">per person</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Selected Transport</h3>
                    <p className="text-lg capitalize">
                      {selectedTransport === 'private-boat' ? 'Private Boat' : selectedTransport}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                    <p className="text-lg">4-6 hours (varies)</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Difficulty</h3>
                    <p className="text-lg">Very Easy</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 uppercase">Best For</h3>
                    <p className="text-lg">Beach Lovers</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="block w-full bg-cyan-500 text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:bg-cyan-600 transition transform hover:scale-105"
                >
                  Book Now
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Selected transport: {selectedTransport === 'private-boat' ? 'Private Boat' : selectedTransport}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourConfig={getTourConfig()}
      />
    </main>
  )
}

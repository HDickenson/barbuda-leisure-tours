'use client'

import { useState } from 'react'
import { BookingForm } from './BookingForm'
import type { TourConfig } from './types'

/**
 * Example component showing how to use the BookingForm
 * This should be integrated into your actual tour pages
 */
export function ExampleTourPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  // Example: Discover Barbuda by Air tour configuration
  const discoverByAirConfig: TourConfig = {
    tourType: 'discover-air',
    tourName: 'Discover Barbuda by Air',
    transportMethod: 'air',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 349,
      child: 249,
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

  // Example: Discover Barbuda by Sea tour configuration
  const discoverBySeaConfig: TourConfig = {
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

  // Example: Excellence Barbuda by Sea (Friday only, May-October)
  const excellenceConfig: TourConfig = {
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
      daysOfWeek: [5], // Friday only
      seasonStart: new Date('2025-05-01'),
      seasonEnd: new Date('2025-10-31'),
    },
  }

  // Example: Private Helicopter
  const helicopterConfig: TourConfig = {
    tourType: 'private-helicopter',
    tourName: 'Barbuda Exclusive: Helicopter Adventure',
    transportMethod: 'helicopter',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 699,
      child: 699,
      infant: 350,
    },
    mealUpgrades: {
      lobster: 25,
      fish: 15,
      conch: 15,
      shrimp: 15,
      vegetarian: 10,
    },
  }

  const [selectedTour, setSelectedTour] = useState<TourConfig>(discoverByAirConfig)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Barbuda Leisure Day Tours
        </h1>
        <p className="text-lg text-gray-600">
          Select a tour to book your adventure
        </p>
      </div>

      {/* Tour Selection Examples */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Discover by Air Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Discover Barbuda by Air
            </h3>
            <p className="text-gray-600 mb-4">
              Fly to Barbuda in just 20 minutes and explore the island's most iconic sites.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">
                $349 <span className="text-sm text-gray-500 font-normal">per adult</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTour(discoverByAirConfig)
                  setIsBookingOpen(true)
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Discover by Sea Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div className="h-48 bg-gradient-to-br from-teal-400 to-teal-600"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Discover Barbuda by Sea
            </h3>
            <p className="text-gray-600 mb-4">
              Sail across the Caribbean Sea on a scenic 90-minute ferry ride to Barbuda.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-teal-600">
                $249 <span className="text-sm text-gray-500 font-normal">per adult</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTour(discoverBySeaConfig)
                  setIsBookingOpen(true)
                }}
                className="px-6 py-3 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition shadow-md hover:shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Excellence Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Excellence Barbuda by Sea
            </h3>
            <p className="text-gray-600 mb-4">
              Luxury power catamaran experience. Fridays only, May-October.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-600">
                $190 <span className="text-sm text-gray-500 font-normal">per adult</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTour(excellenceConfig)
                  setIsBookingOpen(true)
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition shadow-md hover:shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Helicopter Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
          <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Private Helicopter Adventure
            </h3>
            <p className="text-gray-600 mb-4">
              Exclusive helicopter charter for the ultimate luxury experience.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-amber-600">
                $699 <span className="text-sm text-gray-500 font-normal">per person</span>
              </div>
              <button
                onClick={() => {
                  setSelectedTour(helicopterConfig)
                  setIsBookingOpen(true)
                }}
                className="px-6 py-3 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition shadow-md hover:shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourConfig={selectedTour}
      />
    </div>
  )
}

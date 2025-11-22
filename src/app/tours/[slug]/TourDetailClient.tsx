'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Tour } from '@/data/tours'
import { BookingForm } from '@/components/booking/BookingForm'
import type { TourConfig } from '@/components/booking/types'
import WaveDivider from '@/components/WaveDivider'

interface Props {
  tour: Tour
}

function getTourConfig(tour: Tour): TourConfig {
  const transportMap: Record<string, TourConfig['transportMethod']> = {
    'discover-barbuda-by-air': 'air',
    'discover-barbuda-by-sea': 'sea',
    'barbuda-sky-sea-adventure': 'air',
    'barbuda-beach-escape': 'sea',
    'discover-barbuda-local-tour': 'sea',
    'excellence-barbuda-by-sea': 'sea',
    'shared-barbuda-boat-charter': 'sea',
    'barbuda-exclusive-helicopter': 'helicopter',
    'barbuda-exclusive-yacht': 'yacht',
    'barbuda-exclusive-airplane': 'airplane',
  }

  const tourTypeMap: Record<string, TourConfig['tourType']> = {
    'discover-barbuda-by-air': 'discover-air',
    'discover-barbuda-by-sea': 'discover-sea',
    'barbuda-sky-sea-adventure': 'sky-sea',
    'barbuda-beach-escape': 'beach-escape',
    'discover-barbuda-local-tour': 'already-in-barbuda',
    'excellence-barbuda-by-sea': 'excellence',
    'shared-barbuda-boat-charter': 'shared-boat',
    'barbuda-exclusive-helicopter': 'private-helicopter',
    'barbuda-exclusive-yacht': 'private-yacht',
    'barbuda-exclusive-airplane': 'private-airplane',
  }

  return {
    tourType: tourTypeMap[tour.slug] || 'discover-air',
    tourName: tour.title,
    transportMethod: transportMap[tour.slug] || 'sea',
    requiresPassport: tour.category !== 'local',
    requiresBodyWeight: tour.slug.includes('helicopter') || tour.slug.includes('airplane'),
    tourImage: tour.heroImage,
    pricing: {
      adult: tour.pricing?.adult || 249,
      child: tour.pricing?.child || 199,
      infant: tour.pricing?.infant || 99,
    },
    mealUpgrades: {
      lobster: 15,
      fish: 10,
      conch: 10,
      shrimp: 10,
      vegetarian: 5,
    },
  }
}

export default function TourDetailClient({ tour }: Props) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const tourConfig = getTourConfig(tour)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        {tour.heroImage ? (
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <WaveDivider
          pathD="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          viewBox="0 0 1440 320"
          fillColor="#FFFFFF"
          position="bottom"
          height="100px"
        />
        <div className="absolute bottom-0 left-0 right-0 pb-28">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="inline-block px-3 py-1 bg-turquoise text-white rounded-full text-sm font-semibold mb-4">
              {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)} Tour
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {tour.title}
            </h1>
            {tour.subtitle && (
              <p className="text-xl md:text-2xl text-white/90">
                {tour.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tour Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {tour.description}
                </p>
              </div>

              {/* What's Included */}
              {tour.included && tour.included.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What&apos;s Included</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schedule */}
              {tour.schedule && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule</h2>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    {tour.schedule.departure && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Departure:</span>
                        <span className="font-medium">{tour.schedule.departure}</span>
                      </div>
                    )}
                    {tour.schedule.arrival && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Arrival in Barbuda:</span>
                        <span className="font-medium">{tour.schedule.arrival}</span>
                      </div>
                    )}
                    {tour.schedule.returnDeparture && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Return Departure:</span>
                        <span className="font-medium">{tour.schedule.returnDeparture}</span>
                      </div>
                    )}
                    {tour.schedule.returnArrival && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Return Arrival:</span>
                        <span className="font-medium">{tour.schedule.returnArrival}</span>
                      </div>
                    )}
                    {tour.schedule.checkInTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Check-in:</span>
                        <span className="font-medium">{tour.schedule.checkInTime}</span>
                      </div>
                    )}
                    {tour.schedule.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{tour.schedule.location}</span>
                      </div>
                    )}
                    {tour.schedule.notes && (
                      <p className="text-sm text-gray-500 pt-2 border-t">{tour.schedule.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* What to Bring */}
              {tour.whatToBring && tour.whatToBring.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What to Bring</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tour.whatToBring.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Info */}
              {tour.importantInfo && tour.importantInfo.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Information</h2>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <ul className="space-y-2">
                      {tour.importantInfo.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-2">⚠</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-xl sticky top-4 shadow-lg">
                <div className="text-3xl font-bold text-turquoise mb-1">
                  {tour.price}
                </div>
                {tour.pricing?.notes && (
                  <p className="text-sm text-gray-500 mb-4">{tour.pricing.notes}</p>
                )}

                <div className="space-y-4 mb-6 border-t border-gray-200 pt-4">
                  <div>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Duration</h3>
                    <p className="text-gray-800">{tour.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Group Size</h3>
                    <p className="text-gray-800">{tour.groupSize}</p>
                  </div>
                  {tour.minimumGuests && (
                    <div>
                      <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Minimum Guests</h3>
                      <p className="text-gray-800">{tour.minimumGuests} people</p>
                    </div>
                  )}
                </div>

                {/* Lunch Upgrades */}
                {tour.lunchUpgrades && tour.lunchUpgrades.length > 0 && (
                  <div className="mb-6 border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-2">Lunch Upgrades</h3>
                    <ul className="space-y-1 text-sm">
                      {tour.lunchUpgrades.map((upgrade, index) => (
                        <li key={index} className="flex justify-between text-gray-600">
                          <span>{upgrade.name}</span>
                          <span className="font-medium">+${upgrade.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-turquoise text-white text-center px-6 py-4 rounded-full text-lg font-bold hover:bg-turquoise-hover transition transform hover:scale-105 shadow-lg"
                >
                  Book This Tour
                </button>

                <p className="text-center text-sm text-gray-500 mt-3">
                  Free cancellation up to 48 hours before
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {tour.gallery && tour.gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tour.gallery.map((image, index) => (
                <div key={index} className="relative h-64 overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`${tour.title} gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Tours */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/our-tours"
            className="inline-flex items-center gap-2 text-turquoise hover:text-turquoise-hover font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Tours
          </Link>
        </div>
      </section>

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourConfig={tourConfig}
      />
    </main>
  )
}

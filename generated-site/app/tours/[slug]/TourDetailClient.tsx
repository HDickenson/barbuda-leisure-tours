'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BookingForm } from '@/app/components/booking/BookingForm'
import { Reveal } from '@/app/components/Reveal'
import type { TourConfig } from '@/app/components/booking/types'
import type { Tour } from '@/data/tours-converted'

interface Props {
  tour: Tour
}

export function TourDetailClient({ tour }: Props) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  // Map tour slug to booking tour type
  const getTourType = (slug: string): TourConfig['tourType'] => {
    const tourTypeMap: Record<string, TourConfig['tourType']> = {
      'discover-barbuda-by-air': 'discover-air',
      'discover-barbuda-by-sea': 'discover-sea',
      'barbuda-sky-sea-adventure': 'sky-sea',
      'barbuda-beach-escape': 'beach-escape',
      'already-in-barbuda': 'already-in-barbuda',
      'excellence-barbuda-by-sea': 'excellence',
      'shared-boat-charter': 'shared-boat',
      'helicopter-adventure': 'private-helicopter',
      'yacht-adventure': 'private-yacht',
      'airplane-adventure': 'private-airplane',
    }
    return tourTypeMap[slug] || 'discover-air'
  }

  // Map tour data to booking config
  const defaultMealUpgrades = {
    lobster: 15,
    fish: 10,
    conch: 10,
    shrimp: 10,
    vegetarian: 5,
  }

  const tourConfig: TourConfig = {
    tourType: getTourType(tour.slug),
    tourName: tour.title,
    transportMethod: tour.transport.toLowerCase().includes('air') || tour.transport.toLowerCase().includes('aircraft')
      ? 'air'
      : tour.transport.toLowerCase().includes('sea') || tour.transport.toLowerCase().includes('ferry') || tour.transport.toLowerCase().includes('catamaran')
        ? 'sea'
        : tour.transport.toLowerCase().includes('helicopter')
          ? 'helicopter'
          : tour.transport.toLowerCase().includes('yacht')
            ? 'yacht'
            : tour.transport.toLowerCase().includes('airplane')
              ? 'airplane'
              : 'private-boat',
    requiresPassport: tour.requiresPassport || false,
    requiresBodyWeight: tour.requiresBodyWeight || false,
    pricing: {
      adult: tour.priceDetails.adult,
      child: tour.priceDetails.child,
      infant: tour.priceDetails.infant || 0,
    },
    mealUpgrades: {
      lobster: tour.mealUpgrades?.lobster ?? defaultMealUpgrades.lobster,
      fish: tour.mealUpgrades?.fish ?? defaultMealUpgrades.fish,
      conch: tour.mealUpgrades?.conch ?? defaultMealUpgrades.conch,
      shrimp: tour.mealUpgrades?.shrimp ?? defaultMealUpgrades.shrimp,
      vegetarian: tour.mealUpgrades?.vegetarian ?? defaultMealUpgrades.vegetarian,
    },
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image src={tour.heroImage} alt={tour.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-4">
          <div className="max-w-6xl mx-auto w-full">
            {/* Category & Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#4DD0E1] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg capitalize">
                {tour.category} Tour
              </span>
              {tour.badge && (
                <span className="bg-[#FF6B9D] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {tour.badge}
                </span>
              )}
            </div>

            <h1
              className="text-5xl md:text-7xl text-white mb-4 drop-shadow-2xl"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              {tour.title}
            </h1>
            <p className="text-2xl md:text-3xl text-[#FF6B9D] mb-6">{tour.subtitle}</p>
            <p className="text-xl md:text-2xl text-white/95 font-light max-w-4xl">
              {tour.description}
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(249, 250, 251)"
            />
          </svg>
        </div>
      </div>

      {/* Tour Details */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] text-white p-6 rounded-2xl text-center shadow-lg">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm font-semibold">{tour.duration}</div>
                </div>

                <div className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5789] text-white p-6 rounded-2xl text-center shadow-lg">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm font-semibold">{tour.price}</div>
                </div>

                <div className="bg-gradient-to-br from-[#26C6DA] to-[#00ACC1] text-white p-6 rounded-2xl text-center shadow-lg">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <div className="text-sm font-semibold">{tour.transport}</div>
                </div>

                <div className="bg-gradient-to-br from-[#263238] to-[#37474F] text-white p-6 rounded-2xl text-center shadow-lg">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm font-semibold">{tour.difficulty}</div>
                </div>
              </div>

              {/* Highlights */}
              <Reveal className="mb-12">
                <h2 className="text-4xl text-[#263238] mb-6">Tour Highlights</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#4DD0E1] rounded-full flex items-center justify-center mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg">{highlight}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* What's Included */}
              <Reveal className="mb-12" delayMs={75}>
                <h2 className="text-4xl text-[#263238] mb-6">What's Included</h2>
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    {tour.included.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-[#4DD0E1] flex-shrink-0 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Important Information */}
              <Reveal className="bg-blue-50 p-8 rounded-2xl border-l-4 border-[#4DD0E1]" delayMs={150}>
                <h3 className="text-2xl font-bold text-[#263238] mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#4DD0E1]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Important Information
                </h3>
                <ul className="space-y-2">
                  {tour.importantInfo.map((info) => (
                    <li key={info} className="text-gray-700 flex items-start gap-2">
                      <span className="text-[#4DD0E1] mt-1">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] p-6 text-white">
                    <div className="text-5xl font-bold mb-2">{tour.price}</div>
                    <p className="text-white/90">per adult</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Pricing Breakdown */}
                    <div>
                      <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">Pricing</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Adults</span>
                          <span className="font-bold text-[#263238]">
                            ${tour.priceDetails.adult}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Children</span>
                          <span className="font-bold text-[#263238]">
                            ${tour.priceDetails.child}
                          </span>
                        </div>
                        {tour.priceDetails.infant && tour.priceDetails.infant > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-700">Infants</span>
                            <span className="font-bold text-[#263238]">
                              ${tour.priceDetails.infant}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Details */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 uppercase">Duration</h3>
                        <p className="text-lg text-[#263238]">{tour.duration}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 uppercase">Transport</h3>
                        <p className="text-lg text-[#263238]">{tour.transport}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-500 uppercase">Difficulty</h3>
                        <p className="text-lg text-[#263238]">{tour.difficulty}</p>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-4">
                      <button
                        onClick={() => setIsBookingOpen(true)}
                        className="w-full bg-[#4DD0E1] hover:bg-[#26C6DA] text-white font-bold py-4 px-6 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
                      >
                        Book This Tour
                      </button>
                      <Link
                        href="/contact"
                        className="block w-full bg-white hover:bg-gray-50 border-2 border-[#4DD0E1] text-[#4DD0E1] font-bold py-4 px-6 rounded-full text-lg text-center transition-all hover:scale-105"
                      >
                        Ask a Question
                      </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Free cancellation up to 24 hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Pink-Beach-North-scaled.jpg"
            alt="Book Your Adventure"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D]/95 to-[#FF5789]/95"></div>
        </div>

        <div className="relative z-10 py-24 text-center text-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Explore More Tours
            </h2>
            <p className="text-2xl mb-10 font-light">
              Discover all the amazing ways to experience Barbuda
            </p>
            <Link
              href="/tours"
              className="inline-block bg-white text-[#FF6B9D] hover:bg-gray-100 font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-2xl"
            >
              View All Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourConfig={tourConfig}
      />
    </main>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Tour } from '@/data/tours'
import { getAllTours } from '@/data/tours'
import { BookingForm } from '@/components/booking/BookingForm'
import type { TourConfig } from '@/components/booking/types'
import BackgroundSlideshow from '@/components/BackgroundSlideshow'
import WaveDivider from '@/components/WaveDivider'
import heroWave from '@/components/heroWavePaths'

interface Props {
  tour: Tour
}

function getTourConfig(tour: Tour): TourConfig {
  // Helper for backward compatibility - derives tourType from slug if not specified in tour data
  const deriveTourTypeFromSlug = (slug: string): TourConfig['tourType'] => {
    const map: Record<string, TourConfig['tourType']> = {
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
    return map[slug] || 'discover-air'
  }

  // Helper to parse season dates - supports both 'MM-DD' and ISO date strings
  const parseSeasonDate = (dateStr?: string): Date | undefined => {
    if (!dateStr) return undefined
    if (dateStr.match(/^\d{2}-\d{2}$/)) {
      // MM-DD format - use current year for recurring seasonal dates
      const [month, day] = dateStr.split('-')
      const year = new Date().getFullYear()
      return new Date(year, parseInt(month) - 1, parseInt(day))
    }
    return new Date(dateStr)
  }

  // Default meal upgrades - can be overridden by tour-specific pricing
  const defaultMealUpgrades = {
    lobster: 15,
    fish: 10,
    conch: 10,
    shrimp: 10,
    vegetarian: 5,
  }

  return {
    tourType: tour.tourType || deriveTourTypeFromSlug(tour.slug),
    tourName: tour.title,
    transportMethod: tour.transportMethod || 'sea',
    requiresPassport: tour.transportRequirements?.requiresPassport ?? (tour.category !== 'local'),
    requiresBodyWeight: tour.transportRequirements?.requiresBodyWeight ?? false,
    tourImage: tour.heroImage,
    pricing: {
      adult: tour.pricing?.adult || 249,
      child: tour.pricing?.child || 199,
      infant: tour.pricing?.infant || 99,
    },
    mealUpgrades: {
      ...defaultMealUpgrades,
      ...tour.mealUpgradePricing,  // Override with tour-specific pricing
    },
    restrictions: tour.bookingRestrictions ? {
      minAge: tour.bookingRestrictions.minAge,
      daysOfWeek: tour.bookingRestrictions.daysOfWeek,
      seasonStart: parseSeasonDate(tour.bookingRestrictions.seasonStart),
      seasonEnd: parseSeasonDate(tour.bookingRestrictions.seasonEnd),
    } : undefined,
  }
}

export default function TourDetailClient({ tour }: Props) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const tourConfig = getTourConfig(tour)

  // Get other tours for recommendations (exclude current tour)
  const allTours = getAllTours()
  const otherTours = allTours
    .filter(t => t.slug !== tour.slug)
    .slice(0, 3) // Show up to 3 related tours

  // Hero carousel slides - using tour-specific images or fallback to generic Barbuda images
  const heroSlides = [
    { id: 0, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/11/DSC3121-scaled.jpg', alt: 'Barbuda scenic view 1' },
    { id: 1, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/10/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp', alt: 'Catamaran on beach' },
    { id: 2, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/10/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp', alt: 'Frigate birds' },
    { id: 3, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/10/Horses-swim-too-and-they-particularly-love-Barbudas-beaches-scaled.webp', alt: 'Horses on beach' },
    { id: 4, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/10/IMG_6031-scaled.webp', alt: 'Barbuda coastal view' },
    { id: 5, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/10/BarbudaLeisureTours-7-2.jpg', alt: 'Barbuda leisure tour' },
    { id: 6, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/11/Allesandra-scaled.jpg', alt: 'Beach landscape' },
    { id: 7, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/11/yellow-brest.jpg', alt: 'Yellow breast bird' },
    { id: 8, image: 'https://www.barbudaleisure.com/wp-content/uploads/2024/11/Pink-Beach-North-scaled.jpg', alt: 'Pink sand beach' }
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section with Background Slideshow */}
      <div className="relative">
        <div className="relative h-[500px]">
          <BackgroundSlideshow
            slides={heroSlides}
            height="500px"
            overlayOpacity={0.4}
          />

          {/* Title Overlay - positioned over slideshow */}
          <div className="absolute bottom-0 left-0 right-0 pb-28 z-10">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="inline-block px-3 py-1 bg-turquoise text-white rounded-full text-sm font-semibold mb-4">
                {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)} Tour
              </div>
              <h1 className="font-['Leckerli_One'] text-[50px] md:text-[80px] font-light text-[rgb(48,187,216)] leading-tight md:leading-[80px] mb-4">
                {tour.title}
              </h1>
              {tour.subtitle && (
                <p className="font-['Lexend_Deca'] text-xl md:text-2xl text-white/90">
                  {tour.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <WaveDivider
          {...heroWave}
          viewBox={heroWave.viewBox}
          paths={heroWave.paths}
          fillColor="#FFFFFF"
          position="bottom"
          height="120px"
        />
      </div>

      {/* Tour Details (wrapped in page-content to match live DOM ordering) */}
      <div className="page-content">
        <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Tour</h2>
                <p className="font-['Roboto'] text-[18px] font-semibold text-[rgb(122,122,122)] leading-[27px]">
                  {tour.description}
                </p>
              </div>

              {/* What's Included */}
              {tour.included && tour.included.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What&apos;s Included</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-center mx-2">
                        <span className="text-[rgb(48,187,216)]">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                          </svg>
                        </span>
                        <span className="font-['Roboto'] text-[16px] text-[rgb(84,89,95)] pl-[5px]">{item}</span>
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
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    {tour.whatToBring.map((item, index) => (
                      <li key={index} className="flex items-center mx-2">
                        <span className="text-[rgb(48,187,216)]">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                          </svg>
                        </span>
                        <span className="font-['Roboto'] text-[16px] text-[rgb(84,89,95)] pl-[5px]">{item}</span>
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
                <div className="font-['Open_Sans'] text-[24px] font-bold text-[rgb(48,187,216)] mb-1">
                  {tour.price}
                </div>

                <div className="space-y-4 mb-6 border-t border-gray-200 pt-4">
                  <div>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Duration</h3>
                    <p className="text-gray-800">{tour.duration}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-[rgb(245,182,211)] text-white text-center px-[28px] py-[17px] rounded-[8px] text-[14px] font-medium font-['Roboto'] hover:bg-[rgb(235,172,201)] transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  REQUEST BOOKING
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Montage */}
      {tour.gallery && tour.gallery.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
              Photo Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tour.gallery.map((image, index) => {
                // Create varied heights for visual interest
                const isLarge = index % 5 === 0 || index % 7 === 0;
                const isMedium = index % 3 === 0 && !isLarge;

                // Stagger animation delays
                const animationDelay = `${index * 0.08}s`;

                let className = "relative overflow-hidden rounded-lg group cursor-pointer opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]";
                if (isLarge) {
                  className += " md:col-span-2 md:row-span-2 h-[400px]";
                } else if (isMedium) {
                  className += " md:row-span-2 h-[400px]";
                } else {
                  className += " h-[195px]";
                }

                return (
                  <div
                    key={index}
                    className={className}
                    style={{ animationDelay }}
                  >
                    <Image
                      src={image}
                      alt={`${tour.title} gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                );
              })}
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

      </div>

      {/* Other Tours Section */}
      {otherTours.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Other Tours</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherTours.map((relatedTour, index) => (
                <Link
                  key={index}
                  href={`/tours/${relatedTour.slug}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {relatedTour.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedTour.heroImage}
                        alt={relatedTour.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-turquoise transition-colors">
                      {relatedTour.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{relatedTour.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-turquoise">{relatedTour.price}</span>
                      <span className="text-sm text-gray-500">{relatedTour.duration}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section - "Make an Enquiry" */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Make an Enquiry</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="enquiry-firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    id="enquiry-firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="enquiry-lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    id="enquiry-lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="enquiry-email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  id="enquiry-email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="enquiry-subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="enquiry-subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="enquiry-message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[rgb(245,182,211)] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[rgb(235,172,201)] transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Form Section - "Get In Touch" */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get In Touch</h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    id="contact-firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    id="contact-lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent bg-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-turquoise focus:border-transparent bg-white"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[rgb(245,182,211)] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[rgb(235,172,201)] transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
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

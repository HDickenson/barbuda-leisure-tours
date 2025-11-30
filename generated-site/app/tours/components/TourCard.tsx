'use client'

import Image from 'next/image'
import Link from 'next/link'

interface DisplayTour {
  slug: string
  title: string
  subtitle: string
  description: string
  image: string
  price: string
  duration: string
  transport: string
  category: 'signature' | 'local' | 'shared' | 'private'
  highlights: string[]
  badge?: string
}

export function TourCard({ tour }: { tour: DisplayTour }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge */}
          {tour.badge && (
            <span className="absolute top-4 left-4 bg-[#FF6B9D] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {tour.badge}
            </span>
          )}

          {/* Price Badge */}
          <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#263238] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {tour.price}
          </span>

          {/* Transport Badge */}
          <span className="absolute bottom-4 left-4 bg-[#4DD0E1]/95 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            {tour.transport}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-[#263238] mb-1 group-hover:text-[#4DD0E1] transition-colors line-clamp-2">
              {tour.title}
            </h3>
            <p className="text-[#FF6B9D] font-semibold text-sm uppercase tracking-wide">
              {tour.subtitle}
            </p>
          </div>

          <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
            {tour.description}
          </p>

          {/* Highlights */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tour.highlights.slice(0, 4).map((highlight) => (
                <span
                  key={highlight}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tour.duration}
            </div>
            <div className="text-[#4DD0E1] font-bold text-sm group-hover:translate-x-2 transition-transform flex items-center gap-1">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

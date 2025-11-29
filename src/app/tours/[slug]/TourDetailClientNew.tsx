'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
export interface Tour {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  duration: string;
  price: string;
  groupSize: string;
  included: string[];
  gallery?: string[];
  montageImages?: string[];
  montageLayout?: string;
}
import Montage from '@/components/Montage'
import ReactMarkdown from 'react-markdown'

interface Props {
  tour: Tour
}

export default function TourDetailClient({ tour }: Props) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Montage Section - Disabled for local data */}
      {/* {tour.montageImages && tour.montageImages.length > 0 && (
        <Montage
          images={tour.montageImages}
          layout={tour.montageLayout || 'auto'}
        />
      )} */}

      {/* Content Container */}
      <div className="container mx-auto px-4 max-w-5xl py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-turquoise text-white rounded-full text-sm font-semibold">
            {tour.category}
          </span>
        </div>

        {/* Tour Sections - Render verbatim content from Sanity */}
        <div className="prose prose-lg max-w-none">
          {tour.sections.map((section, index) => (
            <div key={index} className="mb-8">
              {/* Render heading as markdown */}
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="font-['Leckerli_One'] text-[50px] md:text-[80px] font-light text-[rgb(48,187,216)] leading-tight md:leading-[80px] mb-6" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-8" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-6" {...props} />
                  ),
                }}
              >
                {section.heading}
              </ReactMarkdown>

              {/* Render body as markdown */}
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="font-['Roboto'] text-[18px] text-[rgb(122,122,122)] leading-[27px] mb-4" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-none space-y-2 mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="flex items-start" {...props}>
                      <span className="text-[rgb(48,187,216)] mr-2">✓</span>
                      <span className="font-['Roboto'] text-[16px] text-[rgb(84,89,95)]">{props.children}</span>
                    </li>
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-gray-900" {...props} />
                  ),
                }}
              >
                {section.body}
              </ReactMarkdown>
            </div>
          ))}
        </div>

        {/* Booking CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-[rgb(245,182,211)] text-white text-center px-[28px] py-[17px] rounded-[8px] text-[14px] font-medium font-['Roboto'] hover:bg-[rgb(235,172,201)] transition transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            REQUEST BOOKING
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Back to Tours */}
        <div className="mt-12 text-center">
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
      </div>

      {/* Booking Modal - Placeholder for now */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Request Booking</h2>
            <p className="text-gray-600 mb-6">
              Contact us to book "{tour.title}"
            </p>
            <button
              onClick={() => setIsBookingOpen(false)}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

'use client'

import { Reveal } from '@/app/components/Reveal'
import { TourCard } from './TourCard'

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

export function CategorySection({
  title,
  description,
  tours,
  icon
}: {
  title: string
  description: string
  tours: DisplayTour[]
  icon: React.ReactNode
}) {
  if (tours.length === 0) return null

  return (
    <section className="mb-24">
      <Reveal className="mb-12 text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-5xl font-bold text-[#263238] mb-4" style={{ fontFamily: "'Leckerli One', cursive" }}>
          {title}
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
      </Reveal>

      <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {tours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </Reveal>
    </section>
  )
}

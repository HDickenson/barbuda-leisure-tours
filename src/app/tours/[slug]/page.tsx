import { notFound } from 'next/navigation'
import { getAllTours, getTourBySlug } from '@/data/tours'
import TourDetailClient from './TourDetailClient'

interface Props {
  params: { slug: string }
}

export default function TourDetailPage({ params }: Props) {
  const tour = getTourBySlug(params.slug)

  if (!tour) {
    notFound()
  }

  return <TourDetailClient tour={tour} />
}

export function generateStaticParams() {
  const tours = getAllTours()
  return tours.map((tour) => ({ slug: tour.slug }))
}

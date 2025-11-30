import { notFound } from 'next/navigation'
import { getTourBySlug, getAllTours } from '@/data/tours'
import TourDetailClient from './TourDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tours = getAllTours()
  return tours.map((tour) => ({
    slug: tour.slug,
  }))
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params
  const tour = getTourBySlug(slug)

  if (!tour) {
    notFound()
  }

  return <TourDetailClient tour={tour} />
}

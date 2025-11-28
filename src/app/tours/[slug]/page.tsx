import { notFound } from 'next/navigation'
import { getTourBySlug } from '@/lib/sanity/queries/tours'
import TourDetailClient from './TourDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

// Enable ISR - revalidate every hour
export const revalidate = 3600

// Use dynamic rendering - pages generated on-demand
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params
  const tour = await getTourBySlug(slug)

  if (!tour) {
    notFound()
  }

  return <TourDetailClient tour={tour} />
}

import { client } from '../client'
import { getImageUrl } from '../image'
import type { Tour } from '@/data/tours'

// GROQ query to fetch all tours with populated image URLs
const toursQuery = `*[_type == "tour"] | order(title asc) {
  "slug": slug.current,
  title,
  subtitle,
  description,
  "heroImage": heroImage.asset->url,
  duration,
  price,
  groupSize,
  difficulty,
  included,
  highlights,
  "gallery": gallery[].asset->url,
  featured,
  category,
  pricing,
  schedule,
  lunchUpgrades,
  whatToBring,
  importantInfo,
  ageRestrictions,
  transportDetails,
  partnerOperated,
  partnerName,
  minimumGuests,
  transportMethod,
  tourType,
  transportRequirements,
  bookingRestrictions,
  mealUpgradePricing
}`

// Fetch a single tour by slug
const tourBySlugQuery = `*[_type == "tour" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  subtitle,
  description,
  "heroImage": heroImage.asset->url,
  duration,
  price,
  groupSize,
  difficulty,
  included,
  highlights,
  "gallery": gallery[].asset->url,
  featured,
  category,
  pricing,
  schedule,
  lunchUpgrades,
  whatToBring,
  importantInfo,
  ageRestrictions,
  transportDetails,
  partnerOperated,
  partnerName,
  minimumGuests,
  transportMethod,
  tourType,
  transportRequirements,
  bookingRestrictions,
  mealUpgradePricing
}`

// Fetch all tours
export async function getAllTours(): Promise<Tour[]> {
  const tours = await client.fetch<Tour[]>(toursQuery, {}, {
    // Enable ISR - revalidate every hour
    next: { revalidate: 3600 }
  })

  return tours
}

// Fetch tours by category
export async function getToursByCategory(category: Tour['category']): Promise<Tour[]> {
  const tours = await getAllTours()
  return tours.filter(tour => tour.category === category)
}

// Fetch a single tour by slug
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const tour = await client.fetch<Tour | null>(
    tourBySlugQuery,
    { slug },
    {
      // Enable ISR - revalidate every hour
      next: { revalidate: 3600 }
    }
  )

  return tour
}

// Fetch featured tours
export async function getFeaturedTours(): Promise<Tour[]> {
  const tours = await getAllTours()
  return tours.filter(tour => tour.featured)
}

// Get tour slugs for static generation
export async function getAllTourSlugs(): Promise<string[]> {
  const slugs = await client.fetch<string[]>(
    `*[_type == "tour"].slug.current`,
    {},
    {
      // Cache for build time
      next: { revalidate: false }
    }
  )

  return slugs
}

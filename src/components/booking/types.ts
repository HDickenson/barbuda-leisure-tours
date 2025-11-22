export type TransportMethod = 'air' | 'sea' | 'helicopter' | 'private-boat' | 'yacht' | 'airplane'

export type TourType =
  | 'discover-air'
  | 'discover-sea'
  | 'sky-sea'
  | 'beach-escape'
  | 'already-in-barbuda'
  | 'excellence'
  | 'shared-boat'
  | 'private-helicopter'
  | 'private-yacht'
  | 'private-airplane'

export interface TourConfig {
  tourType: TourType
  tourName: string
  transportMethod: TransportMethod
  requiresPassport: boolean
  requiresBodyWeight: boolean
  tourImage?: string // Optional: Main tour image URL to display in summary
  pricing: {
    adult: number
    child: number
    infant: number
  }
  mealUpgrades: {
    lobster: number
    fish: number
    conch: number
    shrimp: number
    vegetarian: number
  }
  restrictions?: {
    minAge?: number
    daysOfWeek?: number[] // 0 = Sunday, 5 = Friday
    seasonStart?: Date
    seasonEnd?: Date
  }
}

export interface PartySize {
  adults: number
  children: number
  infants: number
}

export interface PassengerDetails {
  id: string
  ageGroup: 'adult' | 'child' | 'infant'
  firstName: string
  lastName: string
  gender?: 'Male' | 'Female' | 'Other'
  dateOfBirth?: Date
  bodyWeight?: number
  passportNumber?: string
  passportExpiry?: Date
  passportCountry?: string
  nationality?: string
  mealPreference: MealPreference
}

export type MealPreference = 'bbq-chicken' | 'lobster' | 'fish' | 'conch' | 'shrimp' | 'vegetarian'

export interface ContactInfo {
  email: string
  phone: string
  hotel: string
  specialRequests: string
}

export interface TermsAgreement {
  terms: boolean
  cancellation: boolean
  liability: boolean
}

export interface BookingFormData {
  partySize: PartySize
  tourDate?: Date
  passengers: PassengerDetails[]
  contactInfo: ContactInfo
  agreedToTerms: TermsAgreement
}

export interface MealOption {
  value: MealPreference
  label: string
  price: number
}

export const MEAL_OPTIONS: MealOption[] = [
  { value: 'bbq-chicken', label: 'BBQ Chicken - Included', price: 0 },
  { value: 'lobster', label: 'Lobster - $15', price: 15 },
  { value: 'fish', label: 'Fish - $10', price: 10 },
  { value: 'conch', label: 'Conch - $10', price: 10 },
  { value: 'shrimp', label: 'Shrimp - $10', price: 10 },
  { value: 'vegetarian', label: 'Vegetarian - $5', price: 5 },
]

export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Antigua and Barbuda',
  'Australia',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Ireland',
  'New Zealand',
  'Japan',
  'Brazil',
  'Mexico',
  'Argentina',
  'Colombia',
  // Add more as needed
]

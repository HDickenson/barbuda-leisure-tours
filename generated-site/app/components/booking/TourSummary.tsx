'use client'

import type { BookingFormData, TourConfig } from './types'
import { MEAL_OPTIONS } from './types'

interface TourSummaryProps {
  tourConfig: TourConfig
  formData: BookingFormData
  currentStep: number
}

export function TourSummary({ tourConfig, formData, currentStep }: TourSummaryProps) {
  const calculatePricing = () => {
    const basePrice =
      (formData.partySize.adults * tourConfig.pricing.adult) +
      (formData.partySize.children * tourConfig.pricing.child) +
      (formData.partySize.infants * tourConfig.pricing.infant)

    const mealUpgrades = formData.passengers.reduce((total, passenger) => {
      const mealOption = MEAL_OPTIONS.find((opt) => opt.value === passenger.mealPreference)
      return total + (mealOption?.price || 0)
    }, 0)

    return { basePrice, mealUpgrades, total: basePrice + mealUpgrades }
  }

  const pricing = calculatePricing()

  const formatDate = (date?: Date) => {
    if (!date) return 'Not selected yet'
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const totalPassengers = formData.partySize.adults + formData.partySize.children + formData.partySize.infants

  return (
    <div className="space-y-4 sticky top-4">
      {/* Header */}
      <div className="bg-blue-600 text-white rounded-lg p-4">
        <h3 className="font-bold text-lg mb-1">TOUR SUMMARY</h3>
      </div>

      {/* Tour Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
        <div>
          <p className="text-xs text-gray-500">Tour</p>
          <p className="font-semibold text-gray-900">{tourConfig.tourName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="font-medium text-gray-900">{formatDate(formData.tourDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Transport</p>
          <p className="font-medium text-gray-900 capitalize">{tourConfig.transportMethod}</p>
        </div>
        {totalPassengers > 0 && (
          <div>
            <p className="text-xs text-gray-500">Party Size</p>
            <p className="font-medium text-gray-900">
              {formData.partySize.adults > 0 && `${formData.partySize.adults} Adult${formData.partySize.adults !== 1 ? 's' : ''}`}
              {formData.partySize.children > 0 && `, ${formData.partySize.children} Child${formData.partySize.children !== 1 ? 'ren' : ''}`}
              {formData.partySize.infants > 0 && `, ${formData.partySize.infants} Infant${formData.partySize.infants !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}
      </div>

      {/* Step-specific content */}
      {currentStep === 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-3">What's Included:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {tourConfig.transportMethod === 'air' ? 'Round-trip flights' : 'Round-trip ferry'}
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Airport/dock transfers
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Guided island tour
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Frigate Bird Sanctuary
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Princess Diana Beach
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              BBQ Chicken Lunch
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Bottled water
            </li>
          </ul>
        </div>
      )}

      {/* Passenger Progress (Step 2) */}
      {currentStep === 2 && formData.passengers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-3">Passengers ({formData.passengers.length})</h4>
          <div className="space-y-2">
            {formData.passengers.map((passenger, index) => (
              <div key={passenger.id} className="flex items-center text-sm">
                {passenger.firstName && passenger.lastName ? (
                  <>
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-900">Passenger {index + 1}: {passenger.firstName} {passenger.lastName}</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-500">Passenger {index + 1}: Pending</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info (Step 3+) */}
      {currentStep >= 3 && formData.contactInfo.email && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-3">Contact</h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>{formData.contactInfo.email}</p>
            <p>{formData.contactInfo.phone}</p>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-3">PRICE BREAKDOWN</h4>
        <div className="space-y-2 text-sm">
          {formData.partySize.adults > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Adults ({formData.partySize.adults}) × ${tourConfig.pricing.adult}</span>
              <span className="font-medium">${(formData.partySize.adults * tourConfig.pricing.adult).toFixed(2)}</span>
            </div>
          )}
          {formData.partySize.children > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Children ({formData.partySize.children}) × ${tourConfig.pricing.child}</span>
              <span className="font-medium">${(formData.partySize.children * tourConfig.pricing.child).toFixed(2)}</span>
            </div>
          )}
          {formData.partySize.infants > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Infants ({formData.partySize.infants}) × ${tourConfig.pricing.infant}</span>
              <span className="font-medium">${(formData.partySize.infants * tourConfig.pricing.infant).toFixed(2)}</span>
            </div>
          )}

          {pricing.mealUpgrades > 0 && (
            <>
              <div className="border-t border-blue-300 pt-2 mt-2">
                <div className="flex justify-between text-gray-700">
                  <span>Meal Upgrades</span>
                  <span className="font-medium">${pricing.mealUpgrades.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          <div className="border-t-2 border-blue-400 pt-3 mt-3">
            <div className="flex justify-between text-base font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-700">${pricing.total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {currentStep < 2 && formData.partySize.adults + formData.partySize.children + formData.partySize.infants > 0 && (
          <p className="text-xs text-gray-600 mt-3">
            Meal upgrades will be added in the next step
          </p>
        )}

        {currentStep >= 4 && (
          <p className="text-xs text-gray-600 mt-3">
            💳 Payment will be collected after your booking is confirmed
          </p>
        )}
      </div>

      {/* Info Boxes */}
      {currentStep === 5 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start text-sm">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-yellow-900">
              <p className="font-semibold">Important</p>
              <p className="mt-1">You must accept all terms to proceed with your booking request.</p>
            </div>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="font-semibold text-green-900">Booking Submitted!</p>
            <p className="text-sm text-green-700 mt-1">Check your email for confirmation</p>
          </div>
        </div>
      )}
    </div>
  )
}

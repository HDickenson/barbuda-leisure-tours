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
      formData.partySize.adults * tourConfig.pricing.adult +
      formData.partySize.children * tourConfig.pricing.child +
      formData.partySize.infants * tourConfig.pricing.infant

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

  const totalPassengers =
    formData.partySize.adults + formData.partySize.children + formData.partySize.infants

  return (
    <div className="space-y-6 sticky top-4">
      {/* Tour Image */}
      {tourConfig.tourImage && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={tourConfig.tourImage}
            alt={tourConfig.tourName}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Tour Details - Clean, No Boxes */}
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Tour</p>
          <p className="text-base font-semibold text-gray-900">{tourConfig.tourName}</p>
        </div>

        <div className="h-px bg-gray-200"></div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Date</p>
          <p className="text-sm text-gray-900">{formatDate(formData.tourDate)}</p>
        </div>

        {totalPassengers > 0 && (
          <>
            <div className="h-px bg-gray-200"></div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Party Size</p>
              <p className="text-sm text-gray-900">
                {formData.partySize.adults > 0 &&
                  `${formData.partySize.adults} Adult${formData.partySize.adults !== 1 ? 's' : ''}`}
                {formData.partySize.children > 0 &&
                  `, ${formData.partySize.children} Child${formData.partySize.children !== 1 ? 'ren' : ''}`}
                {formData.partySize.infants > 0 &&
                  `, ${formData.partySize.infants} Infant${formData.partySize.infants !== 1 ? 's' : ''}`}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Price Breakdown - Clean Design */}
      <div className="pt-4 border-t-2 border-gray-200">
        <div className="space-y-3 text-sm">
          {formData.partySize.adults > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Adults ({formData.partySize.adults}) × ${tourConfig.pricing.adult}</span>
              <span className="font-medium text-gray-900">
                ${(formData.partySize.adults * tourConfig.pricing.adult).toFixed(2)}
              </span>
            </div>
          )}
          {formData.partySize.children > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Children ({formData.partySize.children}) × ${tourConfig.pricing.child}</span>
              <span className="font-medium text-gray-900">
                ${(formData.partySize.children * tourConfig.pricing.child).toFixed(2)}
              </span>
            </div>
          )}
          {formData.partySize.infants > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Infants ({formData.partySize.infants}) × ${tourConfig.pricing.infant}</span>
              <span className="font-medium text-gray-900">
                ${(formData.partySize.infants * tourConfig.pricing.infant).toFixed(2)}
              </span>
            </div>
          )}

          {pricing.mealUpgrades > 0 && (
            <div className="flex justify-between text-gray-700 pt-2 border-t border-gray-200">
              <span>Meal Upgrades</span>
              <span className="font-medium text-gray-900">${pricing.mealUpgrades.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-3 border-t-2 border-gray-300">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-[rgb(48,187,216)]">${pricing.total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {currentStep >= 4 && (
          <p className="text-xs text-gray-500 mt-4">
            Payment will be collected after your booking is confirmed
          </p>
        )}
      </div>
    </div>
  )
}

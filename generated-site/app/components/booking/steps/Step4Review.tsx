'use client'

import type { BookingFormData, TourConfig } from '../types'
import { MEAL_OPTIONS } from '../types'

interface Step4Props {
  formData: BookingFormData
  tourConfig: TourConfig
  onNext: () => void
  onBack: () => void
  onEdit: (step: number) => void
}

export function Step4Review({ formData, tourConfig, onNext, onBack, onEdit }: Step4Props) {
  const calculateTotalPrice = () => {
    const basePrice =
      formData.partySize.adults * tourConfig.pricing.adult +
      formData.partySize.children * tourConfig.pricing.child +
      formData.partySize.infants * tourConfig.pricing.infant

    const mealUpgrades = formData.passengers.reduce((total, passenger) => {
      const mealOption = MEAL_OPTIONS.find((opt) => opt.value === passenger.mealPreference)
      return total + (mealOption?.price || 0)
    }, 0)

    return {
      basePrice,
      mealUpgrades,
      total: basePrice + mealUpgrades,
    }
  }

  const pricing = calculateTotalPrice()

  const formatDate = (date?: Date) => {
    if (!date) return 'Not set'
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getMealLabel = (mealValue: string) => {
    const meal = MEAL_OPTIONS.find((opt) => opt.value === mealValue)
    return meal?.label || mealValue
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Review Your Booking</h3>
        <p className="text-sm text-gray-500 mt-1">
          Please review all details before submitting your booking request
        </p>
      </div>

      {/* Tour Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-gray-900">Tour Details</h4>
          <button
            onClick={() => onEdit(1)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tour:</span>
            <span className="font-medium text-gray-900">{tourConfig.tourName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">{formatDate(formData.tourDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transport:</span>
            <span className="font-medium text-gray-900 capitalize">
              {tourConfig.transportMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Party Size:</span>
            <span className="font-medium text-gray-900">
              {formData.partySize.adults > 0 && `${formData.partySize.adults} Adult(s)`}
              {formData.partySize.children > 0 && `, ${formData.partySize.children} Child(ren)`}
              {formData.partySize.infants > 0 && `, ${formData.partySize.infants} Infant(s)`}
            </span>
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-gray-900">Passenger Information</h4>
          <button
            onClick={() => onEdit(2)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          {formData.passengers.map((passenger, index) => (
            <div key={passenger.id} className="border-l-4 border-blue-400 pl-4 py-2">
              <div className="font-medium text-gray-900">
                Passenger {index + 1}: {passenger.firstName} {passenger.lastName}
              </div>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <div>Age Group: <span className="capitalize">{passenger.ageGroup}</span></div>
                <div>Meal: {getMealLabel(passenger.mealPreference)}</div>
                {passenger.passportNumber && (
                  <div>Passport: {passenger.passportNumber}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-gray-900">Contact Information</h4>
          <button
            onClick={() => onEdit(3)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{formData.contactInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium text-gray-900">{formData.contactInfo.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hotel:</span>
            <span className="font-medium text-gray-900">{formData.contactInfo.hotel}</span>
          </div>
          {formData.contactInfo.specialRequests && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-gray-600 block mb-1">Special Requests:</span>
              <span className="text-gray-900">{formData.contactInfo.specialRequests}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          {formData.partySize.adults > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">
                Adults ({formData.partySize.adults} × ${tourConfig.pricing.adult.toFixed(2)})
              </span>
              <span className="font-medium">
                ${(formData.partySize.adults * tourConfig.pricing.adult).toFixed(2)}
              </span>
            </div>
          )}
          {formData.partySize.children > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">
                Children ({formData.partySize.children} × ${tourConfig.pricing.child.toFixed(2)})
              </span>
              <span className="font-medium">
                ${(formData.partySize.children * tourConfig.pricing.child).toFixed(2)}
              </span>
            </div>
          )}
          {formData.partySize.infants > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">
                Infants ({formData.partySize.infants} × ${tourConfig.pricing.infant.toFixed(2)})
              </span>
              <span className="font-medium">
                ${(formData.partySize.infants * tourConfig.pricing.infant).toFixed(2)}
              </span>
            </div>
          )}
          {pricing.mealUpgrades > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Meal Upgrades</span>
              <span className="font-medium">${pricing.mealUpgrades.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-blue-300 pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total Price</span>
              <span className="text-blue-700">${pricing.total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4">
          Payment will be collected after your booking is confirmed by our team
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          Continue to Terms
        </button>
      </div>
    </div>
  )
}

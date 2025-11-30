'use client'

import { useState } from 'react'
import type { BookingFormData, TourConfig } from '../types'
import { MEAL_OPTIONS } from '../types'

interface Step4Props {
  formData: BookingFormData
  tourConfig: TourConfig
  updateFormData: (data: Partial<BookingFormData>) => void
  onSubmit: () => void
  onBack: () => void
  onEdit: (step: number) => void
}

export function Step4Review({ formData, tourConfig, updateFormData, onSubmit, onBack, onEdit }: Step4Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const updateTerms = (field: keyof typeof formData.agreedToTerms, value: boolean) => {
    updateFormData({
      agreedToTerms: {
        ...formData.agreedToTerms,
        [field]: value,
      },
    })
  }

  const allTermsAgreed =
    formData.agreedToTerms.terms &&
    formData.agreedToTerms.cancellation &&
    formData.agreedToTerms.liability

  const handleSubmit = async () => {
    if (allTermsAgreed && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await onSubmit()
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Booking Summary - Clean, Scannable */}
      <div className="space-y-6">
        {/* Tour & Date */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tour & Date</h4>
            <button
              onClick={() => onEdit(1)}
              className="text-[rgb(48,187,216)] hover:text-[rgb(38,177,206)] text-sm font-medium"
            >
              Edit
            </button>
          </div>
          <p className="font-medium text-gray-900">{tourConfig.tourName}</p>
          <p className="text-sm text-gray-700 mt-1">{formatDate(formData.tourDate)}</p>
          <p className="text-sm text-gray-600 mt-1">
            {formData.partySize.adults > 0 && `${formData.partySize.adults} Adult${formData.partySize.adults !== 1 ? 's' : ''}`}
            {formData.partySize.children > 0 && `, ${formData.partySize.children} Youth`}
            {formData.partySize.infants > 0 && `, ${formData.partySize.infants} Infant${formData.partySize.infants !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Passengers */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Passengers</h4>
            <button
              onClick={() => onEdit(2)}
              className="text-[rgb(48,187,216)] hover:text-[rgb(38,177,206)] text-sm font-medium"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2">
            {formData.passengers.map((passenger, index) => (
              <div key={passenger.id} className="text-sm">
                <span className="font-medium text-gray-900">
                  {passenger.firstName} {passenger.lastName}
                </span>
                <span className="text-gray-600"> • {getMealLabel(passenger.mealPreference)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</h4>
            <button
              onClick={() => onEdit(3)}
              className="text-[rgb(48,187,216)] hover:text-[rgb(38,177,206)] text-sm font-medium"
            >
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm text-gray-700">
            <p>{formData.contactInfo.email}</p>
            <p>{formData.contactInfo.phone}</p>
            {formData.contactInfo.hotel && <p>{formData.contactInfo.hotel}</p>}
            {formData.contactInfo.specialRequests && (
              <p className="text-gray-600 mt-2 pt-2 border-t border-gray-200">
                {formData.contactInfo.specialRequests}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms & Conditions - Clean Checkboxes */}
      <div className="space-y-4 pt-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Terms & Conditions</h4>

        <div className="space-y-3">
          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.agreedToTerms.terms}
              onChange={(e) => updateTerms('terms', e.target.checked)}
              className="mt-1 h-4 w-4 text-[rgb(48,187,216)] border-gray-300 rounded focus:ring-[rgb(48,187,216)]"
            />
            <span className="ml-3 text-sm text-gray-700">
              I agree to the terms and conditions
            </span>
          </label>

          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.agreedToTerms.cancellation}
              onChange={(e) => updateTerms('cancellation', e.target.checked)}
              className="mt-1 h-4 w-4 text-[rgb(48,187,216)] border-gray-300 rounded focus:ring-[rgb(48,187,216)]"
            />
            <span className="ml-3 text-sm text-gray-700">
              I understand the 72-hour cancellation policy
            </span>
          </label>

          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.agreedToTerms.liability}
              onChange={(e) => updateTerms('liability', e.target.checked)}
              className="mt-1 h-4 w-4 text-[rgb(48,187,216)] border-gray-300 rounded focus:ring-[rgb(48,187,216)]"
            />
            <span className="ml-3 text-sm text-gray-700">
              I acknowledge and accept the liability waiver
            </span>
          </label>
        </div>

        {!allTermsAgreed && (
          <p className="text-sm text-gray-500 mt-3">
            Please accept all terms to submit your booking request
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allTermsAgreed || isSubmitting}
          className={`px-8 py-3 rounded-lg font-medium transition ${
            allTermsAgreed && !isSubmitting
              ? 'bg-[rgb(48,187,216)] text-white hover:bg-[rgb(38,177,206)]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { BookingFormData, TourConfig } from '../types'

interface Step1Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  tourConfig: TourConfig
}

export function Step1PartySize({ formData, updateFormData, onNext, tourConfig }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePartySizeChange = (field: 'adults' | 'children' | 'infants', value: number) => {
    updateFormData({
      partySize: {
        ...formData.partySize,
        [field]: Math.max(0, value),
      },
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ tourDate: new Date(e.target.value) })
  }

  const getMinDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 3) // 3 days minimum
    return today.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const today = new Date()
    today.setMonth(today.getMonth() + 6) // 6 months maximum
    return today.toISOString().split('T')[0]
  }

  const isDateAllowed = (date: Date): boolean => {
    const restrictions = tourConfig.restrictions
    if (!restrictions) return true

    // Check day of week (e.g., Friday only for Excellence)
    if (restrictions.daysOfWeek && !restrictions.daysOfWeek.includes(date.getDay())) {
      return false
    }

    // Check season
    if (restrictions.seasonStart && date < restrictions.seasonStart) {
      return false
    }
    if (restrictions.seasonEnd && date > restrictions.seasonEnd) {
      return false
    }

    return true
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (formData.partySize.adults === 0) {
      newErrors.adults = 'At least 1 adult is required'
    }

    if (!formData.tourDate) {
      newErrors.date = 'Please select a tour date'
    } else if (!isDateAllowed(formData.tourDate)) {
      newErrors.date = 'Selected date is not available for this tour'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Party Size</h3>

        {/* Adults */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adults (13 years and older)
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handlePartySizeChange('adults', formData.partySize.adults - 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
              disabled={formData.partySize.adults <= 1}
            >
              <span className="text-xl">−</span>
            </button>
            <span className="text-2xl font-semibold w-12 text-center">
              {formData.partySize.adults}
            </span>
            <button
              type="button"
              onClick={() => handlePartySizeChange('adults', formData.partySize.adults + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
          {errors.adults && <p className="text-red-600 text-sm mt-1">{errors.adults}</p>}
        </div>

        {/* Children */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Children (2-12 years)
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handlePartySizeChange('children', formData.partySize.children - 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
              disabled={formData.partySize.children <= 0}
            >
              <span className="text-xl">−</span>
            </button>
            <span className="text-2xl font-semibold w-12 text-center">
              {formData.partySize.children}
            </span>
            <button
              type="button"
              onClick={() => handlePartySizeChange('children', formData.partySize.children + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Infants (under 2 years)
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handlePartySizeChange('infants', formData.partySize.infants - 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
              disabled={formData.partySize.infants <= 0}
            >
              <span className="text-xl">−</span>
            </button>
            <span className="text-2xl font-semibold w-12 text-center">
              {formData.partySize.infants}
            </span>
            <button
              type="button"
              onClick={() => handlePartySizeChange('infants', formData.partySize.infants + 1)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tour Date
        </label>
        <input
          type="date"
          value={formData.tourDate ? formData.tourDate.toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
          min={getMinDate()}
          max={getMaxDate()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
        <p className="text-sm text-gray-500 mt-2">
          Bookings must be made at least 3 days in advance. Maximum 6 months ahead.
        </p>
        {tourConfig.restrictions?.daysOfWeek && (
          <p className="text-sm text-blue-600 mt-1">
            This tour is only available on specific days of the week.
          </p>
        )}
      </div>

      {/* Price Preview */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Estimated Price</h4>
        <div className="space-y-1 text-sm">
          {formData.partySize.adults > 0 && (
            <div className="flex justify-between">
              <span>Adults ({formData.partySize.adults})</span>
              <span className="font-medium">
                ${(formData.partySize.adults * tourConfig.pricing.adult).toFixed(2)}
              </span>
            </div>
          )}
          {formData.partySize.children > 0 && (
            <div className="flex justify-between">
              <span>Children ({formData.partySize.children})</span>
              <span className="font-medium">
                ${(formData.partySize.children * tourConfig.pricing.child).toFixed(2)}
              </span>
            </div>
          )}
          {formData.partySize.infants > 0 && (
            <div className="flex justify-between">
              <span>Infants ({formData.partySize.infants})</span>
              <span className="font-medium">
                ${(formData.partySize.infants * tourConfig.pricing.infant).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-base">
            <span>Subtotal</span>
            <span>
              ${(
                formData.partySize.adults * tourConfig.pricing.adult +
                formData.partySize.children * tourConfig.pricing.child +
                formData.partySize.infants * tourConfig.pricing.infant
              ).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            Meal upgrades will be added in the next step
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

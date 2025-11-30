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

  // Helper to create human-readable restriction messages
  const getRestrictionMessage = (): string => {
    const restrictions = tourConfig.restrictions
    if (!restrictions) return ''

    const parts: string[] = []

    // Days of week restriction
    if (restrictions.daysOfWeek && restrictions.daysOfWeek.length > 0) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const days = restrictions.daysOfWeek.map(d => dayNames[d])
      parts.push(`Available on: ${days.join(', ')}`)
    }

    // Season restriction
    if (restrictions.seasonStart && restrictions.seasonEnd) {
      const start = restrictions.seasonStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      const end = restrictions.seasonEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      parts.push(`Season: ${start} - ${end}`)
    }

    // Minimum age restriction
    if (restrictions.minAge) {
      parts.push(`Minimum age: ${restrictions.minAge} years`)
    }

    return parts.join(' • ')
  }

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

    // Check season - handles both normal ranges and year-wrapping seasons
    if (restrictions.seasonStart && restrictions.seasonEnd) {
      // Extract month and day for comparison (ignore year)
      const dateMonth = date.getMonth()
      const dateDay = date.getDate()
      const startMonth = restrictions.seasonStart.getMonth()
      const startDay = restrictions.seasonStart.getDate()
      const endMonth = restrictions.seasonEnd.getMonth()
      const endDay = restrictions.seasonEnd.getDate()

      // Check if season wraps across years (e.g., October to May)
      if (startMonth > endMonth || (startMonth === endMonth && startDay > endDay)) {
        // Year-wrapping season: valid if date is after start OR before end
        const afterStart = dateMonth > startMonth || (dateMonth === startMonth && dateDay >= startDay)
        const beforeEnd = dateMonth < endMonth || (dateMonth === endMonth && dateDay <= endDay)
        if (!afterStart && !beforeEnd) {
          return false
        }
      } else {
        // Normal season: valid if date is between start and end
        const afterStart = dateMonth > startMonth || (dateMonth === startMonth && dateDay >= startDay)
        const beforeEnd = dateMonth < endMonth || (dateMonth === endMonth && dateDay <= endDay)
        if (!afterStart || !beforeEnd) {
          return false
        }
      }
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
    <div className="space-y-8">
      {/* Party Size - Clean, No Boxes */}
      <div className="space-y-5">
        {/* Adults */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Adults</p>
            <p className="text-sm text-gray-500">${tourConfig.pricing.adult} per person</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handlePartySizeChange('adults', formData.partySize.adults - 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[rgb(48,187,216)] hover:text-[rgb(48,187,216)] transition disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-900"
              disabled={formData.partySize.adults <= 1}
            >
              <span className="text-xl font-light">−</span>
            </button>
            <span className="w-10 text-center font-semibold text-lg">{formData.partySize.adults}</span>
            <button
              type="button"
              onClick={() => handlePartySizeChange('adults', formData.partySize.adults + 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[rgb(48,187,216)] hover:text-[rgb(48,187,216)] transition"
            >
              <span className="text-xl font-light">+</span>
            </button>
          </div>
        </div>

        {/* Youth */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Youth (0-14)</p>
            <p className="text-sm text-gray-500">${tourConfig.pricing.child} per child</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handlePartySizeChange('children', formData.partySize.children - 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[rgb(48,187,216)] hover:text-[rgb(48,187,216)] transition disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-900"
              disabled={formData.partySize.children <= 0}
            >
              <span className="text-xl font-light">−</span>
            </button>
            <span className="w-10 text-center font-semibold text-lg">{formData.partySize.children}</span>
            <button
              type="button"
              onClick={() => handlePartySizeChange('children', formData.partySize.children + 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[rgb(48,187,216)] hover:text-[rgb(48,187,216)] transition"
            >
              <span className="text-xl font-light">+</span>
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Infants (0-2)</p>
            <p className="text-sm text-gray-500">Free</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handlePartySizeChange('infants', formData.partySize.infants - 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[rgb(48,187,216)] hover:text-[rgb(48,187,216)] transition disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-900"
              disabled={formData.partySize.infants <= 0}
            >
              <span className="text-xl font-light">−</span>
            </button>
            <span className="w-10 text-center font-semibold text-lg">{formData.partySize.infants}</span>
            <button
              type="button"
              onClick={() => handlePartySizeChange('infants', formData.partySize.infants + 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[rgb(48,187,216)] hover:text-[rgb(48,187,216)] transition"
            >
              <span className="text-xl font-light">+</span>
            </button>
          </div>
        </div>
        {errors.adults && <p className="text-red-600 text-sm">{errors.adults}</p>}
      </div>

      {/* Date Selection - Clean */}
      <div className="space-y-3">
        <label htmlFor="tour-date" className="block text-sm font-medium text-gray-700">
          Preferred Date
        </label>
        <input
          id="tour-date"
          type="date"
          value={formData.tourDate ? formData.tourDate.toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
          min={getMinDate()}
          max={getMaxDate()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(48,187,216)] focus:border-transparent"
        />
        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
        {getRestrictionMessage() && (
          <p className="text-sm text-gray-600 mt-2">{getRestrictionMessage()}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-[rgb(48,187,216)] text-white rounded-lg font-medium hover:bg-[rgb(38,177,206)] transition"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

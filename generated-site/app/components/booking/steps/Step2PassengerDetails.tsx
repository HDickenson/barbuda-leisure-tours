'use client'

import { useEffect, useState } from 'react'
import type { BookingFormData, PassengerDetails, TourConfig, MealPreference } from '../types'
import { MEAL_OPTIONS, COUNTRIES } from '../types'

interface Step2Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
  tourConfig: TourConfig
}

export function Step2PassengerDetails({
  formData,
  updateFormData,
  onNext,
  onBack,
  tourConfig,
}: Step2Props) {
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalPassengers =
    formData.partySize.adults + formData.partySize.children + formData.partySize.infants

  // Initialize passengers if not already done
  useEffect(() => {
    if (formData.passengers.length === 0) {
      const passengers: PassengerDetails[] = []

      // Add adults
      for (let i = 0; i < formData.partySize.adults; i++) {
        passengers.push(createEmptyPassenger('adult'))
      }

      // Add children
      for (let i = 0; i < formData.partySize.children; i++) {
        passengers.push(createEmptyPassenger('child'))
      }

      // Add infants
      for (let i = 0; i < formData.partySize.infants; i++) {
        passengers.push(createEmptyPassenger('infant'))
      }

      updateFormData({ passengers })
    }
  }, [formData.partySize, formData.passengers.length, updateFormData])

  const createEmptyPassenger = (ageGroup: 'adult' | 'child' | 'infant'): PassengerDetails => ({
    id: Math.random().toString(36).substring(7),
    ageGroup,
    firstName: '',
    lastName: '',
    mealPreference: 'bbq-chicken',
    ...(tourConfig.requiresPassport && {
      gender: undefined,
      dateOfBirth: undefined,
      bodyWeight: undefined,
      passportNumber: '',
      passportExpiry: undefined,
      passportCountry: '',
      nationality: '',
    }),
  })

  const currentPassenger = formData.passengers[currentPassengerIndex]

  const updateCurrentPassenger = (updates: Partial<PassengerDetails>) => {
    const updatedPassengers = [...formData.passengers]
    updatedPassengers[currentPassengerIndex] = {
      ...updatedPassengers[currentPassengerIndex],
      ...updates,
    }
    updateFormData({ passengers: updatedPassengers })
  }

  const validateCurrentPassenger = (): boolean => {
    const newErrors: Record<string, string> = {}
    const passenger = currentPassenger

    if (!passenger.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!passenger.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (tourConfig.requiresPassport) {
      if (!passenger.gender) {
        newErrors.gender = 'Gender is required'
      }

      if (!passenger.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required'
      }

      if (tourConfig.requiresBodyWeight && (!passenger.bodyWeight || passenger.bodyWeight <= 0)) {
        newErrors.bodyWeight = 'Body weight is required'
      }

      if (!passenger.passportNumber?.trim()) {
        newErrors.passportNumber = 'Passport number is required'
      }

      if (!passenger.passportExpiry) {
        newErrors.passportExpiry = 'Passport expiry date is required'
      } else if (formData.tourDate && passenger.passportExpiry < formData.tourDate) {
        newErrors.passportExpiry = 'Passport must be valid for the tour date'
      }

      if (!passenger.passportCountry?.trim()) {
        newErrors.passportCountry = 'Passport issuing country is required'
      }

      if (!passenger.nationality?.trim()) {
        newErrors.nationality = 'Nationality is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextPassenger = () => {
    if (validateCurrentPassenger()) {
      if (currentPassengerIndex < totalPassengers - 1) {
        setCurrentPassengerIndex(currentPassengerIndex + 1)
        setErrors({})
      } else {
        onNext()
      }
    }
  }

  const handlePreviousPassenger = () => {
    if (currentPassengerIndex > 0) {
      setCurrentPassengerIndex(currentPassengerIndex - 1)
      setErrors({})
    } else {
      onBack()
    }
  }

  if (!currentPassenger) {
    return <div>Loading...</div>
  }

  const getPassengerLabel = () => {
    const { ageGroup } = currentPassenger
    const groupLabel = ageGroup === 'adult' ? 'Adult' : ageGroup === 'child' ? 'Child' : 'Infant'
    return `${groupLabel} - Passenger ${currentPassengerIndex + 1} of ${totalPassengers}`
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{getPassengerLabel()}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Please provide details for this passenger
        </p>
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentPassenger.firstName}
            onChange={(e) => updateCurrentPassenger({ firstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentPassenger.lastName}
            onChange={(e) => updateCurrentPassenger({ lastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>

        {/* Passport Required Fields */}
        {tourConfig.requiresPassport && (
          <>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={currentPassenger.gender || ''}
                onChange={(e) =>
                  updateCurrentPassenger({ gender: e.target.value as 'Male' | 'Female' | 'Other' })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={currentPassenger.dateOfBirth?.toISOString().split('T')[0] || ''}
                onChange={(e) => updateCurrentPassenger({ dateOfBirth: new Date(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {errors.dateOfBirth && (
                <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Body Weight */}
            {tourConfig.requiresBodyWeight && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Weight (lbs) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={currentPassenger.bodyWeight || ''}
                  onChange={(e) => updateCurrentPassenger({ bodyWeight: Number(e.target.value) })}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                {errors.bodyWeight && (
                  <p className="text-red-600 text-sm mt-1">{errors.bodyWeight}</p>
                )}
              </div>
            )}

            {/* Passport Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={currentPassenger.passportNumber || ''}
                onChange={(e) => updateCurrentPassenger({ passportNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {errors.passportNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.passportNumber}</p>
              )}
            </div>

            {/* Passport Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={currentPassenger.passportExpiry?.toISOString().split('T')[0] || ''}
                onChange={(e) => updateCurrentPassenger({ passportExpiry: new Date(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {errors.passportExpiry && (
                <p className="text-red-600 text-sm mt-1">{errors.passportExpiry}</p>
              )}
            </div>

            {/* Passport Issued By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Issued By <span className="text-red-500">*</span>
              </label>
              <select
                value={currentPassenger.passportCountry || ''}
                onChange={(e) => updateCurrentPassenger({ passportCountry: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.passportCountry && (
                <p className="text-red-600 text-sm mt-1">{errors.passportCountry}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                value={currentPassenger.nationality || ''}
                onChange={(e) => updateCurrentPassenger({ nationality: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Select nationality</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.nationality && (
                <p className="text-red-600 text-sm mt-1">{errors.nationality}</p>
              )}
            </div>
          </>
        )}

        {/* Meal Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meal Preference</label>
          <select
            value={currentPassenger.mealPreference}
            onChange={(e) =>
              updateCurrentPassenger({ mealPreference: e.target.value as MealPreference })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            {MEAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={handlePreviousPassenger}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNextPassenger}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          {currentPassengerIndex < totalPassengers - 1 ? 'Next Passenger' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

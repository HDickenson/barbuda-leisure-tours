'use client'

import { useState } from 'react'
import type { BookingFormData } from '../types'

interface Step3Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step3ContactInfo({ formData, updateFormData, onNext, onBack }: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateContactInfo = (field: keyof typeof formData.contactInfo, value: string) => {
    updateFormData({
      contactInfo: {
        ...formData.contactInfo,
        [field]: value,
      },
    })
  }

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Basic validation - at least 10 digits
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 10
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.contactInfo.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!validateEmail(formData.contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.contactInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.contactInfo.hotel.trim()) {
      newErrors.hotel = 'Hotel name is required (or enter "Not applicable")'
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          We'll use this information to send your booking confirmation and updates
        </p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.contactInfo.email}
            onChange={(e) => updateContactInfo('email', e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.contactInfo.phone}
            onChange={(e) => updateContactInfo('phone', e.target.value)}
            placeholder="+1 (268) 123-4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Include country code (e.g., +1 for US/Canada)
          </p>
        </div>

        {/* Hotel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.contactInfo.hotel}
            onChange={(e) => updateContactInfo('hotel', e.target.value)}
            placeholder="Enter your hotel name or 'Not applicable'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {errors.hotel && <p className="text-red-600 text-sm mt-1">{errors.hotel}</p>}
          <p className="text-sm text-gray-500 mt-1">
            If not staying at a hotel, enter "Not applicable"
          </p>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests / Comments
          </label>
          <textarea
            value={formData.contactInfo.specialRequests}
            onChange={(e) => updateContactInfo('specialRequests', e.target.value)}
            rows={4}
            placeholder="Any special requests, dietary restrictions, or additional information..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Optional - Let us know if you have any special requirements
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Important Information</p>
            <p>
              Make sure your email and phone number are correct. We'll send your booking
              confirmation and payment link to the email address provided.
            </p>
          </div>
        </div>
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
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          Continue to Review
        </button>
      </div>
    </div>
  )
}

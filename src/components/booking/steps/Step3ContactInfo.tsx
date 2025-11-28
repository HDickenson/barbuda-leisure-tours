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
    <div className="space-y-8">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(48,187,216)] focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(48,187,216)] focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(48,187,216)] focus:border-transparent"
          />
          {errors.hotel && <p className="text-red-600 text-sm mt-1">{errors.hotel}</p>}
          <p className="text-sm text-gray-500 mt-1">
            If not staying at a hotel, enter &quot;Not applicable&quot;
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(48,187,216)] focus:border-transparent resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Optional - Let us know if you have any special requirements
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition"
        >
          Back
        </button>
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

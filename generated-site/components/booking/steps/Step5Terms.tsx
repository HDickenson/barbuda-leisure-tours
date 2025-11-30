'use client'

import { useState } from 'react'
import type { BookingFormData } from '../types'

interface Step5Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  onSubmit: () => void
  onBack: () => void
}

export function Step5Terms({ formData, updateFormData, onSubmit, onBack }: Step5Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
        <p className="text-sm text-gray-500 mt-1">
          Please read and accept the following terms before submitting your booking
        </p>
      </div>

      {/* Terms Content */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none text-gray-700">
          <h4 className="font-semibold text-gray-900 mb-3">Booking and Payment</h4>
          <p className="mb-4">
            A 100% deposit is required at the time of booking to confirm your reservation. All
            bookings are subject to availability and confirmation.
          </p>

          <h4 className="font-semibold text-gray-900 mb-3">Age and Health Recommendations</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Signature Tours are not recommended for children under 2 years old</li>
            <li>
              Signature guided tours are not recommended for individuals with physical disabilities
              or mobility challenges
            </li>
          </ul>

          <h4 className="font-semibold text-gray-900 mb-3">Liability Waiver</h4>
          <p className="mb-2">By booking a tour, you agree to the following:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>
              <strong>Inherent Risks:</strong> You acknowledge that activities such as snorkeling
              and boating carry inherent risks, including equipment failure, sea conditions, adverse
              weather, marine life interactions, and boarding or disembarking from boats. You
              voluntarily assume all such risks.
            </li>
            <li>
              <strong>Duty of Care:</strong> You agree to exercise reasonable care for your own
              safety and to follow all safety instructions provided by the tour operator and crew.
            </li>
            <li>
              <strong>Physical Fitness:</strong> You confirm that you are physically fit to
              participate in activities such as hiking, snorkeling, and boating.
            </li>
            <li>
              <strong>Personal Property:</strong> Barbuda Leisure Day Tours and its partners are not
              responsible for any personal items that are lost, stolen, or damaged during the tour.
            </li>
          </ul>

          <h4 className="font-semibold text-gray-900 mb-3">Cancellation Policy</h4>
          <p className="mb-4">
            You may cancel your reservation up to <strong>72 hours</strong> before your tour date.
            Cancellations made within 72 hours of the tour date are non-refundable. If traveling by
            airplane, flight costs and fees are non-refundable. You must contact the airline
            directly to request a refund, credit, or flight rescheduling.
          </p>

          <h4 className="font-semibold text-gray-900 mb-3">No-Show Policy</h4>
          <p className="mb-4">
            Failure to appear for your scheduled tour will result in a 100% charge of the total
            price, and no refund will be issued.
          </p>

          <h4 className="font-semibold text-gray-900 mb-3">Changes to Itinerary</h4>
          <p className="mb-4">
            Barbuda Leisure Day Tours reserves the right to adjust, reschedule, or cancel tours due
            to weather conditions, safety concerns, or operational reasons. Guests will be notified
            of any major changes as soon as possible.
          </p>

          <h4 className="font-semibold text-gray-900 mb-3">Travel Requirements</h4>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>
              Guests are responsible for ensuring they have valid identification and any required
              travel documents
            </li>
            <li>
              For air travel, passengers may be subject to weight and baggage restrictions imposed
              by the airline
            </li>
          </ul>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.agreedToTerms.terms}
            onChange={(e) => updateTerms('terms', e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
            I have read and agree to the <strong>Terms and Conditions</strong>
          </span>
        </label>

        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.agreedToTerms.cancellation}
            onChange={(e) => updateTerms('cancellation', e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
            I understand the <strong>72-hour cancellation policy</strong>
          </span>
        </label>

        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.agreedToTerms.liability}
            onChange={(e) => updateTerms('liability', e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
            I acknowledge and accept the <strong>liability waiver</strong>
          </span>
        </label>
      </div>

      {/* Warning if not all agreed */}
      {!allTermsAgreed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold">Agreement Required</p>
              <p className="mt-1">
                You must accept all terms and conditions before submitting your booking request.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allTermsAgreed || isSubmitting}
          className={`px-8 py-3 rounded-full font-semibold transition shadow-lg ${
            allTermsAgreed && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </div>
    </div>
  )
}

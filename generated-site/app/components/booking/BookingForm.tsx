'use client'

import { useState } from 'react'
import { Modal } from '../widgets/Modal'
import { TourSummary } from './TourSummary'
import { Step1PartySize } from './steps/Step1PartySize'
import { Step2PassengerDetails } from './steps/Step2PassengerDetails'
import { Step3ContactInfo } from './steps/Step3ContactInfo'
import { Step4Review } from './steps/Step4Review'
import { Step5Terms } from './steps/Step5Terms'
import { Step6Confirmation } from './steps/Step6Confirmation'
import type { BookingFormData, TourConfig } from './types'

interface BookingFormProps {
  isOpen: boolean
  onClose: () => void
  tourConfig: TourConfig
}

export function BookingForm({ isOpen, onClose, tourConfig }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    partySize: { adults: 1, children: 0, infants: 0 },
    tourDate: undefined,
    passengers: [],
    contactInfo: { email: '', phone: '', hotel: '', specialRequests: '' },
    agreedToTerms: { terms: false, cancellation: false, liability: false },
  })
  const [bookingReference, setBookingReference] = useState<string>('')

  const totalSteps = 6

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    try {
      // Generate booking reference
      const timestamp = new Date().getTime().toString(36)
      const random = Math.random().toString(36).substring(2, 5).toUpperCase()
      const ref = `BL-${timestamp}-${random}`

      // Prepare payload
      const payload = {
        reference: ref,
        timestamp: new Date().toISOString(),
        tour: tourConfig,
        booking: formData,
      }

      // Send to API
      const response = await fetch('/api/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setBookingReference(ref)
        handleNext()
      } else {
        throw new Error('Booking submission failed')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('There was an error submitting your booking. Please try again.')
    }
  }

  const handleClose = () => {
    // Reset form
    setCurrentStep(1)
    setFormData({
      partySize: { adults: 1, children: 0, infants: 0 },
      tourDate: undefined,
      passengers: [],
      contactInfo: { email: '', phone: '', hotel: '', specialRequests: '' },
      agreedToTerms: { terms: false, cancellation: false, liability: false },
    })
    setBookingReference('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <div className="booking-form">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{tourConfig.tourName}</h2>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN: Active Form (auto width - takes remaining space) */}
          <div className="flex-1">
            {currentStep === 1 && (
              <Step1PartySize
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                tourConfig={tourConfig}
              />
            )}

            {currentStep === 2 && (
              <Step2PassengerDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
                tourConfig={tourConfig}
              />
            )}

            {currentStep === 3 && (
              <Step3ContactInfo
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <Step4Review
                formData={formData}
                tourConfig={tourConfig}
                onNext={handleNext}
                onBack={handleBack}
                onEdit={handleStepChange}
              />
            )}

            {currentStep === 5 && (
              <Step5Terms
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={handleSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 6 && (
              <Step6Confirmation
                bookingReference={bookingReference}
                contactEmail={formData.contactInfo.email}
                onClose={handleClose}
              />
            )}
          </div>

          {/* RIGHT COLUMN: Tour Summary (30% fixed width on desktop, sticky) */}
          <div className="lg:w-[30%] flex-shrink-0">
            <TourSummary
              tourConfig={tourConfig}
              formData={formData}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

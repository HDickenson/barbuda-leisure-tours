'use client'

interface Step6Props {
  bookingReference: string
  contactEmail: string
  onClose: () => void
}

export function Step6Confirmation({ bookingReference, contactEmail, onClose }: Step6Props) {
  return (
    <div className="space-y-6 text-center py-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Submitted!</h3>
        <p className="text-gray-600">Thank you for choosing Barbuda Leisure Day Tours</p>
      </div>

      {/* Booking Reference */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-2">Your Booking Reference</p>
        <p className="text-3xl font-bold text-blue-700 tracking-wider">{bookingReference}</p>
        <p className="text-xs text-gray-500 mt-3">
          Please save this reference number for your records
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">What Happens Next?</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm mr-4">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Review & Confirmation</p>
              <p className="text-sm text-gray-600 mt-1">
                Our team will review your booking request and check availability
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm mr-4">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Confirmation</p>
              <p className="text-sm text-gray-600 mt-1">
                You&apos;ll receive an email at <strong>{contactEmail}</strong> with your invoice and a
                secure payment link powered by Fygaro
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm mr-4">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Payment & Final Details</p>
              <p className="text-sm text-gray-600 mt-1">
                Complete your payment and receive your detailed tour itinerary and weather forecast
                24 hours before departure
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start text-left">
          <svg
            className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-yellow-900">
            <p className="font-semibold mb-1">Please Check Your Email</p>
            <p>
              If you don&apos;t receive a confirmation email within 2 hours, please check your spam
              folder or contact us directly.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-sm text-gray-600">
        <p className="mb-2">Need assistance? Contact us:</p>
        <p className="font-medium text-gray-900">
          Email: info@barbudaleisure.com
          <br />
          Phone: +1 (268) XXX-XXXX
        </p>
      </div>

      {/* Close Button */}
      <div className="pt-4">
        <button
          onClick={onClose}
          className="w-full px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          Close
        </button>
      </div>
    </div>
  )
}

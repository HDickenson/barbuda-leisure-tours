import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for booking requests
const BookingRequestSchema = z.object({
  reference: z.string().min(1),
  timestamp: z.string().datetime(),
  tour: z.object({
    tourId: z.string(),
    tourName: z.string(),
    tourType: z.enum(['discover-air', 'discover-sea', 'sky-sea', 'barbuda-beach', 'helicopter', 'airplane', 'yacht', 'shared-boat', 'excellence-sea', 'already-in-barbuda']),
    basePrice: z.number().positive(),
    childPrice: z.number().nonnegative().optional(),
    infantPrice: z.number().nonnegative().optional(),
  }),
  booking: z.object({
    partySize: z.object({
      adults: z.number().int().positive(),
      children: z.number().int().nonnegative(),
      infants: z.number().int().nonnegative(),
    }),
    tourDate: z.string().optional(),
    passengers: z.array(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        age: z.number().int().optional(),
        dietaryRestrictions: z.string().optional(),
      })
    ),
    contactInfo: z.object({
      email: z.string().email(),
      phone: z.string().min(1),
      hotel: z.string().optional(),
      specialRequests: z.string().optional(),
    }),
    agreedToTerms: z.object({
      terms: z.boolean(),
      cancellation: z.boolean(),
      liability: z.boolean(),
    }),
  }),
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request data
    const validatedData = BookingRequestSchema.parse(body)

    // Verify all terms are accepted
    const { terms, cancellation, liability } = validatedData.booking.agreedToTerms
    if (!terms || !cancellation || !liability) {
      return NextResponse.json(
        { error: 'All terms and conditions must be accepted' },
        { status: 400 }
      )
    }

    // Calculate total price
    const { adults, children, infants } = validatedData.booking.partySize
    const { basePrice, childPrice = 0, infantPrice = 0 } = validatedData.tour
    const totalPrice = adults * basePrice + children * childPrice + infants * infantPrice

    // Prepare email notification data
    const emailData = {
      to: process.env.BOOKING_EMAIL || 'info@barbudaleisure.com',
      subject: `New Booking Request: ${validatedData.reference}`,
      html: generateEmailHTML(validatedData, totalPrice),
    }

    // Send confirmation email (would integrate with email service)
    // For now, just log the booking
    console.log('Booking Request Received:', {
      reference: validatedData.reference,
      tourName: validatedData.tour.tourName,
      email: validatedData.booking.contactInfo.email,
      totalPrice,
      timestamp: validatedData.timestamp,
    })

    // In production, you would:
    // 1. Send email notification to business
    // 2. Send confirmation email to customer
    // 3. Store booking in database
    // 4. Integrate with payment processor

    // For now, return success response
    return NextResponse.json(
      {
        success: true,
        reference: validatedData.reference,
        message: 'Booking request received. We will contact you shortly to confirm.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Booking request error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid booking data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate HTML email content
function generateEmailHTML(data: z.infer<typeof BookingRequestSchema>, totalPrice: number): string {
  const { reference, timestamp, tour, booking } = data
  const { partySize, tourDate, passengers, contactInfo, agreedToTerms } = booking

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #4DD0E1 0%, #26C6DA 100%); color: white; padding: 20px; text-align: center; }
    .section { background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 8px; }
    .section h2 { color: #4DD0E1; margin-top: 0; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; min-width: 150px; }
    .passenger-card { background: white; padding: 10px; margin: 8px 0; border-radius: 5px; }
    .total { font-size: 20px; font-weight: bold; color: #4DD0E1; padding: 15px; text-align: center; background: white; border-radius: 8px; }
    .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Booking Request</h1>
      <p>Reference: ${reference}</p>
    </div>

    <div class="section">
      <h2>Tour Information</h2>
      <div class="info-row">
        <span class="info-label">Tour:</span>
        <span>${tour.tourName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tour Type:</span>
        <span>${tour.tourType}</span>
      </div>
      ${tourDate ? `
      <div class="info-row">
        <span class="info-label">Requested Date:</span>
        <span>${tourDate}</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="info-label">Booking Time:</span>
        <span>${new Date(timestamp).toLocaleString('en-US', { timeZone: 'America/Antigua' })}</span>
      </div>
    </div>

    <div class="section">
      <h2>Party Details</h2>
      <div class="info-row">
        <span class="info-label">Adults:</span>
        <span>${partySize.adults}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Children:</span>
        <span>${partySize.children}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Infants:</span>
        <span>${partySize.infants}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Total Guests:</span>
        <span>${partySize.adults + partySize.children + partySize.infants}</span>
      </div>
    </div>

    <div class="section">
      <h2>Passenger Information</h2>
      ${passengers.map((p, i) => `
        <div class="passenger-card">
          <strong>Passenger ${i + 1}:</strong> ${p.firstName} ${p.lastName}
          ${p.age ? ` (Age: ${p.age})` : ''}
          ${p.dietaryRestrictions ? `<br><em>Dietary: ${p.dietaryRestrictions}</em>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>Contact Information</h2>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span><a href="mailto:${contactInfo.email}">${contactInfo.email}</a></span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span><a href="tel:${contactInfo.phone}">${contactInfo.phone}</a></span>
      </div>
      ${contactInfo.hotel ? `
      <div class="info-row">
        <span class="info-label">Hotel:</span>
        <span>${contactInfo.hotel}</span>
      </div>
      ` : ''}
      ${contactInfo.specialRequests ? `
      <div class="info-row">
        <span class="info-label">Special Requests:</span>
        <span>${contactInfo.specialRequests}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <h2>Pricing</h2>
      <div class="info-row">
        <span class="info-label">Adults (${partySize.adults} × $${tour.basePrice}):</span>
        <span>$${partySize.adults * tour.basePrice}</span>
      </div>
      ${partySize.children > 0 && tour.childPrice ? `
      <div class="info-row">
        <span class="info-label">Children (${partySize.children} × $${tour.childPrice}):</span>
        <span>$${partySize.children * tour.childPrice}</span>
      </div>
      ` : ''}
      ${partySize.infants > 0 && tour.infantPrice ? `
      <div class="info-row">
        <span class="info-label">Infants (${partySize.infants} × $${tour.infantPrice}):</span>
        <span>$${partySize.infants * tour.infantPrice}</span>
      </div>
      ` : ''}
      <div class="total">
        Total Estimate: $${totalPrice.toFixed(2)}
      </div>
    </div>

    <div class="section">
      <h2>Terms Accepted</h2>
      <div class="info-row">
        <span class="info-label">Terms & Conditions:</span>
        <span>✓ Accepted</span>
      </div>
      <div class="info-row">
        <span class="info-label">Cancellation Policy:</span>
        <span>✓ Accepted</span>
      </div>
      <div class="info-row">
        <span class="info-label">Liability Waiver:</span>
        <span>✓ Accepted</span>
      </div>
    </div>

    <div class="footer">
      <p>This is an automated notification from Barbuda Leisure Tours booking system.</p>
      <p>Please contact the customer promptly to confirm availability and finalize booking details.</p>
      <p>&copy; ${new Date().getFullYear()} Barbuda Leisure Tours. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

import { NextRequest, NextResponse } from 'next/server'

interface Passenger {
  firstName: string
  lastName: string
  ageGroup: 'adult' | 'child' | 'infant'
  mealPreference: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { reference, timestamp, tour, booking } = payload

    // Format booking details for logging/email
    const formatDate = (date: string | undefined) => {
      if (!date) return 'Not specified'
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    }

    // Calculate total cost
    const calculateTotal = () => {
      let total = 0
      booking.passengers.forEach((passenger: Passenger) => {
        // Base tour cost
        if (passenger.ageGroup === 'adult') {
          total += tour.pricing.adult
        } else if (passenger.ageGroup === 'child') {
          total += tour.pricing.child
        } else if (passenger.ageGroup === 'infant') {
          total += tour.pricing.infant
        }

        // Meal upgrades
        const mealPrices: Record<string, number> = {
          'bbq-chicken': 0,
          lobster: tour.mealUpgrades?.lobster || 15,
          fish: tour.mealUpgrades?.fish || 10,
          conch: tour.mealUpgrades?.conch || 10,
          shrimp: tour.mealUpgrades?.shrimp || 10,
          vegetarian: tour.mealUpgrades?.vegetarian || 5,
        }
        total += mealPrices[passenger.mealPreference] || 0
      })
      return total
    }

    const totalCost = calculateTotal()

    // Log the booking for now (email integration can be added later with nodemailer)
    console.log('=== NEW BOOKING REQUEST ===')
    console.log(`Reference: ${reference}`)
    console.log(`Tour: ${tour.tourName}`)
    console.log(`Date: ${formatDate(booking.tourDate)}`)
    console.log(`Party: ${booking.partySize.adults} Adults, ${booking.partySize.children} Children, ${booking.partySize.infants} Infants`)
    console.log(`Contact: ${booking.contactInfo.email} | ${booking.contactInfo.phone}`)
    console.log(`Hotel: ${booking.contactInfo.hotel || 'Not specified'}`)
    console.log(`Total: ${formatCurrency(totalCost)}`)
    console.log(`Timestamp: ${timestamp}`)
    console.log('========================')

    // If SMTP is configured, send emails
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = await import('nodemailer')

        const transporter = nodemailer.default.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        // Email to business owner
        const ownerEmailHtml = `
          <h1>New Booking Request - ${reference}</h1>
          <p><strong>Tour:</strong> ${tour.tourName}</p>
          <p><strong>Date:</strong> ${formatDate(booking.tourDate)}</p>
          <p><strong>Party:</strong> ${booking.partySize.adults} Adults, ${booking.partySize.children} Children, ${booking.partySize.infants} Infants</p>
          <p><strong>Contact Email:</strong> ${booking.contactInfo.email}</p>
          <p><strong>Contact Phone:</strong> ${booking.contactInfo.phone}</p>
          <p><strong>Hotel:</strong> ${booking.contactInfo.hotel || 'Not specified'}</p>
          <p><strong>Special Requests:</strong> ${booking.contactInfo.specialRequests || 'None'}</p>
          <p><strong>Estimated Total:</strong> ${formatCurrency(totalCost)}</p>
          <hr>
          <h3>Passengers:</h3>
          ${booking.passengers.map((p: Passenger, i: number) => `
            <p><strong>Passenger ${i + 1}:</strong> ${p.firstName} ${p.lastName} (${p.ageGroup}) - Meal: ${p.mealPreference}</p>
          `).join('')}
        `

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          subject: `🎉 New Booking Request - ${reference}`,
          html: ownerEmailHtml,
        })

        // Confirmation email to customer
        const customerEmailHtml = `
          <h1>Booking Request Received!</h1>
          <p>Dear ${booking.passengers[0]?.firstName || 'Guest'},</p>
          <p>Thank you for your booking request for <strong>${tour.tourName}</strong>.</p>
          <p>Your reference number is: <strong>${reference}</strong></p>
          <p>We will contact you within 24 hours to confirm availability and payment details.</p>
          <hr>
          <p><strong>Tour Date:</strong> ${formatDate(booking.tourDate)}</p>
          <p><strong>Party Size:</strong> ${booking.partySize.adults} Adults, ${booking.partySize.children} Children, ${booking.partySize.infants} Infants</p>
          <p><strong>Estimated Total:</strong> ${formatCurrency(totalCost)}</p>
          <hr>
          <p>Questions? Contact us at info@barbudaleisure.com or +1 (268) 764-2524</p>
          <p>Barbuda Leisure Day Tours</p>
        `

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: booking.contactInfo.email,
          subject: `Booking Request Received - ${tour.tourName} - ${reference}`,
          html: customerEmailHtml,
        })

        console.log('Emails sent successfully')
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue anyway - booking is logged
      }
    }

    return NextResponse.json(
      {
        success: true,
        reference,
        message: 'Booking request submitted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing booking:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process booking request',
      },
      { status: 500 }
    )
  }
}

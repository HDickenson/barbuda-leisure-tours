import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, tour, date, guests } = body;

    if (!name || !email || !tour || !date || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your booking system
    // For now, we'll log the booking and send an email notification

    console.log('New booking request:', {
      name,
      email,
      phone: body.phone,
      tour,
      date,
      guests,
      message: body.message,
      timestamp: new Date().toISOString()
    });

    // TODO: Send email notification
    // Example: Use nodemailer, SendGrid, or similar service
    /*
    await sendEmail({
      to: 'bookings@barbudaleisure.com',
      subject: `New Booking Request - ${tour}`,
      body: `
        Name: ${name}
        Email: ${email}
        Phone: ${body.phone || 'N/A'}
        Tour: ${tour}
        Date: ${date}
        Guests: ${guests}
        Message: ${body.message || 'N/A'}
      `
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: 'Booking request received successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

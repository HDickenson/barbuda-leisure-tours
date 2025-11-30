# Barbuda Leisure Booking Form

A complete multipage booking form system for Barbuda Leisure Day Tours with conditional field logic based on transport method.

## Features

- ✅ **6-Step Multipage Flow** with progress indicator
- ✅ **Conditional Field Display** - Shows/hides fields based on transport type (air requires passport, sea doesn't)
- ✅ **Dynamic Passenger Management** - Add passengers based on party size with appropriate fields for each
- ✅ **Meal Preference Dropdown** - Clean dropdown interface without brackets
- ✅ **Real-time Price Calculation** - Updates as users select options
- ✅ **3-Day Minimum Booking Window** - Automatically enforced in date picker
- ✅ **6-Month Maximum Advance Booking** - Calendar restricted appropriately
- ✅ **Date Restrictions** - Support for day-of-week and seasonal restrictions (e.g., Excellence Fridays only)
- ✅ **Terms & Conditions** - Full T&C display with required checkboxes
- ✅ **Popup Modal** - Opens as overlay with soft shadow on white background
- ✅ **Offline Processing** - Form submission sends request, staff handles booking manually
- ✅ **Mobile Responsive** - Works on all device sizes

## File Structure

```
app/components/booking/
├── BookingForm.tsx              # Main form container with step management
├── types.ts                     # TypeScript type definitions
├── steps/
│   ├── Step1PartySize.tsx      # Party size & date selection
│   ├── Step2PassengerDetails.tsx # Individual passenger information
│   ├── Step3ContactInfo.tsx    # Contact details and special requests
│   ├── Step4Review.tsx         # Review all information before submission
│   ├── Step5Terms.tsx          # Terms & conditions acceptance
│   └── Step6Confirmation.tsx   # Success message with booking reference
├── ExampleTourPage.tsx         # Example implementation
└── README.md                   # This file

app/api/booking-request/
└── route.ts                    # API endpoint for form submission
```

## Usage

### Basic Implementation

```tsx
import { useState } from 'react'
import { BookingForm } from '@/app/components/booking/BookingForm'
import type { TourConfig } from '@/app/components/booking/types'

export function TourPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const tourConfig: TourConfig = {
    tourType: 'discover-air',
    tourName: 'Discover Barbuda by Air',
    transportMethod: 'air',
    requiresPassport: true,
    requiresBodyWeight: true,
    pricing: {
      adult: 349,
      child: 249,
      infant: 99,
    },
    mealUpgrades: {
      lobster: 15,
      fish: 10,
      conch: 10,
      shrimp: 10,
      vegetarian: 5,
    },
  }

  return (
    <>
      <button onClick={() => setIsBookingOpen(true)}>
        Book Now
      </button>

      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tourConfig={tourConfig}
      />
    </>
  )
}
```

### Tour Configuration Examples

#### Air Transport (Requires Passport)
```tsx
const discoverByAirConfig: TourConfig = {
  tourType: 'discover-air',
  tourName: 'Discover Barbuda by Air',
  transportMethod: 'air',
  requiresPassport: true,
  requiresBodyWeight: true,
  pricing: { adult: 349, child: 249, infant: 99 },
  mealUpgrades: { lobster: 15, fish: 10, conch: 10, shrimp: 10, vegetarian: 5 },
}
```

#### Sea Transport (No Passport Required)
```tsx
const discoverBySeaConfig: TourConfig = {
  tourType: 'discover-sea',
  tourName: 'Discover Barbuda by Sea',
  transportMethod: 'sea',
  requiresPassport: false,
  requiresBodyWeight: false,
  pricing: { adult: 249, child: 199, infant: 99 },
  mealUpgrades: { lobster: 15, fish: 10, conch: 10, shrimp: 10, vegetarian: 5 },
}
```

#### Tour with Date Restrictions (Excellence - Fridays Only)
```tsx
const excellenceConfig: TourConfig = {
  tourType: 'excellence',
  tourName: 'Excellence Barbuda by Sea',
  transportMethod: 'sea',
  requiresPassport: false,
  requiresBodyWeight: false,
  pricing: { adult: 190, child: 120, infant: 0 },
  mealUpgrades: { lobster: 0, fish: 0, conch: 0, shrimp: 0, vegetarian: 0 },
  restrictions: {
    minAge: 5,
    daysOfWeek: [5], // Friday only (0 = Sunday, 5 = Friday)
    seasonStart: new Date('2025-05-01'),
    seasonEnd: new Date('2025-10-31'),
  },
}
```

## Form Steps

### Step 1: Party Size & Date
- Number of adults (13+)
- Number of children (2-12)
- Number of infants (<2)
- Tour date selection (with 3-day minimum, 6-month maximum)
- Real-time price preview

### Step 2: Passenger Details
- Repeated for each passenger based on party size
- **If air/helicopter transport:**
  - First name, last name
  - Gender
  - Date of birth
  - Body weight (lbs)
  - Passport number
  - Passport expiry date
  - Passport issuing country
  - Nationality
  - Meal preference
- **If sea transport:**
  - First name, last name
  - Meal preference

### Step 3: Contact Information
- Email address (required)
- Phone number with country code (required)
- Hotel name (or "Not applicable")
- Special requests/comments (optional)

### Step 4: Review
- Summary of all entered information
- Price breakdown with meal upgrades
- Edit buttons to go back to any previous step

### Step 5: Terms & Conditions
- Full terms and conditions display (scrollable)
- Three required checkboxes:
  - Terms and Conditions agreement
  - 72-hour cancellation policy understanding
  - Liability waiver acknowledgment
- Submit button only enabled when all checked

### Step 6: Confirmation
- Booking reference number
- What happens next explanation
- Contact information
- Close button

## Styling

The form uses Tailwind CSS classes and follows these design principles:

- **Modal**: White background with soft shadow (`shadow-xl`)
- **Progress Bar**: Blue gradient showing current step
- **Buttons**: Rounded full (`rounded-full`) with hover effects
- **Inputs**: Border with focus ring (`focus:ring-2 focus:ring-blue-600`)
- **Colors**: Primary blue (#2563EB), with semantic colors for success/warning/error

### Customization

To match your brand colors, update the following classes:

```tsx
// Primary button color
'bg-blue-600 hover:bg-blue-700' → 'bg-[your-color] hover:bg-[your-darker-color]'

// Progress bar
'bg-blue-600' → 'bg-[your-color]'

// Focus rings
'focus:ring-blue-600' → 'focus:ring-[your-color]'
```

## API Integration

The form submits to `/api/booking-request` as a POST request with the following structure:

```json
{
  "reference": "BL-abc123-XYZ",
  "timestamp": "2025-11-01T12:00:00Z",
  "tour": {
    "tourType": "discover-air",
    "tourName": "Discover Barbuda by Air",
    "transportMethod": "air",
    ...
  },
  "booking": {
    "partySize": { "adults": 2, "children": 1, "infants": 0 },
    "tourDate": "2025-11-15T00:00:00Z",
    "passengers": [...],
    "contactInfo": {...},
    "agreedToTerms": {...}
  }
}
```

### Backend Implementation

Update `app/api/booking-request/route.ts` to:

1. **Validate** incoming data
2. **Store** in database (Sanity CMS, MongoDB, etc.)
3. **Send** confirmation email to customer
4. **Send** notification email to staff
5. **Integrate** with payment processor (Fygaro)

Example with email service:

```tsx
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Send customer confirmation
  await sendEmail({
    to: body.booking.contactInfo.email,
    subject: `Booking Request Confirmed - ${body.reference}`,
    html: generateCustomerEmail(body),
  })

  // Send staff notification
  await sendEmail({
    to: 'bookings@barbudaleisure.com',
    subject: `New Booking Request - ${body.reference}`,
    html: generateStaffEmail(body),
  })

  return NextResponse.json({ success: true, reference: body.reference })
}
```

## Validation Rules

- **Adults**: Minimum 1 required
- **Date**: Must be 3-366 days in future
- **Date Restrictions**: Must match tour's day-of-week and seasonal requirements
- **Email**: Valid email format
- **Phone**: Minimum 10 digits
- **Passport**: Required for air/helicopter transport
- **Passport Expiry**: Must be valid on tour date
- **Body Weight**: Required for air/helicopter, must be > 0
- **Terms**: All three checkboxes must be checked

## Testing

To test the form:

1. Run the development server: `npm run dev`
2. Navigate to a page with the ExampleTourPage component
3. Click "Book Now" on any tour
4. Fill out the form with test data
5. Check browser console for submission payload
6. Verify API endpoint receives correct data structure

## Future Enhancements

- [ ] Save form progress to localStorage (auto-save)
- [ ] Multi-language support (Spanish, French)
- [ ] Real-time availability checking
- [ ] Direct payment integration with Fygaro
- [ ] Email template system for confirmations
- [ ] Admin dashboard for managing booking requests
- [ ] SMS notifications option
- [ ] Calendar integration (Google Calendar, iCal)

## Support

For questions or issues with the booking form, contact the development team.

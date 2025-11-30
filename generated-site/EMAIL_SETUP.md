# Google Workspace Email Setup for Barbuda Leisure

This guide will help you set up email notifications for your booking system using Google Workspace.

## Prerequisites

- Google Workspace account (e.g., bookings@barbudaleisure.com)
- Access to Google Account settings
- Vercel account (for deployment)

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", find "2-Step Verification"
3. Click "Get Started" and follow the prompts
4. Complete the setup (you'll need your phone)

## Step 2: Create an App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - If you don't see this option, make sure 2FA is enabled first
2. Click "Select app" → Choose "Mail"
3. Click "Select device" → Choose "Other (Custom name)"
4. Type: "Barbuda Leisure Website"
5. Click "Generate"
6. Copy the 16-character password shown (format: `xxxx xxxx xxxx xxxx`)
   - **IMPORTANT**: You won't be able to see this password again!
   - Remove the spaces when copying (should be: `xxxxxxxxxxxxxxxx`)

## Step 3: Set Up Local Development

1. In your `generated-site` folder, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   SMTP_USER=bookings@barbudaleisure.com
   SMTP_PASS=xxxxxxxxxxxxxxxx
   ```

3. Test locally:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000/tours/discover-barbuda-by-air
5. Fill out and submit a test booking
6. Check your email inbox for both the notification and customer confirmation

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click "Settings" → "Environment Variables"
4. Add two variables:
   - **Name**: `SMTP_USER`
   - **Value**: `bookings@barbudaleisure.com`
   - Click "Add"

   - **Name**: `SMTP_PASS`
   - **Value**: Your 16-character app password
   - Click "Add"

5. Redeploy your site:
   - Go to "Deployments"
   - Click the three dots (...) on your latest deployment
   - Click "Redeploy"

### Option B: Using Vercel CLI

```bash
cd generated-site
vercel env add SMTP_USER
# Enter: bookings@barbudaleisure.com

vercel env add SMTP_PASS
# Paste your 16-character app password

vercel --prod
```

## Step 5: Verify It Works

1. Visit your live site on Vercel
2. Go to any tour page (e.g., `/tours/discover-barbuda-by-air`)
3. Click "Book This Tour"
4. Fill out the booking form with real information
5. Submit the booking

You should receive:
- ✅ A detailed booking notification email (to your SMTP_USER email)
- ✅ Customer receives a confirmation email

## What Happens When Someone Books?

### Email to You (Business Owner):
- **Subject**: 🎉 New Booking Request - BL-xxxxx-XXX
- **Contains**:
  - Booking reference number
  - Tour details and date
  - Customer contact information
  - All passenger details (names, ages, passport info if provided)
  - Meal preferences
  - Special requests
  - Estimated total cost

### Email to Customer:
- **Subject**: Booking Request Received - [Tour Name] - BL-xxxxx-XXX
- **Contains**:
  - Confirmation their request was received
  - Booking reference number
  - Tour details summary
  - What happens next (you'll contact them within 24 hours)
  - Your contact information

## Email Limits

Google Workspace allows:
- **2,000 emails per day** (rolling 24-hour period)
- This means up to **1,000 bookings per day** (2 emails per booking)
- For most tour businesses, this is more than sufficient

## Troubleshooting

### "Invalid credentials" error
- Make sure you're using the App Password, NOT your regular Google password
- Check that you removed spaces from the app password
- Verify 2FA is enabled on your Google account

### Emails going to spam
- This is rare with Google Workspace
- Ask customers to add your email to their contacts
- Check your Google Workspace domain authentication (SPF, DKIM)

### Not receiving emails
- Check your spam folder
- Verify environment variables are set correctly in Vercel
- Check Vercel function logs for errors
- Test locally first to isolate the issue

### "App Passwords" option not showing
- Enable 2-Factor Authentication first
- Wait 5-10 minutes after enabling 2FA
- Make sure you're signed in to the correct Google account

## Security Best Practices

- ✅ Never commit `.env.local` to git (already in .gitignore)
- ✅ Never share your app password
- ✅ Use different app passwords for different applications
- ✅ Revoke app passwords you're not using
- ✅ Store Vercel environment variables securely

## Need Help?

If you encounter issues:
1. Check the Vercel function logs in your dashboard
2. Test locally first with `npm run dev`
3. Verify your Google Workspace settings
4. Check the `generated-site/app/api/booking-request/route.ts` file for errors

## Email Templates

The system sends beautifully formatted HTML emails with:
- Responsive design that works on mobile and desktop
- Brand colors (cyan #4DD0E1)
- Professional layout
- All booking details clearly organized
- Total cost calculation with meal upgrades

Both emails are automatically sent when a customer submits a booking form!

# Quick Start: Google Workspace Email Setup

## ⚡ 5-Minute Setup

### Step 1: Get Your App Password (3 minutes)

1. **Enable 2FA** (if not already on):
   - Visit: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Create App Password**:
   - Visit: https://myaccount.google.com/apppasswords
   - App: "Mail"
   - Device: "Other" → Type "Barbuda Website"
   - Click **Generate**
   - Copy the 16-character code (like: `abcd efgh ijkl mnop`)

### Step 2: Add to Vercel (2 minutes)

1. Go to your Vercel dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add these two variables:

   ```
   SMTP_USER = bookings@barbudaleisure.com
   SMTP_PASS = abcdefghijklmnop (your 16-char code, no spaces)
   ```

4. Click **Save**
5. **Redeploy** your site

### Step 3: Test It! ✅

1. Visit your live Vercel site
2. Go to any tour page
3. Click "Book This Tour"
4. Fill out the form and submit
5. Check your email - you should get:
   - ✅ A booking notification (detailed)
   - ✅ Customer gets confirmation email

## 🎉 That's It!

Your booking system is now live and will:
- Send you detailed booking notifications
- Send customers beautiful confirmation emails
- Handle up to 2,000 emails/day (1,000 bookings)

## 📧 What You'll Receive

**Every booking sends 2 emails:**

1. **To You** - Full booking details:
   - Customer contact info
   - All passenger details
   - Passport info (if required)
   - Meal preferences
   - Special requests
   - Total cost breakdown

2. **To Customer** - Confirmation:
   - Booking reference number
   - Tour details
   - What happens next
   - Your contact info

## 🔒 Security Notes

- Use App Password (NOT your regular password)
- Never share your app password
- Never commit `.env.local` to git
- Store passwords securely in Vercel only

## ❓ Issues?

See the full guide: [EMAIL_SETUP.md](./EMAIL_SETUP.md)

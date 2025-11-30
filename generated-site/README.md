# Barbuda Leisure Day Tours - Next.js

Modern, fully-functional Next.js site with integrated booking system and email notifications.

## Live Site

**Production URL:** https://generated-site-one.vercel.app

- Modern tours and blog pages with booking functionality
- WordPress replica pages available at `/original/*`
- All pages deployed as static HTML (except API routes)

## Quick Links

- 🏖️ [Tours](https://generated-site-one.vercel.app/tours) - 10 curated day tours
- 📝 [Blog](https://generated-site-one.vercel.app/blog) - Travel guides and tips
- 📧 [Email Setup Guide](./GOOGLE_WORKSPACE_QUICKSTART.md) - 5-minute setup
- 🚀 [Deployment Checklist](./VERCEL_DEPLOYMENT_CHECKLIST.md) - Testing guide

## Source

- **Original Site:** https://www.barbudaleisure.com/
- **Migration Date:** 2025-10-30
- **Last Updated:** 2025-11-01

## Site Structure

### Active Pages (26 total)

**Modern Tours System (12 pages)** ⭐
- `/tours/` - Tours landing page with category filtering
- `/tours/[slug]` - Dynamic template generating 10 tour detail pages:
  - **Signature Tours:** discover-barbuda-by-air, discover-barbuda-by-sea, barbuda-sky-sea-adventure, barbuda-beach-escape
  - **Local Tours:** already-in-barbuda
  - **Shared Adventures:** shared-boat-charter, excellence-barbuda-by-sea
  - **Private Charters:** yacht-adventure, helicopter-adventure, airplane-adventure

**Modern Blog System (4 pages)** ⭐
- `/blog/` - Blog landing page with article grid
- `/blog/[slug]` - Dynamic template generating 3 blog articles:
  - discover-the-enchanting-island-of-barbuda
  - top-5-things-to-do-in-barbuda
  - barbuda-vs-antigua-which-island-to-visit

**WordPress Replicas (6 pages)**
- `/original/` - Homepage replica
- `/original-about/` - About page replica
- `/original-blog/` - Blog listing replica
- `/original-faq/` - FAQ page replica
- `/original-reviews/` - Reviews page replica
- `/original-tours/` - Tours listing replica

**API Routes**
- `/api/booking-request` - Handles booking form submissions and email notifications

**Root**
- `/` - Homepage (redirects to `/original/`)

## Features

### ✅ Booking System
- Multi-step booking form (6 steps)
- Passenger details collection (passport, weight, meal preferences)
- Email notifications via Google Workspace SMTP
- Beautiful HTML email templates
- Sends to both business owner and customer

### ✅ Tours System
- 10 professionally curated tours
- Dynamic pricing (adults, children, infants)
- Meal upgrade options (lobster, fish, conch, etc.)
- Transport method tracking (air, sea, helicopter, yacht, etc.)
- Category filtering (signature, local, shared, private)
- Integrated booking button on each tour

### ✅ Blog System
- 3 quality travel articles
- SEO-optimized content
- Category and tag support
- Reading time estimates
- Author attribution

### ✅ Design System
- On-brand colors: Cyan (#4DD0E1), Pink (#FF6B9D), Dark (#263238)
- Leckerli One font for headings
- Wave dividers and gradients
- Responsive mobile-first design
- Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm package manager

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Environment Variables (for Email)

Copy the example file and add your Google Workspace credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:
```env
SMTP_USER=bookings@barbudaleisure.com
SMTP_PASS=your-google-app-password
```

See [GOOGLE_WORKSPACE_QUICKSTART.md](./GOOGLE_WORKSPACE_QUICKSTART.md) for detailed setup instructions.

### Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Booking Form Locally

1. Ensure `.env.local` is configured with valid credentials
2. Run `npm run dev`
3. Go to http://localhost:3000/tours/discover-barbuda-by-air
4. Click "Book This Tour"
5. Fill out the form and submit
6. Check your email inbox for both notification and confirmation emails

## Build for Production

### Build Command

```bash
npm run build
```

This generates:
- 26 static HTML pages
- Optimized images and assets
- Server-side API route for booking

### Preview Production Build

```bash
npm start
```

Opens at http://localhost:3000

## Deploy to Vercel

### Current Deployment

- **Project:** harolds-projects-3adae873/generated-site
- **Production URL:** https://generated-site-one.vercel.app
- **Deployment Status:** ✅ Ready
- **Last Deploy:** 2025-11-01

### Environment Variables (Required for Email)

Add these to Vercel Dashboard → Settings → Environment Variables:

```
SMTP_USER = bookings@barbudaleisure.com
SMTP_PASS = your-google-app-password
```

See [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md) for setup guide.

### Deploy via Git Push

```bash
git add .
git commit -m "Your changes"
git push origin master
```

Vercel automatically deploys on push to master.

### Deploy via CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to production
vercel --prod
```

## Project Structure

```
generated-site/
├── app/                          # Next.js App Router
│   ├── (standalone)/            # WordPress replica pages
│   ├── api/                     # API routes
│   │   └── booking-request/    # Email notification endpoint
│   ├── blog/                   # Modern blog system
│   │   ├── [slug]/            # Dynamic blog articles (3)
│   │   └── page.tsx           # Blog listing
│   ├── tours/                  # Modern tours system
│   │   ├── [slug]/            # Dynamic tour pages (10)
│   │   │   ├── page.tsx       # SSG route
│   │   │   └── TourDetailClient.tsx  # Client component
│   │   └── page.tsx           # Tours listing
│   ├── components/            # Shared components
│   │   ├── booking/          # Multi-step booking form
│   │   ├── sections/         # Page sections
│   │   └── widgets/          # Reusable widgets
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Root redirect
├── components/                 # Legacy React components
├── data/                      # Static data (JSON)
│   ├── tours-converted.ts    # 10 tour definitions
│   └── articles-converted.ts # 3 blog articles
├── public/                    # Static assets
│   ├── images/               # 136+ optimized images
│   └── css/                  # Elementor CSS (replica pages)
├── .env.local.example        # Environment template
├── EMAIL_SETUP.md            # Detailed email setup guide
├── GOOGLE_WORKSPACE_QUICKSTART.md  # Quick setup (5 min)
├── VERCEL_DEPLOYMENT_CHECKLIST.md  # Testing checklist
├── next.config.js            # Next.js configuration
├── vercel.json               # Vercel deployment config
└── package.json              # Dependencies
```

## Technologies

- **Next.js 15.5.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Nodemailer** - Email sending
- **Google Workspace SMTP** - Email delivery (2,000/day limit)
- **Vercel** - Hosting and deployment

## Data Architecture

### No CMS Required ✨
- All tour data: `data/tours-converted.ts`
- All blog data: `data/articles-converted.ts`
- Static generation at build time
- No database, no Sanity, no WordPress API
- Easy to update - just edit TypeScript files

### Tour Data Structure
```typescript
interface Tour {
  slug: string
  title: string
  subtitle: string
  description: string
  heroImage: string
  duration: string
  price: string
  priceDetails: { adult, child, infant }
  transport: string
  difficulty: string
  category: 'signature' | 'local' | 'shared' | 'private'
  highlights: string[]
  included: string[]
  importantInfo: string[]
  badge?: string
  requiresPassport?: boolean
  requiresBodyWeight?: boolean
  mealUpgrades?: {...}
}
```

### Blog Data Structure
```typescript
interface Article {
  slug: string
  title: string
  excerpt: string
  content: string (HTML)
  featuredImage?: string
  category?: string
  tags?: string[]
  author: string
  authorBio?: string
  publishedDate: string
  readTime?: number
}
```

## Email System

### How It Works
1. Customer fills out booking form on any tour page
2. Form submits to `/api/booking-request`
3. API route sends 2 emails via Google Workspace SMTP:
   - **To Business Owner:** Full booking details, passenger info, total cost
   - **To Customer:** Confirmation with booking reference, next steps
4. Both emails use beautiful HTML templates with brand styling

### Email Templates
- Responsive design (mobile + desktop)
- Brand colors and fonts
- Professional layout
- Passenger details organized
- Cost breakdown included
- Booking reference tracking

### Setup Required
See [GOOGLE_WORKSPACE_QUICKSTART.md](./GOOGLE_WORKSPACE_QUICKSTART.md) for 5-minute setup.

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Preview production build
npm run lint      # Run Biome linter
npm run format    # Format code with Biome
npm run check     # Check code quality
```

## Documentation

- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Comprehensive email setup guide
- [GOOGLE_WORKSPACE_QUICKSTART.md](./GOOGLE_WORKSPACE_QUICKSTART.md) - 5-minute quick start
- [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md) - Deployment testing guide
- [VERCEL_DEPLOYMENT_COMPLETE.md](../VERCEL_DEPLOYMENT_COMPLETE.md) - Full deployment report
- [ERROR_VERIFICATION_COMPLETE.md](../ERROR_VERIFICATION_COMPLETE.md) - Error verification
- [TOURS_BLOG_IMAGES_RESOLVED.md](../TOURS_BLOG_IMAGES_RESOLVED.md) - Image resolution

## Deployment Checklist

Before going live:
- [ ] Build succeeds locally (`npm run build`)
- [ ] All 26 pages render correctly
- [ ] Add `SMTP_USER` to Vercel environment variables
- [ ] Add `SMTP_PASS` to Vercel environment variables
- [ ] Test booking form submission
- [ ] Verify owner receives booking email
- [ ] Verify customer receives confirmation email
- [ ] Check mobile responsiveness
- [ ] Test all tour pages
- [ ] Test all blog pages

## Support & Troubleshooting

### Email Not Sending?
1. Verify environment variables in Vercel
2. Check you're using App Password (not regular password)
3. Review Function Logs in Vercel dashboard
4. See [EMAIL_SETUP.md](./EMAIL_SETUP.md) troubleshooting section

### Build Failing?
1. Check Vercel build logs
2. Verify all dependencies installed
3. Try clearing cache: Vercel Dashboard → Deployments → Redeploy

### Tours/Blog Not Showing?
1. Verify data files: `data/tours-converted.ts` and `data/articles-converted.ts`
2. Check images exist in `/public/images/`
3. Review build logs for errors

### Need Help?
- Check Vercel logs: `vercel logs [url]`
- Inspect deployment: `vercel inspect [url]`
- Review documentation files above

## License

Private - Barbuda Leisure Day Tours

---

**Built with ❤️ using Next.js and Claude Code**

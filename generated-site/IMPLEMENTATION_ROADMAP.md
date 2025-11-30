# IMPLEMENTATION ROADMAP
**Project**: Barbuda Leisure Tours - Production Readiness  
**Timeline**: 3-5 days  
**Current Status**: 🟡 Security remediation required before proceeding  

---

## OVERVIEW

Based on comprehensive audits (CODE_REVIEW_REPORT.md, DEVOPS_AUDIT_REPORT.md), this roadmap provides a structured approach to make the site production-ready.

**Current Scores**:
- Code Quality: 6.5/10
- Production Readiness: 🔴 NOT READY
- Security: 🔴 CRITICAL (exposed tokens)
- Performance: 🟡 NEEDS IMPROVEMENT (73 MB build)

---

## PHASE 1: CRITICAL SECURITY FIXES (Day 1 - 4 hours)
**Status**: 🔴 BLOCKING - Must complete before any other work

### 1.1 Git History Cleanup ⚠️ DESTRUCTIVE
**Decision Required**: Choose ONE approach

#### Option A: Filter-Branch (Preserves commits)
```powershell
cd C:\Users\harol\projects\Barbuda\bl-new-site\generated-site

# Backup
git branch backup-$(Get-Date -Format "yyyyMMdd-HHmmss")

# Remove sensitive files from ALL commits
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch .env.production .env.vercel" `
  --prune-empty --tag-name-filter cat -- --all

# Cleanup
Remove-Item .git/refs/original -Recurse -Force
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (⚠️ notify team first)
git push origin --force --all
```

#### Option B: Orphan Branch (Clean slate) ⭐ RECOMMENDED
```powershell
# Create clean branch
git checkout --orphan clean-master
git add -A
git commit -m "chore: initial commit with clean history (removed exposed secrets)"

# Backup and switch
git branch -m master master-old-$(Get-Date -Format "yyyyMMdd")
git branch -m clean-master master

# Push
git push origin master --force
```

### 1.2 Environment Variable Security ✅ COMPLETED
- [x] Update `.gitignore` to exclude `.env*` files
- [ ] Create `.env.example` template
- [ ] Delete backed up sensitive files after git cleanup

### 1.3 Token Expiry/Revocation
**Good News**: OIDC tokens auto-expire in ~12 hours (already expired by now)
- [ ] Verify tokens expired (check Vercel dashboard)
- [ ] Regenerate tokens via `vercel env pull` if needed
- [ ] Store tokens only in Vercel dashboard (not in files)

### 1.4 npm Security Audit
```powershell
# Run audit
npm audit

# Fix automatically where possible
npm audit fix

# Force fix breaking changes
npm audit fix --force

# Document remaining vulnerabilities
npm audit report > npm-vulnerabilities-$(Get-Date -Format "yyyyMMdd").txt
```

**Expected Fixes**:
- `glob`: Update to latest secure version
- `valibot`: Update or find alternative
- `body-parser`, `js-yaml`: Update dependencies

---

## PHASE 2: PERFORMANCE OPTIMIZATION (Day 2 - 6 hours)
**Status**: 🟡 HIGH PRIORITY (73.71 MB → target <20 MB)

### 2.1 Image Optimization
**Current**: 52.65 MB images (43.30 MB in `public/images/`)

#### Create Image Optimization Script
```javascript
// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const optimizeImage = async (filePath) => {
  const ext = filePath.split('.').pop().toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return;

  try {
    const metadata = await sharp(filePath).metadata();
    
    // Resize if too large
    let transformer = sharp(filePath);
    if (metadata.width > 2400) {
      transformer = transformer.resize(2400, null, { withoutEnlargement: true });
    }

    // Convert to WebP with quality 80
    await transformer
      .webp({ quality: 80 })
      .toFile(filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    console.log(`✅ Optimized: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed: ${filePath}`, error.message);
  }
};

// Run optimization
const imagesDir = 'public/images';
// ... walk directory and optimize all images
```

**Actions**:
- [ ] Install Sharp: `npm install --save-dev sharp`
- [ ] Create optimization script
- [ ] Run: `node scripts/optimize-images.mjs`
- [ ] Remove original JPG/PNG files, keep WebP only
- [ ] Remove `-scaled` duplicate images (13.04 MB savings)
- [ ] Update `<Image>` components to use `.webp` sources

**Expected Result**: 52.65 MB → ~12 MB (77% reduction)

### 2.2 Code Splitting
```typescript
// app/tours/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const TourCard = dynamic(() => import('@/components/TourCard'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-2xl" />
});

const CategorySection = dynamic(() => import('@/components/CategorySection'));
```

### 2.3 Bundle Analysis
```powershell
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Update next.config.ts
# ... add analyzer config

# Build and analyze
ANALYZE=true npm run build
```

**Target**: Main bundle < 200 KB (current: 460 KB)

---

## PHASE 3: CODE QUALITY IMPROVEMENTS (Day 3 - 8 hours)
**Status**: 🟡 MEDIUM PRIORITY

### 3.1 Dynamic Tour Routes ✅ VERIFIED WORKING
The `app/tours/[slug]/page.tsx` dynamic route already exists.
- [ ] Test all 10 tour routes work
- [ ] Verify `generateStaticParams()` exports all slugs
- [ ] Check metadata generation for SEO

### 3.2 Booking API Endpoint
```typescript
// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate input
    const { name, email, phone, tourId, date, guests } = data;
    if (!name || !email || !tourId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.BOOKING_EMAIL,
      subject: `New Booking: ${tourId}`,
      html: `<h2>Booking Request</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Tour:</strong> ${tourId}</p>
             <p><strong>Date:</strong> ${date}</p>
             <p><strong>Guests:</strong> ${guests}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Booking failed' },
      { status: 500 }
    );
  }
}
```

**Actions**:
- [ ] Create `app/api/booking/route.ts`
- [ ] Install nodemailer: `npm install nodemailer @types/nodemailer`
- [ ] Add SMTP credentials to Vercel environment variables
- [ ] Test booking flow end-to-end

### 3.3 Replace `<img>` with `<Image>`
**Found**: 47 instances of `<img>` tags across components

```powershell
# Find all img tags
Select-String -Pattern "<img" -Path .\app\**\*.tsx,.\components\**\*.tsx -CaseSensitive
```

**Actions**:
- [ ] Replace in `TourCard` component
- [ ] Replace in hero sections
- [ ] Replace in testimonial avatars
- [ ] Add proper `width`/`height` props for Next.js Image
- [ ] Set `sizes` attribute for responsive images

### 3.4 Fix Key Props
**Issue**: Using `key={idx}` instead of stable identifiers

```typescript
// ❌ Bad
{tours.map((tour, idx) => <TourCard key={idx} tour={tour} />)}

// ✅ Good
{tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
```

**Actions**:
- [ ] Search for `key={` patterns
- [ ] Replace with stable IDs (tour.id, tour.slug)
- [ ] Ensure all list items have unique keys

---

## PHASE 4: ACCESSIBILITY & UX (Day 4 - 4 hours)
**Status**: 🟢 LOW PRIORITY (can defer to post-launch)

### 4.1 Error Boundaries
```typescript
// components/ErrorBoundary.tsx
'use client';
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <button onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 4.2 Loading States
```typescript
// app/tours/loading.tsx
export default function ToursLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
            <div className="bg-gray-200 h-6 rounded mb-2" />
            <div className="bg-gray-200 h-4 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4.3 ARIA Labels & Semantic HTML
- [ ] Add `aria-label` to icon buttons
- [ ] Use `<nav>` for navigation
- [ ] Add `role="banner"` to header
- [ ] Add skip-to-content link

---

## PHASE 5: DEPLOYMENT PREPARATION (Day 5 - 3 hours)
**Status**: 🟢 READY TO START after Phase 1-2 complete

### 5.1 Deployment Config Files

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

#### `robots.txt` (public/)
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://barbudaleisuretours.com/sitemap.xml
```

#### `sitemap.xml` (public/)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://barbudaleisuretours.com/</loc><priority>1.0</priority></url>
  <url><loc>https://barbudaleisuretours.com/tours</loc><priority>0.9</priority></url>
  <url><loc>https://barbudaleisuretours.com/about</loc><priority>0.8</priority></url>
  <!-- Add all tour pages -->
</urlset>
```

### 5.2 Environment Variables Setup
```powershell
# Set via Vercel CLI (DO NOT commit to git)
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
vercel env add NEXT_PUBLIC_SANITY_DATASET production
vercel env add SANITY_API_TOKEN production
vercel env add SMTP_HOST production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add BOOKING_EMAIL production
```

### 5.3 Pre-Deployment Checklist
- [ ] Build succeeds locally: `npm run build`
- [ ] All tests pass: `npm test`
- [ ] No console errors in production build
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] Test on staging: `vercel --prod=false`
- [ ] Verify all 10 tour pages load
- [ ] Test booking form submission
- [ ] Check responsive design on mobile/tablet
- [ ] Verify analytics integration

---

## GIT WORKFLOW

### Branch Strategy
```powershell
# Main development branch
git checkout -b develop

# Feature branches
git checkout -b feature/security-fixes
git checkout -b feature/performance-optimization
git checkout -b feature/booking-api
git checkout -b feature/accessibility-improvements

# Release branch
git checkout -b release/v1.0.0
```

### Commit Message Convention
```
type(scope): subject

[optional body]

[optional footer]
```

**Types**: 
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance
- `docs`: Documentation
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Testing
- `security`: Security fix

**Examples**:
```
security(git): remove exposed Vercel tokens from history
perf(images): optimize tour images with WebP (52MB -> 12MB)
feat(api): add booking endpoint with email notifications
fix(tours): replace <img> with Next.js Image component
```

### Pull Request Template
```markdown
## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] Security fix
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update

## Testing
<!-- How was this tested? -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Build succeeds
```

---

## MONITORING & ROLLBACK

### Post-Deployment Monitoring
```powershell
# Monitor Vercel deployment logs
vercel logs https://barbudaleisuretours.com --follow

# Check for errors
vercel logs --filter=error --since=1h

# Monitor performance
# Use Vercel Analytics dashboard
```

### Rollback Strategy
```powershell
# List deployments
vercel ls barbudaleisuretours

# Rollback to previous deployment
vercel rollback [deployment-url]

# Or via Vercel dashboard: Settings > Deployments > Rollback
```

---

## SUCCESS METRICS

### Phase 1 Success Criteria ✅
- [ ] No sensitive files in git history
- [ ] All OIDC tokens expired/revoked
- [ ] npm audit shows 0 high/critical vulnerabilities
- [ ] `.gitignore` configured correctly

### Phase 2 Success Criteria
- [ ] Build size < 25 MB (down from 73 MB)
- [ ] Image size < 15 MB (down from 52 MB)
- [ ] Main JS bundle < 200 KB (down from 460 KB)
- [ ] Lighthouse Performance score > 80

### Phase 3 Success Criteria
- [ ] All tours accessible via `/tours/[slug]`
- [ ] Booking API functional with email notifications
- [ ] Zero `<img>` tags (all using Next.js Image)
- [ ] No console warnings in production

### Phase 4 Success Criteria
- [ ] Lighthouse Accessibility score > 90
- [ ] Error boundaries on all pages
- [ ] Loading states for async operations
- [ ] Keyboard navigation works

### Phase 5 Success Criteria
- [ ] Site deployed to https://barbudaleisuretours.com
- [ ] SSL certificate valid
- [ ] All environment variables configured
- [ ] Monitoring/analytics active
- [ ] Backup/rollback strategy tested

---

## TIMELINE SUMMARY

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| 1. Security | 4 hours | 🔴 CRITICAL | ⏳ In Progress |
| 2. Performance | 6 hours | 🟡 HIGH | ⏸️ Blocked |
| 3. Code Quality | 8 hours | 🟡 MEDIUM | ⏸️ Blocked |
| 4. Accessibility | 4 hours | 🟢 LOW | ⏸️ Deferred |
| 5. Deployment | 3 hours | 🟢 LOW | ⏸️ Blocked |
| **TOTAL** | **25 hours** | | **4%** |

---

## NEXT IMMEDIATE ACTIONS

1. **DECIDE**: Choose git history cleanup strategy (Option A or B)
2. **EXECUTE**: Run chosen cleanup script
3. **VERIFY**: Check git history is clean
4. **PROCEED**: Move to npm audit fixes
5. **COMMIT**: Push cleaned master branch to GitHub

**Blocked until Phase 1 completes**: All other phases depend on security fixes.

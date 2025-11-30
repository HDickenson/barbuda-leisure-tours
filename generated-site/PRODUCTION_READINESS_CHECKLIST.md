# PRODUCTION READINESS CHECKLIST
**Quick reference for tracking progress toward production deployment**

---

## 🔴 PHASE 1: CRITICAL SECURITY (BLOCKING)

### Git History Cleanup
- [ ] Review `SECURITY_REMEDIATION_PLAN.md`
- [ ] Backup sensitive files (`.env.production.backup`, `.env.vercel.backup`) ✅
- [ ] Run `scripts/cleanup-git-history.ps1`
- [ ] Verify: `git log --all --full-history -- .env.production .env.vercel` returns nothing
- [ ] Force push to GitHub: `git push origin master --force`
- [ ] Delete backup files after verification

### npm Vulnerabilities
- [ ] Run `npm audit`
- [ ] Run `npm audit fix`
- [ ] Run `npm audit fix --force` (if needed)
- [ ] Verify: `npm audit` shows 0 high/critical vulnerabilities
- [ ] Test build: `npm run build` succeeds

### Security Headers
- [ ] Add headers to `next.config.ts`:
  - [ ] X-Frame-Options: DENY
  - [ ] X-Content-Type-Options: nosniff
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
  - [ ] Permissions-Policy
- [ ] Test locally and verify headers in browser DevTools

### Environment Variables
- [ ] Create `.env.local` from `.env.example` ✅
- [ ] Never commit `.env*` files (verify `.gitignore`) ✅
- [ ] Set production variables in Vercel dashboard only

---

## 🟡 PHASE 2: PERFORMANCE OPTIMIZATION

### Image Optimization
- [ ] Install Sharp: `npm install --save-dev sharp`
- [ ] Create `scripts/optimize-images.mjs`
- [ ] Convert all JPG/PNG → WebP (quality 80)
- [ ] Remove `-scaled` duplicate images (13 MB)
- [ ] Resize images > 2400px width
- [ ] Update `<Image>` src to use `.webp`
- [ ] **Target**: 52 MB → 12 MB images

### Code Splitting
- [ ] Add dynamic import for `TourCard`
- [ ] Add loading skeletons
- [ ] Lazy load `CategorySection`
- [ ] Defer gallery components
- [ ] **Target**: 460 KB → 200 KB main bundle

### Bundle Analysis
- [ ] Install: `npm install --save-dev @next/bundle-analyzer`
- [ ] Configure in `next.config.ts`
- [ ] Run: `ANALYZE=true npm run build`
- [ ] Identify and optimize large dependencies
- [ ] **Target**: 73 MB → 25 MB total build

---

## 🟢 PHASE 3: CODE QUALITY IMPROVEMENTS

### Booking API
- [ ] Create `app/api/booking/route.ts`
- [ ] Install nodemailer: `npm install nodemailer @types/nodemailer`
- [ ] Configure SMTP settings (use Gmail App Password)
- [ ] Add form validation (name, email, phone, tourId required)
- [ ] Test email delivery end-to-end
- [ ] Add error handling and logging

### Replace <img> with <Image>
- [ ] Search: `Select-String -Pattern "<img" -Path .\app\**\*.tsx,.\components\**\*.tsx`
- [ ] Replace 47 instances with Next.js `<Image>`
- [ ] Add proper `width` and `height` props
- [ ] Set `sizes` attribute for responsive images
- [ ] Test all images load correctly

### Fix Key Props
- [ ] Find: `key={idx}` or `key={i}`
- [ ] Replace with stable IDs: `key={tour.id}` or `key={tour.slug}`
- [ ] Verify no duplicate keys in lists
- [ ] Test dynamic rendering

### Verify Dynamic Routes
- [ ] Test all 10 tour detail pages: `/tours/[slug]`
- [ ] Check `generateStaticParams()` exports all slugs
- [ ] Verify metadata (title, description) for SEO
- [ ] Test 404 page for invalid slugs

### Add Error Boundaries
- [ ] Create `components/ErrorBoundary.tsx`
- [ ] Wrap tour pages in error boundary
- [ ] Add error logging (console or Sentry)
- [ ] Test error scenarios (invalid data, network failure)

---

## 🟢 PHASE 4: ACCESSIBILITY & UX

### Loading States
- [ ] Create `app/tours/loading.tsx`
- [ ] Add Suspense boundaries
- [ ] Implement skeleton loaders
- [ ] Test loading behavior

### ARIA Labels
- [ ] Add `aria-label` to icon buttons
- [ ] Add `aria-describedby` to form fields
- [ ] Use semantic HTML (`<nav>`, `<main>`, `<footer>`)
- [ ] Add skip-to-content link
- [ ] Verify focus order with Tab key

### Accessibility Audit
- [ ] Run Lighthouse audit (Accessibility)
- [ ] Fix issues flagged by Lighthouse
- [ ] Test with screen reader (NVDA on Windows)
- [ ] **Target**: Lighthouse Accessibility > 90

---

## 🟢 PHASE 5: DEPLOYMENT PREPARATION

### Deployment Config Files
- [ ] Create `vercel.json`:
  - [ ] Security headers
  - [ ] Cache headers for images
  - [ ] Redirects (if needed)
- [ ] Create `public/robots.txt`
- [ ] Generate `public/sitemap.xml` (all pages)
- [ ] Create `.nvmrc` with Node version: `20`

### Environment Variables (Vercel Dashboard)
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] `NEXT_PUBLIC_SANITY_DATASET`
- [ ] `SANITY_API_TOKEN`
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `BOOKING_EMAIL`

### Pre-Deployment Testing
- [ ] Build locally: `npm run build`
- [ ] Test all routes work
- [ ] Verify no console errors
- [ ] Run Lighthouse audit (all metrics)
- [ ] Test booking form submission
- [ ] Check responsive design (mobile/tablet)

### Deploy to Staging
- [ ] Run: `vercel --prod=false`
- [ ] Test staging URL
- [ ] Verify environment variables
- [ ] Check Vercel logs for errors
- [ ] Test all functionality on staging

### Production Deployment
- [ ] Final review of all changes
- [ ] Run: `vercel --prod`
- [ ] Monitor deployment logs
- [ ] Test production URL
- [ ] Verify SSL certificate
- [ ] Set up monitoring/analytics

---

## VERIFICATION CHECKLIST

### Security ✅
- [ ] No sensitive files in git history
- [ ] npm audit: 0 high/critical vulnerabilities
- [ ] Security headers present in HTTP response
- [ ] Environment variables only in Vercel dashboard

### Performance ✅
- [ ] Build size < 25 MB
- [ ] Image size < 15 MB
- [ ] Main bundle < 200 KB
- [ ] Lighthouse Performance > 80
- [ ] Page load < 2 seconds

### Functionality ✅
- [ ] All 10 tour pages load correctly
- [ ] Booking form sends emails
- [ ] Navigation works (header, footer)
- [ ] Responsive on mobile/tablet
- [ ] No console errors in production build

### Accessibility ✅
- [ ] Lighthouse Accessibility > 90
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### SEO ✅
- [ ] Lighthouse SEO > 90
- [ ] Meta tags on all pages
- [ ] `robots.txt` present
- [ ] `sitemap.xml` present
- [ ] Canonical URLs set

---

## TIMELINE ESTIMATE

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Security | 4 hours | ⏳ In Progress |
| Phase 2: Performance | 6 hours | ⏸️ Blocked |
| Phase 3: Code Quality | 8 hours | ⏸️ Blocked |
| Phase 4: Accessibility | 4 hours | ⏸️ Deferred |
| Phase 5: Deployment | 3 hours | ⏸️ Blocked |
| **TOTAL** | **25 hours** | **4% Complete** |

---

## QUICK COMMANDS

```powershell
# Security: Clean git history
cd C:\Users\harol\projects\Barbuda\bl-new-site\generated-site
.\scripts\cleanup-git-history.ps1

# Security: Fix npm vulnerabilities
npm audit fix && npm audit fix --force

# Performance: Install Sharp
npm install --save-dev sharp

# Performance: Bundle analysis
npm install --save-dev @next/bundle-analyzer
$env:ANALYZE="true"; npm run build

# Code Quality: Find <img> tags
Select-String -Pattern "<img" -Path .\app\**\*.tsx,.\components\**\*.tsx

# Code Quality: Install nodemailer
npm install nodemailer @types/nodemailer

# Deployment: Test build
npm run build

# Deployment: Deploy to staging
vercel --prod=false

# Deployment: Deploy to production
vercel --prod
```

---

## ROLLBACK PLAN (If Things Go Wrong)

### Git Cleanup Failed
```powershell
# Restore from backup
git checkout master-old-backup-TIMESTAMP
git branch -D master
git checkout -b master
```

### Build Breaks After npm Update
```powershell
# Restore package.json
git checkout HEAD~1 -- package.json package-lock.json
npm install
```

### Deployment Fails
```powershell
# Rollback to previous deployment
vercel rollback [previous-deployment-url]

# Or via Vercel dashboard: Settings > Deployments > Rollback
```

---

## RESOURCES

### Documentation
- `PRODUCTION_READINESS_COMPLETE_ANALYSIS.md` - Full analysis (this document's parent)
- `SECURITY_REMEDIATION_PLAN.md` - Security fix details
- `IMPLEMENTATION_ROADMAP.md` - 5-phase development plan
- `CODE_REVIEW_REPORT.md` - 28 code issues identified
- `DEVOPS_AUDIT_REPORT.md` - Infrastructure analysis
- `DEPLOYMENT_AUDIT_REPORT.md` - Production readiness

### Tools
- `scripts/cleanup-git-history.ps1` - Automated git cleanup
- `scripts/optimize-images.mjs` - Image optimization (to be created)
- `test-tours-page.mjs` - Automated page testing

### External Links
- [Vercel Dashboard](https://vercel.com/harolds-projects-3adae873/generated-site)
- [GitHub Repo](https://github.com/HDickenson/bl-new-site)
- [Next.js Docs](https://nextjs.org/docs)
- [Sanity CMS](https://www.sanity.io/manage)

---

**Last Updated**: 2025-01-31  
**Next Review**: After Phase 1 completion  
**Status**: 🔴 AWAITING GIT CLEANUP EXECUTION

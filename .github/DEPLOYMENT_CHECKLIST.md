# Pre-Deployment Checklist

## Purpose
This checklist ensures that deployments are complete, accurate, and match expected quality before going live. Use this checklist EVERY TIME before deploying to production.

---

## Phase 1: Technical Verification

### Build & Compilation
- [ ] `npm run build` succeeds without errors
- [ ] No TypeScript errors in output
- [ ] No ESLint warnings (or all documented and approved)
- [ ] All pages generate successfully
- [ ] Build output shows expected number of pages

### Code Quality
- [ ] All environment variables are configured
- [ ] No console.log statements in production code
- [ ] No TODO comments for critical features
- [ ] Error boundaries are in place
- [ ] Loading states are implemented

### Dependencies
- [ ] No peer dependency warnings
- [ ] All packages are compatible versions
- [ ] No security vulnerabilities (run `npm audit`)
- [ ] Lock file is committed

---

## Phase 2: Content Verification

### Data Source
- [ ] If using CMS: Verify content is pulling from correct source (Sanity/etc)
- [ ] If using static data: Verify data files are up to date
- [ ] All data models/schemas are defined
- [ ] Sample queries work and return expected data

### Content Completeness
- [ ] Homepage has ALL sections from original design:
  - [ ] Hero section with tagline
  - [ ] Featured tours/products showcase
  - [ ] About/Why Choose Us section
  - [ ] Testimonials/Reviews
  - [ ] Blog highlights
  - [ ] CTA sections
- [ ] All tour pages have complete information
- [ ] All blog posts have content and images
- [ ] Contact information is accurate
- [ ] About page has full content
- [ ] FAQ page has all questions

### Content Quality
- [ ] No placeholder text (lorem ipsum, "Coming soon", etc)
- [ ] All copy is proofread
- [ ] All prices are correct
- [ ] Contact information is accurate
- [ ] Links go to correct destinations
- [ ] Email addresses and phone numbers are correct

---

## Phase 3: Visual Verification

### Design Fidelity
- [ ] Compare homepage to original design/site side-by-side
- [ ] Colors match brand guidelines
- [ ] Fonts are correct (specified fonts, not fallbacks)
- [ ] Spacing and layout match design
- [ ] Images are high quality (not pixelated)
- [ ] Logo displays correctly

### Typography
- [ ] Heading fonts load correctly
- [ ] Body fonts load correctly
- [ ] Font weights are correct (bold, regular, light)
- [ ] Font sizes match design at all breakpoints
- [ ] Line heights are readable

### Images & Media
- [ ] All images load successfully
- [ ] Images are optimized (WebP/AVIF)
- [ ] No broken image links
- [ ] Images have proper alt text
- [ ] Images are correctly sized (not stretched/distorted)
- [ ] Lazy loading works for images below fold

### Responsiveness
- [ ] Desktop view (1920px, 1440px, 1280px)
- [ ] Tablet view (768px, 1024px)
- [ ] Mobile view (375px, 414px)
- [ ] Navigation works on mobile
- [ ] Images scale properly
- [ ] Text is readable on all screen sizes
- [ ] No horizontal scrolling

---

## Phase 4: Functionality Testing

### Navigation
- [ ] All menu items work
- [ ] Active page is highlighted
- [ ] Mobile menu opens/closes
- [ ] Breadcrumbs work (if applicable)
- [ ] Footer links work

### Forms
- [ ] Contact form submits successfully
- [ ] Form validation works
- [ ] Success/error messages display
- [ ] Required fields are enforced
- [ ] Email sends to correct address

### Interactive Elements
- [ ] Buttons have hover states
- [ ] Links have hover states
- [ ] Carousels/sliders work
- [ ] Accordions expand/collapse
- [ ] Modals open/close
- [ ] CTAs link to correct pages

### Dynamic Content
- [ ] ISR/SSG pages regenerate as expected
- [ ] Revalidation periods are correct
- [ ] Dynamic routes work ([slug] pages)
- [ ] 404 page displays for invalid routes
- [ ] Search functionality works (if applicable)

---

## Phase 5: Performance & SEO

### Performance
- [ ] Lighthouse performance score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] No render-blocking resources
- [ ] Images are lazy-loaded

### SEO
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Open Graph tags are present
- [ ] Twitter Card tags are present
- [ ] Canonical URLs are set
- [ ] Sitemap is generated
- [ ] robots.txt is configured
- [ ] Schema.org markup for business (if applicable)

### Accessibility
- [ ] Lighthouse accessibility score > 90
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] ARIA labels where needed

---

## Phase 6: Pre-Deployment Comparison

### Content Audit
- [ ] Create spreadsheet of all pages (original vs new)
- [ ] Verify all original pages are recreated
- [ ] Verify all original sections are present
- [ ] Document any intentional omissions

### Screenshot Comparison
Take screenshots of:
- [ ] Homepage
- [ ] Tours listing page
- [ ] Sample tour detail page
- [ ] Blog listing page
- [ ] Sample blog post
- [ ] About page
- [ ] Contact page

Compare side-by-side with:
- [ ] Original site (if replacing existing)
- [ ] Design mockups (if new build)
- [ ] Approved prototype

### Stakeholder Review
- [ ] Share staging URL with stakeholder
- [ ] Get written approval to deploy
- [ ] Document any requested changes
- [ ] Address or defer change requests

---

## Phase 7: Deployment Execution

### Pre-Deploy
- [ ] All changes are committed to git
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main/master
- [ ] No merge conflicts
- [ ] Tag release version (if applicable)

### Deploy
- [ ] Deploy to staging first (if available)
- [ ] Verify staging deployment works
- [ ] Deploy to production
- [ ] Monitor deployment logs for errors
- [ ] Deployment completes successfully

### Post-Deploy Verification
- [ ] Visit production URL
- [ ] Navigate through all major pages
- [ ] Test key user flows:
  - [ ] Home → Tours → Tour Detail → Book
  - [ ] Home → Blog → Article
  - [ ] Home → Contact → Form Submit
- [ ] Verify no 404 errors
- [ ] Check browser console for errors
- [ ] Verify analytics tracking works (if implemented)

---

## Phase 8: Documentation

### Update Documentation
- [ ] Update README with new deployment URL
- [ ] Document any environment variables needed
- [ ] Update any changed architecture
- [ ] Note any known issues or limitations

### Create Deployment Report
Document in `DEPLOYMENT_SUCCESS.md`:
- [ ] Deployment date and time
- [ ] Deployment URL
- [ ] Build metrics (pages, size, time)
- [ ] Screenshots of key pages
- [ ] Known issues (if any)
- [ ] Verification checklist results
- [ ] Stakeholder approval confirmation

### Handoff (if applicable)
- [ ] Share admin credentials securely
- [ ] Provide CMS access (if using)
- [ ] Share documentation
- [ ] Schedule training session (if needed)

---

## Red Flags - Do Not Deploy If:

❌ Build fails or has errors
❌ Homepage is empty or has placeholder content
❌ Major pages are missing (404s)
❌ Fonts don't load or are incorrect
❌ Images are broken or missing
❌ Site is not responsive on mobile
❌ Forms don't work
❌ Lighthouse performance < 50
❌ No stakeholder approval
❌ Comparison to original shows major omissions
❌ Console has critical JavaScript errors

---

## Emergency Rollback Plan

If deployment has critical issues:

1. **Immediate:**
   - Document the issue
   - Assess severity (can it wait for fix?)

2. **Rollback (if critical):**
   ```bash
   vercel rollback [deployment-url]
   # or revert git commit and redeploy
   ```

3. **Fix:**
   - Fix issue locally
   - Test thoroughly
   - Go through checklist again
   - Redeploy

4. **Post-Mortem:**
   - Document what went wrong
   - Update checklist to prevent recurrence
   - Share learnings with team

---

## Checklist Sign-Off

**Deployer Name:** ___________________________
**Date:** ___________________________
**Deployment URL:** ___________________________
**All checks passed:** ☐ Yes ☐ No (document issues)

**Stakeholder Approval:**
**Name:** ___________________________
**Date:** ___________________________
**Signature/Email Confirmation:** ___________________________

---

## Notes

Use this space to document any deviations, known issues, or special circumstances:

```
[Notes here]
```

---

**Last Updated:** October 31, 2025
**Version:** 1.0

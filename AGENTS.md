# AI Agent Guidelines for Barbuda Leisure Tours

## ⚠️ CRITICAL: Repository Identity

**THIS IS THE PRODUCTION REPOSITORY** - `barbuda-local` is a completely separate git repository from its parent directory.

### Repository Verification

Before making any changes, ALWAYS verify which repository you're in:

```bash
# Check git remote
git remote -v

# Expected output for barbuda-local:
# origin  https://github.com/HDickenson/barbuda-leisure-tours.git (fetch)
# origin  https://github.com/HDickenson/barbuda-leisure-tours.git (push)
```

### Three Separate Repositories

1. **Barbuda/** - Parent directory containing build tools, NO git remote
   - Contains subdirectories for different projects
   - Has `.gitignore` that excludes `barbuda-local/`

2. **bl-new-site/** - Development/source repository
   - Remote: `https://github.com/HDickenson/bl-new-site.git`
   - Used for development and testing
   - NOT deployed to production

3. **barbuda-local/** - ⚡ PRODUCTION repository (THIS ONE)
   - Remote: `https://github.com/HDickenson/barbuda-leisure-tours.git`
   - Has its own `.git` directory
   - Deploys to Vercel
   - NOT a git submodule

## Common Mistakes to Avoid

❌ **DON'T** assume barbuda-local is tracked by parent Barbuda repo
❌ **DON'T** make changes to bl-new-site thinking they'll deploy
❌ **DON'T** commit to bl-new-site when fixes are needed in production
✅ **DO** verify `git remote -v` before committing
✅ **DO** apply production fixes directly to barbuda-local
✅ **DO** check which directory you're in before git operations

## Git Workflow

### Before Making Changes

```bash
# 1. Verify you're in barbuda-local
pwd
# Should show: C:\Users\harol\projects\Barbuda\barbuda-local

# 2. Check git remote
git remote -v
# Should show: HDickenson/barbuda-leisure-tours.git

# 3. Check current branch
git branch
# Should be on: main

# 4. Pull latest
git pull origin main
```

### Making Changes

```bash
# 1. Make your edits to files

# 2. Check what changed
git status

# 3. Stage changes
git add <files>

# 4. Commit with descriptive message
git commit -m "fix: description of change"

# 5. Push to production repo
git push origin main
```

## Deployment Info

- **Platform**: Vercel
- **Project**: generated-site (or similar)
- **Branch**: main
- **Build Command**: `npm run build`
- **Output Directory**: `out/`

### Verifying Deployment

After pushing changes:

1. Check Vercel dashboard for build status
2. Wait for build to complete (~2-3 minutes)
3. Visit production URL to verify changes
4. Test all modified pages/features

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Export Mode**: Static (`output: 'export'`)
- **Styling**: Tailwind CSS
- **Data**: TypeScript data files in `data/`

## Key Files

- `data/tours-converted.ts` - Tour data and interface definitions
- `app/tours/[slug]/TourDetailClient.tsx` - Tour detail page component
- `app/components/` - Reusable components (Montage, Footer, etc.)
- `next.config.ts` - Next.js configuration
- `package.json` - Dependencies and scripts

## When Confused

If you're unsure which repository you're working in:

```bash
# Run this command
git remote -v

# If output shows:
# - barbuda-leisure-tours.git → You're in barbuda-local (PRODUCTION)
# - bl-new-site.git → You're in bl-new-site (DEVELOPMENT)
# - No remote → You're in parent Barbuda directory
```

## Remember

> **barbuda-local is NOT a submodule. It's a completely independent git repository that happens to live inside the Barbuda directory. Changes here must be committed and pushed to its own remote: HDickenson/barbuda-leisure-tours.git**

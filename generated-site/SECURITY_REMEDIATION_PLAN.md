# SECURITY REMEDIATION PLAN
**Date**: 2025-01-31  
**Project**: Barbuda Leisure Tours  
**Status**: 🔴 CRITICAL - Exposed Vercel tokens in git history  

---

## CRITICAL FINDINGS

### 1. Exposed Vercel OIDC Tokens
**Location**: `.env.production` and `.env.vercel` in commit `5ce04d49`  
**Risk Level**: 🔴 CRITICAL  
**Impact**: Unauthorized deployment access to Vercel project

**Token Details**:
```
Team: harolds-projects-3adae873 (ID: team_hwJl7RqrUMR1k4Ts7CGnk5Z3)
Project: generated-site (ID: prj_1hVXBxQ8DuYldw76SD70Tz36s6jY)
Environment: development
User: iHY3mtEGGje3k9U3BOCre4nN
Expiry: ~12 hours from creation (auto-expiring)
```

---

## IMMEDIATE ACTION REQUIRED

### Step 1: Remove Files from Git History ⚠️ DESTRUCTIVE OPERATION
```powershell
# Backup current state
cd C:\Users\harol\projects\Barbuda\bl-new-site\generated-site
git branch backup-before-filter-branch

# Remove files from git history using filter-branch
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch .env.production .env.vercel .env.local.backup" `
  --prune-empty --tag-name-filter cat -- --all

# Cleanup refs
Remove-Item .git/refs/original -Recurse -Force
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 2: Force Push Clean History ⚠️ REQUIRES TEAM COORDINATION
```powershell
# ⚠️ WARNING: This will rewrite GitHub history
# Notify team members before proceeding
# All collaborators must re-clone the repository

git push origin --force --all
git push origin --force --tags
```

### Step 3: Verify Token Auto-Expiry
The exposed OIDC tokens are **auto-expiring** (12-hour lifetime):
- `.env.production` token created: 2025-01-31 (nbf: 1761925228)
- `.env.vercel` token created: 2025-01-31 (nbf: 1761926574)
- **Expiry**: ~12 hours after creation (exp timestamps: 1761968428, 1761969774)

**Action**: Wait for tokens to auto-expire OR revoke manually via Vercel dashboard

### Step 4: Prevent Future Leaks
✅ **COMPLETED**: `.gitignore` updated to exclude:
```
.env*
!.env.example
.env.local
.env.production
.env.vercel
.env.local.backup
```

### Step 5: Create Safe Environment Variable Template
```powershell
# Create .env.example with placeholder values
@"
# Vercel Environment Variables
# DO NOT commit actual tokens - use Vercel dashboard or CLI

# Vercel OIDC Token (created by Vercel CLI)
VERCEL_OIDC_TOKEN=your_token_here

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
"@ | Out-File -FilePath .env.example -Encoding UTF8
```

---

## SAFE ALTERNATIVE: Branch Strategy (Recommended)

Instead of rewriting master branch history (risky), create a clean branch:

```powershell
# Create new orphan branch (no history)
git checkout --orphan clean-master

# Add all current files
git add -A
git commit -m "Initial commit: Clean slate without exposed secrets"

# Rename old master
git branch -m master old-master-with-secrets

# Rename clean branch to master
git branch -m master

# Force push new master
git push origin master --force

# Update default branch on GitHub to new master
# Delete old-master-with-secrets after verification
```

**Advantages**:
- ✅ No rewriting history on existing branch
- ✅ Keeps backup of old branch for recovery
- ✅ Cleaner git history
- ✅ Less risk of breaking collaborator workflows

**Disadvantages**:
- ❌ Loses all commit history
- ❌ Breaks existing PRs/branches based on old master

---

## NEXT STEPS AFTER SECURITY FIX

### Phase 1B: Fix npm Vulnerabilities
```powershell
npm audit
npm audit fix
npm audit fix --force
npm audit report > npm-audit-report.txt
```

### Phase 1C: Update Vulnerable Dependencies
Based on DevOps audit findings:
- `glob` (High severity)
- `valibot` (High severity)
- `@sanity/*` packages (High severity)
- `body-parser` (Moderate severity)
- `js-yaml` (Moderate severity)

### Phase 1D: Add Security Headers
Create `next.config.ts` security headers:
```typescript
headers: [
  {
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
    ]
  }
]
```

---

## VERIFICATION CHECKLIST

- [ ] Git history cleaned (no `.env.*` files in commits)
- [ ] Vercel tokens expired or revoked
- [ ] `.gitignore` excludes all sensitive files
- [ ] `.env.example` template created
- [ ] npm vulnerabilities fixed
- [ ] Security headers added to next.config.ts
- [ ] Team notified of history rewrite (if using filter-branch)
- [ ] All collaborators re-clone repository

---

## RECOVERY INSTRUCTIONS (If Things Go Wrong)

If filter-branch breaks something:
```powershell
# Restore from backup branch
git checkout backup-before-filter-branch
git branch -D master
git checkout -b master
git push origin master --force
```

If orphan branch strategy fails:
```powershell
# Go back to old master
git checkout old-master-with-secrets
git branch -D master
git checkout -b master
```

---

## LESSONS LEARNED

1. **Never commit `.env*` files** - Use Vercel dashboard or CLI to set environment variables
2. **Always verify `.gitignore`** before first commit
3. **Use pre-commit hooks** to scan for secrets (e.g., `git-secrets`, `detect-secrets`)
4. **Rotate tokens immediately** after exposure
5. **Use short-lived tokens** (OIDC tokens auto-expire, which is good)

---

## REFERENCES

- [Vercel Environment Variables Best Practices](https://vercel.com/docs/environment-variables)
- [GitHub: Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Filter-Branch Documentation](https://git-scm.com/docs/git-filter-branch)

# Git History Cleanup Script - Orphan Branch Method (RECOMMENDED)
# This script creates a clean git history without exposed secrets
# SAFER than filter-branch - creates new branch instead of rewriting history

$ErrorActionPreference = "Stop"
$projectDir = "C:\Users\harol\projects\Barbuda\bl-new-site\generated-site"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GIT HISTORY CLEANUP - ORPHAN BRANCH METHOD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Confirmation prompt
Write-Host "⚠️  WARNING: This will create a new master branch with clean history" -ForegroundColor Yellow
Write-Host "⚠️  Old master will be renamed to 'master-old-backup'" -ForegroundColor Yellow
Write-Host "⚠️  All commit history will be lost (but files preserved)" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Type 'YES' to continue, anything else to cancel"

if ($confirm -ne "YES") {
    Write-Host "❌ Operation cancelled by user" -ForegroundColor Red
    exit 1
}

Set-Location $projectDir

# Step 1: Verify we're on master branch
Write-Host "`n[1/9] Verifying current branch..." -ForegroundColor Cyan
$currentBranch = git branch --show-current
if ($currentBranch -ne "master") {
    Write-Host "❌ Not on master branch (currently on: $currentBranch)" -ForegroundColor Red
    Write-Host "   Run: git checkout master" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ On master branch" -ForegroundColor Green

# Step 2: Check for uncommitted changes
Write-Host "`n[2/9] Checking for uncommitted changes..." -ForegroundColor Cyan
$status = git status --porcelain
if ($status) {
    Write-Host "❌ You have uncommitted changes:" -ForegroundColor Red
    git status --short
    Write-Host "`n   Commit or stash changes before running this script" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Working tree clean" -ForegroundColor Green

# Step 3: Create backup branch
Write-Host "`n[3/9] Creating backup of current master..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupBranch = "master-old-backup-$timestamp"
git branch $backupBranch
Write-Host "✅ Backup branch created: $backupBranch" -ForegroundColor Green

# Step 4: Remove sensitive files if they exist
Write-Host "`n[4/9] Removing sensitive files..." -ForegroundColor Cyan
$filesToRemove = @(".env.production.backup", ".env.vercel.backup", ".env.production", ".env.vercel", ".env.local.backup")
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "   Removed: $file" -ForegroundColor Yellow
    }
}
Write-Host "✅ Sensitive files cleaned" -ForegroundColor Green

# Step 5: Create orphan branch (no history)
Write-Host "`n[5/9] Creating orphan branch with clean history..." -ForegroundColor Cyan
git checkout --orphan clean-master
Write-Host "✅ Orphan branch created" -ForegroundColor Green

# Step 6: Add all files
Write-Host "`n[6/9] Staging all files..." -ForegroundColor Cyan
git add -A
$stagedFiles = git diff --cached --name-only | Measure-Object | Select-Object -ExpandProperty Count
Write-Host "✅ Staged $stagedFiles files" -ForegroundColor Green

# Step 7: Commit clean history
Write-Host "`n[7/9] Creating initial commit..." -ForegroundColor Cyan
git commit -m "chore: initial commit with clean history (removed exposed secrets)

- Removed .env.production and .env.vercel from git history
- These files contained exposed Vercel OIDC tokens
- Tokens have auto-expired (12-hour lifetime)
- Updated .gitignore to prevent future leaks
- All sensitive environment variables now in Vercel dashboard only

Previous history backed up in branch: $backupBranch"

Write-Host "✅ Initial commit created" -ForegroundColor Green

# Step 8: Rename branches
Write-Host "`n[8/9] Renaming branches..." -ForegroundColor Cyan
git branch -M master master-old-$timestamp
git branch -M clean-master master
Write-Host "✅ Branches renamed:" -ForegroundColor Green
Write-Host "   - Old master: master-old-$timestamp" -ForegroundColor Gray
Write-Host "   - New master: master (clean history)" -ForegroundColor Gray

# Step 9: Verify cleanup
Write-Host "`n[9/9] Verifying cleanup..." -ForegroundColor Cyan
$envInHistory = git log --all --full-history --oneline -- .env.production .env.vercel
if ($envInHistory) {
    Write-Host "❌ Sensitive files still found in history!" -ForegroundColor Red
    Write-Host $envInHistory
    exit 1
}
Write-Host "✅ No sensitive files in git history" -ForegroundColor Green

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CLEANUP COMPLETE ✅" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes: git log --oneline" -ForegroundColor White
Write-Host "2. Force push to GitHub: git push origin master --force" -ForegroundColor White
Write-Host "3. (Optional) Delete old branch: git branch -D master-old-$timestamp" -ForegroundColor White
Write-Host "4. (Optional) Delete backup: git branch -D $backupBranch" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: After force push, all collaborators must:" -ForegroundColor Yellow
Write-Host "   1. Delete their local repository" -ForegroundColor White
Write-Host "   2. Re-clone from GitHub: git clone https://github.com/HDickenson/bl-new-site.git" -ForegroundColor White
Write-Host ""

# Ask about force push
Write-Host "Do you want to force push to GitHub now? (y/n): " -NoNewline -ForegroundColor Cyan
$pushNow = Read-Host
if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    Write-Host "`nForce pushing to origin/master..." -ForegroundColor Cyan
    git push origin master --force
    Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 All done! Repository is now clean." -ForegroundColor Green
    Write-Host "   GitHub: https://github.com/HDickenson/bl-new-site" -ForegroundColor Gray
} else {
    Write-Host "`n⏸️  Skipped push. Run manually when ready:" -ForegroundColor Yellow
    Write-Host "   git push origin master --force" -ForegroundColor White
}

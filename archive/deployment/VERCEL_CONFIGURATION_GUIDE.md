# Vercel Configuration Guide for bl-new-site

## Current Issue Diagnosis

The deployment was failing with:
```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".
```

### Root Cause

The Next.js application is located in the `generated-site/` subdirectory, but Vercel was scanning the repository root for dependencies. The root `package.json` is a monorepo configuration using pnpm workspaces and doesn't contain Next.js dependencies.

### Previous Incorrect Fix

An earlier attempt added `"rootDirectory": "generated-site"` to `vercel.json`. However, **this property does not exist** in the Vercel JSON schema. It was silently ignored, causing the deployment to still fail.

## Valid Configuration Properties

According to the official Vercel schema (https://openapi.vercel.sh/vercel.json), the valid properties are:

- `$schema` - For IDE autocomplete (ignored by Vercel)
- `buildCommand` - Override build command
- `devCommand` - Override dev command
- `installCommand` - Override install command
- `outputDirectory` - Specify build output location
- `framework` - Framework preset (e.g., "nextjs")
- `cleanUrls`, `headers`, `redirects`, `rewrites`, `functions`, `images`, etc.

**Note:** `rootDirectory` is NOT a valid vercel.json property.

## Two Valid Solutions

### Solution A: Set Root Directory in Vercel Dashboard (RECOMMENDED)

This is the proper, official way to deploy subdirectory applications.

**Steps:**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Build & Development Settings**
3. Find the **Root Directory** section
4. Click **Edit**
5. Enter: `generated-site`
6. Click **Save**
7. Trigger a new deployment

**Then update vercel.json to:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Important Notes:**
- All paths become relative to `generated-site/`
- The app cannot access files outside `generated-site/`
- Cannot use `..` to navigate up
- `vercel.json` should remain at repo root, but you could optionally move it to `generated-site/`

**Advantages:**
- Cleaner configuration
- Officially recommended approach
- Better performance (Vercel only processes relevant directory)
- Clearer separation of concerns

### Solution B: Use Explicit Directory Navigation (CURRENT)

This is a workaround when you can't or don't want to configure the dashboard.

**Current vercel.json configuration:**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd generated-site && npm install && npm run build",
  "devCommand": "cd generated-site && npm run dev",
  "installCommand": "echo 'Skipping root install - will install in generated-site during build'",
  "outputDirectory": "generated-site/.next",
  "framework": "nextjs"
}
```

**How it works:**
- `installCommand` skips root installation with an echo message
- `buildCommand` navigates to subdirectory, installs dependencies, then builds
- `outputDirectory` points to the subdirectory's `.next` folder
- `framework: "nextjs"` enables Next.js optimizations

**Advantages:**
- Works immediately without dashboard changes
- No external configuration needed
- Portable across different Vercel projects

**Disadvantages:**
- Vercel still scans the entire repository initially
- Less efficient than Solution A
- More complex commands

## Recommended Migration Path

1. **Current state:** Solution B is implemented and should work now
2. **Next step:** Set Root Directory in Vercel Dashboard to `generated-site`
3. **Then:** Simplify vercel.json to Solution A configuration
4. **Optional:** Move vercel.json into generated-site/ directory

## Monorepo Best Practices

For monorepos with multiple deployable applications:

1. **Separate Vercel Projects:** Create one Vercel project per app
2. **Configure Root Directory:** Set each project's root directory to its app folder
3. **Workspace Dependencies:** Ensure packages have unique names in package.json
4. **Explicit Dependencies:** State all inter-package dependencies explicitly

## Verification Checklist

Before deploying, verify:

- [ ] Root Directory is set in Vercel Dashboard OR cd commands are used
- [ ] Next.js dependencies are in the target package.json
- [ ] outputDirectory points to the correct .next folder
- [ ] framework is set to "nextjs"
- [ ] No invalid properties in vercel.json (like rootDirectory)
- [ ] Build command includes dependency installation if needed

## Common Pitfalls to Avoid

1. ❌ Using `"rootDirectory"` in vercel.json (doesn't exist)
2. ❌ Forgetting to install dependencies in subdirectory
3. ❌ Mismatched paths between Root Directory and outputDirectory
4. ❌ Trying to access parent directory files when Root Directory is set
5. ❌ Mixing pnpm (monorepo) with npm (subdirectory) without proper separation

## Further Reading

- [Vercel Monorepo Docs](https://vercel.com/docs/monorepos)
- [Configuring Builds](https://vercel.com/docs/builds/configure-a-build)
- [Project Configuration](https://vercel.com/docs/project-configuration)
- [Vercel JSON Schema](https://openapi.vercel.sh/vercel.json)

## Support

If deployment still fails after these changes:
1. Check the deployment logs in Vercel dashboard
2. Verify the Root Directory setting
3. Ensure package.json exists in generated-site/
4. Confirm Next.js is listed in dependencies
5. Test build locally: `cd generated-site && npm install && npm run build`

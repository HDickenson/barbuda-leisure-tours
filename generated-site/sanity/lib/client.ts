import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

if (!projectId) {
  throw new Error(
    '❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable.\n\n' +
    'To fix this:\n' +
    '1. Go to Vercel Dashboard: https://vercel.com/harolds-projects-3adae873/generated-site/settings/environment-variables\n' +
    '2. Add NEXT_PUBLIC_SANITY_PROJECT_ID with value: lqzshphk\n' +
    '3. Add it to all environments: Production, Preview, Development\n' +
    '4. Redeploy your project\n'
  )
}

export const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

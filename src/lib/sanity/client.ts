import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'lqzshphk',
  dataset: 'bldt',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN only in production
})

// Read-only client for public data (no token needed)
export const publicClient = client

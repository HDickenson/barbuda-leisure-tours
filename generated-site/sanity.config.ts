import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

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

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Barbuda Leisure Day Tours',

  projectId,
  dataset,

  basePath: '/studio', // Access Sanity Studio at /studio

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Tours')
              .icon(() => '🎫')
              .child(S.documentTypeList('tour').title('Tours')),
            S.listItem()
              .title('Blog Articles')
              .icon(() => '📝')
              .child(S.documentTypeList('article').title('Articles')),
            S.divider(),
            S.listItem()
              .title('Authors')
              .icon(() => '👤')
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('Categories')
              .icon(() => '🏷️')
              .child(S.documentTypeList('category').title('Categories')),
          ]),
    }),
    visionTool(), // GROQ query playground
  ],

  schema: {
    types: schemaTypes,
  },
})

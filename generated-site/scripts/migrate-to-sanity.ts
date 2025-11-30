#!/usr/bin/env tsx

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@sanity/client'
import { getAllTours } from '../data/tours'
import { getAllArticles } from '../data/articles'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

// Helper: Convert HTML to simple Portable Text
function htmlToPortableText(html: string) {
  // Strip HTML tags and create basic blocks
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substring(7),
          text: text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ]
}

async function createDefaultAuthor() {
  console.log('👤 Creating default author...\n')

  const author = {
    _type: 'author',
    _id: 'author-barbuda-leisure',
    name: 'Barbuda Leisure Tours',
    slug: {
      _type: 'slug',
      current: 'barbuda-leisure-tours',
    },
    bio: 'Local experts with decades of combined experience showing visitors the best of Barbuda.',
  }

  try {
    await client.createOrReplace(author)
    console.log('✅ Created default author\n')
  } catch (error) {
    console.error('❌ Failed to create author', error)
  }
}

async function createDefaultCategory() {
  console.log('🏷️  Creating default category...\n')

  const category = {
    _type: 'category',
    _id: 'category-travel-guide',
    title: 'Travel Guide',
    slug: {
      _type: 'slug',
      current: 'travel-guide',
    },
    description: 'Guides and tips for traveling to Barbuda',
  }

  try {
    await client.createOrReplace(category)
    console.log('✅ Created default category\n')
  } catch (error) {
    console.error('❌ Failed to create category', error)
  }
}

async function migrateTours() {
  console.log('🎫 Migrating Tours...\n')

  const tours = getAllTours()

  for (let i = 0; i < tours.length; i++) {
    const tour = tours[i]

    const sanityTour = {
      _type: 'tour',
      _id: `tour-${tour.slug}`,
      slug: {
        _type: 'slug',
        current: tour.slug,
      },
      title: tour.title,
      subtitle: tour.subtitle || '',
      description: htmlToPortableText(tour.description),
      duration: tour.duration,
      price: tour.price,
      groupSize: tour.groupSize,
      included: tour.included,
      featured: tour.featured || false,
      order: i,
      publishedAt: new Date().toISOString(),
    }

    try {
      await client.createOrReplace(sanityTour)
      console.log(`✅ Migrated tour ${i + 1}/${tours.length}: ${tour.title}`)
    } catch (error) {
      console.error(`❌ Failed to migrate tour: ${tour.title}`, error)
    }
  }

  console.log(`\n✨ Successfully migrated ${tours.length} tours\n`)
}

async function migrateArticles() {
  console.log('📝 Migrating Articles...\n')

  const articles = getAllArticles()

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]

    const sanityArticle = {
      _type: 'article',
      _id: `article-${article.slug}`,
      slug: {
        _type: 'slug',
        current: article.slug,
      },
      title: article.title,
      excerpt: article.excerpt,
      content: htmlToPortableText(article.content),
      tags: article.tags || [],
      author: {
        _type: 'reference',
        _ref: 'author-barbuda-leisure',
      },
      category: article.category
        ? {
            _type: 'reference',
            _ref: 'category-travel-guide',
          }
        : undefined,
      publishedAt: article.publishedDate,
      readTime: article.readTime || 5,
      featured: article.featured || false,
    }

    try {
      await client.createOrReplace(sanityArticle)
      console.log(`✅ Migrated article ${i + 1}/${articles.length}: ${article.title}`)
    } catch (error) {
      console.error(`❌ Failed to migrate article: ${article.title}`, error)
    }
  }

  console.log(`\n✨ Successfully migrated ${articles.length} articles\n`)
}

async function runMigration() {
  console.log('🚀 Starting Sanity Migration')
  console.log('================================================\n')

  try {
    // Create default documents
    await createDefaultAuthor()
    await createDefaultCategory()

    // Migrate content
    await migrateTours()
    await migrateArticles()

    console.log('================================================')
    console.log('✅ Migration Complete!\n')
    console.log('Next steps:')
    console.log('1. Visit http://localhost:3000/studio')
    console.log('2. Review migrated content')
    console.log('3. Update tour/blog pages to fetch from Sanity')
    console.log('4. Upload hero images and gallery images\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
runMigration()

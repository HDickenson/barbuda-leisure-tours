import { groq } from 'next-sanity'

// ============================================================
// TOUR QUERIES
// ============================================================

export const TOURS_QUERY = groq`
  *[_type == "tour"] | order(order asc, publishedAt desc) {
    _id,
    _createdAt,
    slug,
    title,
    subtitle,
    description,
    heroImage,
    duration,
    price,
    groupSize,
    included,
    gallery,
    featured,
    order,
    publishedAt
  }
`

export const TOUR_BY_SLUG_QUERY = groq`
  *[_type == "tour" && slug.current == $slug][0] {
    _id,
    _createdAt,
    slug,
    title,
    subtitle,
    description,
    heroImage,
    duration,
    price,
    groupSize,
    included,
    gallery,
    featured,
    publishedAt
  }
`

export const FEATURED_TOURS_QUERY = groq`
  *[_type == "tour" && featured == true] | order(order asc)[0...3] {
    _id,
    slug,
    title,
    subtitle,
    heroImage,
    duration,
    price,
    featured
  }
`

// ============================================================
// ARTICLE QUERIES
// ============================================================

export const ARTICLES_QUERY = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    _createdAt,
    slug,
    title,
    excerpt,
    content,
    featuredImage,
    category->{
      title,
      slug
    },
    tags,
    author->{
      name,
      slug,
      bio,
      image
    },
    publishedAt,
    readTime,
    featured
  }
`

export const ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    _createdAt,
    slug,
    title,
    excerpt,
    content,
    featuredImage,
    category->{
      title,
      slug
    },
    tags,
    author->{
      name,
      slug,
      bio,
      image
    },
    publishedAt,
    readTime,
    featured
  }
`

export const FEATURED_ARTICLES_QUERY = groq`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    slug,
    title,
    excerpt,
    featuredImage,
    author->{name},
    publishedAt,
    readTime
  }
`

export const ARTICLES_BY_CATEGORY_QUERY = groq`
  *[_type == "article" && category->slug.current == $category] | order(publishedAt desc) {
    _id,
    slug,
    title,
    excerpt,
    featuredImage,
    author->{name},
    publishedAt,
    readTime
  }
`

// ============================================================
// AUTHOR & CATEGORY QUERIES
// ============================================================

export const AUTHORS_QUERY = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    image
  }
`

export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

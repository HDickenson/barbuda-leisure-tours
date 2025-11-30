import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '@/data/articles-converted'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} - Barbuda Leisure Blog`,
    description: article.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Image */}
      {article.featuredImage && (
        <div className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-4">
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-center gap-4 mb-4 text-white/90">
                {article.category && (
                  <span className="bg-[#4DD0E1] px-4 py-2 rounded-full text-sm font-bold">
                    {article.category}
                  </span>
                )}
                <span>{new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
                {article.readTime && (
                  <>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </>
                )}
              </div>
              <h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
                style={{ fontFamily: "'Leckerli One', cursive" }}
              >
                {article.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 font-light max-w-3xl">
                {article.excerpt}
              </p>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="rgb(249, 250, 251)"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="py-20 bg-white">
        <div className="container mx-auto px-4 md:max-w-[900px]">
          {/* Content */}
          <div
            className="prose prose-lg prose-headings:font-bold prose-headings:text-[#263238] prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-[#4DD0E1] prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: typeof article.content === 'string' ? article.content : article.excerpt,
            }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          {article.author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-xl text-[#263238]">{article.author}</p>
                  {article.authorBio && (
                    <p className="text-gray-600">{article.authorBio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/BarbudaLeisureTours-3.jpg"
            alt="Explore Barbuda"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4DD0E1]/95 to-[#26C6DA]/95"></div>
        </div>

        <div className="relative z-10 py-24 text-center text-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Ready to Experience Barbuda?
            </h2>
            <p className="text-2xl mb-10 font-light">
              Book your day tour and discover the beauty of Barbuda for yourself
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/tours"
                className="bg-white text-[#4DD0E1] hover:bg-gray-100 font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                View All Tours
              </Link>
              <Link
                href="/contact"
                className="bg-[#FF6B9D] hover:bg-[#FF5789] text-white font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArticles } from '@/data/articles-converted'

export const metadata: Metadata = {
  title: 'Blog & Travel Stories | Barbuda Leisure Day Tours',
  description:
    'Discover stories, tips, and insights about exploring Barbuda. Read about our tours, island adventures, and travel guides.',
}

export default function BlogListingPage() {
  const articles = getAllArticles()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/BarbudaLeisureTours-3-2.jpg"
            alt="Barbuda Blog"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1
            className="text-7xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
            style={{ fontFamily: "'Leckerli One', cursive" }}
          >
            Stories from Paradise
          </h1>
          <p className="text-2xl md:text-3xl text-white/95 max-w-3xl font-light">
            Discover travel tips, island adventures, and the beauty of Barbuda through our blog
          </p>
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

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-6">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-8">Coming soon - exciting stories from Barbuda!</p>
              <Link
                href="/tours"
                className="inline-block bg-[#4DD0E1] hover:bg-[#26C6DA] text-white font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
              >
                Explore Our Tours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="group block">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
                    {/* Featured Image */}
                    {article.featuredImage && (
                      <div className="relative h-72 overflow-hidden">
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Category Badge */}
                        {article.category && (
                          <div className="absolute top-4 left-4 bg-[#4DD0E1] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            {article.category}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-[#263238] mb-2 group-hover:text-[#4DD0E1] transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </div>

                      <p className="text-gray-600 mb-4 flex-1 line-clamp-3">{article.excerpt}</p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(article.publishedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {article.readTime && (
                            <>
                              <span>•</span>
                              <span>{article.readTime} min read</span>
                            </>
                          )}
                        </div>
                        <div className="text-[#4DD0E1] font-bold text-sm group-hover:translate-x-2 transition-transform flex items-center gap-1">
                          Read More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Pink-Beach-North-scaled.jpg"
            alt="Visit Barbuda"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D]/95 to-[#FF5789]/95"></div>
        </div>

        <div className="relative z-10 py-24 text-center text-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Leckerli One', cursive" }}
            >
              Ready for Your Adventure?
            </h2>
            <p className="text-2xl mb-10 font-light">
              Let us help you plan the perfect day in paradise
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/tours"
                className="bg-white text-[#FF6B9D] hover:bg-gray-100 font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-2"
              >
                Explore Our Tours
              </Link>
              <Link
                href="/contact"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white text-white font-bold py-5 px-12 rounded-full text-xl transition-all hover:scale-105"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

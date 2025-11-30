import Image from 'next/image';
import Link from 'next/link';
import InnerPageHero from '@/components/InnerPageHero';
import { getAllPosts } from '@/data/posts';

export default function NewsUpdatesPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <InnerPageHero
        title="News & Updates"
        subtitle="Latest news, stories, and updates from Barbuda"
        backgroundImage="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BlackBarbuda-Leisure-Day-Tours-2-Colour.webp"
        showWave={true}
        waveFillColor="#FFFFFF"
      />

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <Link href={`/our-blog/${post.slug}`} className="block relative h-64 overflow-hidden group">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {post.category}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 mb-3">{post.date}</div>
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 hover:text-primary transition-colors">
                    <Link href={`/our-blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/our-blog/${post.slug}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 mt-auto"
                  >
                    Read More 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'News & Updates - Barbuda Leisure Day Tours',
  description: 'Discover the latest stories, travel tips, and updates from Barbuda Leisure Day Tours.',
};
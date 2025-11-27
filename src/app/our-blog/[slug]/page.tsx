import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/data/posts'
import WaveDivider from '@/components/WaveDivider'
import heroWave from '@/components/heroWavePaths'
import styles from '@/components/InnerPageHero.module.css'
import ReactMarkdown from 'react-markdown'

interface Props {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className={`${styles.bg} object-cover`}
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <WaveDivider
            {...heroWave}
            viewBox={heroWave.viewBox}
            paths={heroWave.paths}
            fillColor="#FFFFFF"
            position="bottom"
            height="120px"
          />
        </div>

        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center text-white max-w-4xl">
            <div className="mb-4 flex items-center justify-center gap-4 text-sm uppercase tracking-wider">
              <span className="bg-primary px-3 py-1 rounded-full">{post.category}</span>
              <span>{post.date}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
              <Link 
                href="/our-blog"
                className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

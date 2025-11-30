import { Metadata } from 'next'
import CTAButton from '../components/CTAButton'

export const metadata: Metadata = {
  title: 'Contact Us - Barbuda Leisure Day Tours',
  description: 'Explore contact us with Barbuda Leisure Tours',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/wp-content/uploads/2024/11/Pink-Beach-North-scaled.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div
          className="relative z-10 max-w-4xl mx-4 px-16 py-12 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(77, 208, 225, 0.85)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h1
            className="text-white mb-6"
            style={{
              fontFamily: "'Leckerli One', cursive",
              fontSize: '3rem',
              lineHeight: '1.2',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Contact Us
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700">Content coming soon. Please check back later.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #4DD0E1 0%, #1E88E5 100%)'
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book?
          </h2>
          <p className="text-xl mb-8">
            Contact us today to plan your perfect Barbuda experience
          </p>
          <CTAButton
            text="BOOK NOW"
            variant="secondary"
            href="/tours"
          />
        </div>
      </section>
    </main>
  )
}

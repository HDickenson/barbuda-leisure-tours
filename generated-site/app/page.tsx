'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Navigation from './components/Navigation'
import { WaveDivider } from './components/WaveDivider'
import Link from 'next/link'

export default function HomepagePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const backgroundImages = [
      "/images/DSC3121-scaled.jpg",
      "/images/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp",
      "/images/Another-View-of-Frigate-Bird-During-their-Mating-Season.webp",
      "/images/Horses-swim-too-and-they-particularly-love-Barbudas-beaches-scaled.webp",
      "/images/IMG_6031-scaled.webp",
      "/images/BarbudaLeisureTours-7-2.jpg",
      "/images/Allesandra-scaled.jpg",
      "/images/yellow-brest.jpg",
      "/images/Pink-Beach-North-scaled.jpg"
  ]

  useEffect(() => {
    // Auto-advance slideshow
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-[${500}ms] ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`relative w-full h-full ${true ? 'animate-ken-burns-in' : ''}`}
            >
              <Image
                src={image}
                alt={`Homepage background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
            </div>
          </div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Navigation */}
      <div className="relative z-10">
        <Navigation />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1
            className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fadeIn font-['Leckerli_One',cursive]"
          >
            Barbuda Leisure Day Tours
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-8 font-light">
            One Day, Endless Memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/tours"
              className="px-8 py-4 rounded-full font-semibold text-white text-lg transition-all hover:scale-105 active:scale-95 bg-[#4DD0E1] shadow-[0_8px_16px_rgba(77,208,225,0.4)]"
            >
              Explore Our Tours
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 border-2 border-white text-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <WaveDivider color="#ffffff" />

      {/* Section: Highlights */}
      <section className="relative z-10 bg-white">
        <div className="container mx-auto px-4 py-16 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold mb-2">Pristine Beaches</h3>
            <p className="text-gray-600">17 miles of pink sand and crystal waters.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Wildlife & Nature</h3>
            <p className="text-gray-600">Frigate bird sanctuary and rich marine life.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
            <p className="text-gray-600">Guides with deep knowledge of Barbuda.</p>
          </div>
        </div>
      </section>

      {/* Wave Divider (flip) */}
      <WaveDivider color="#f8fafc" flip />

      {/* Section: Featured Tours */}
      <section className="relative z-10 bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-6">Featured Tours</h2>
          <p className="text-gray-600 mb-6">Discover our most popular experiences on land and sea.</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/tours/discover-barbuda-by-sea" className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md">Barbuda by Sea</Link>
            <Link href="/tours/discover-barbuda-by-air" className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md">Barbuda by Air</Link>
            <Link href="/tours/barbuda-sky-sea-adventure" className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md">Sky & Sea Adventure</Link>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider color="#ffffff" />

      {/* Section: Reviews */}
      <section className="relative z-10 bg-white">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-6">Guest Reviews</h2>
          <p className="text-gray-600 mb-6">See what travelers say about their day in Barbuda.</p>
          <Link href="/reviews" className="px-6 py-3 bg-teal-400 text-white rounded-full hover:opacity-90">Read Reviews</Link>
        </div>
      </section>

      {/* Wave Divider (flip) */}
      <WaveDivider color="#f8fafc" flip />

      {/* Section: FAQ/CTA */}
      <section className="relative z-10 bg-slate-50">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-6">Questions?</h2>
          <p className="text-gray-600 mb-6">Find answers about tours, logistics and more.</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/faq" className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md">Visit FAQ</Link>
            <Link href="/tours" className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-md">Browse All Tours</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes ken-burns-in {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes ken-burns-out {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-ken-burns-in {
          animation: ken-burns-in 5000ms ease-in-out forwards;
        }

        .animate-ken-burns-out {
          animation: ken-burns-out 5000ms ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Tours', href: '/our-tours' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'About Us', href: '/about' },
  ]

  const handleBookNow = () => {
    // Scroll to contact form or open booking modal
    const bookingSection = document.getElementById('booking')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Fallback: navigate to tours page
      window.location.href = '/tours'
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/BlackBarbuda-Leisure-Day-Tours-2-Colour.webp"
            alt="Barbuda Leisure Tours"
            width={180}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-medium text-base transition-colors group ${
                  isActive ? 'text-cyan-300' : 'text-slate-800'
                }`}
              >
                {link.name}
                {/* Underline on hover */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-300 group-hover:w-full transition-all duration-300" />
              </Link>
            )
          })}
        </div>

        {/* Desktop Book Now Button */}
        <button
          onClick={handleBookNow}
          className="hidden md:block px-6 py-2 rounded-full font-semibold text-white bg-cyan-300 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Book your tour now"
        >
          BOOK NOW
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-black/10 animate-slideDown">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    isActive ? 'text-cyan-300 font-semibold' : 'text-slate-800 font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleBookNow()
              }}
              className="w-full px-6 py-3 rounded-full font-semibold text-white bg-cyan-300 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

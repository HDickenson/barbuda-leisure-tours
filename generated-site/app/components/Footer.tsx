'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Barbuda Leisure Day Tours</h3>
          <p className="text-sm text-gray-400">One Day, Endless Memories</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tours" className="hover:text-white">Our Tours</Link></li>
            <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Get in touch</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Email: info@barbudaleisure.com</li>
            <li>Location: Barbuda</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 text-xs text-gray-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Barbuda Leisure Day Tours. All rights reserved.</p>
          <p>Made with ❤️ in the Caribbean</p>
        </div>
      </div>
    </footer>
  )
}

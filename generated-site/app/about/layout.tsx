/**
 * Minimal Layout - No Nav, No Footer, No Tailwind
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us – Barbuda Leisure Day Tours',
  description: 'Barbuda Leisure Day Tours',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}

'use client'

import { useState } from 'react'

interface CTAButtonProps {
  text: string
  variant: 'primary' | 'secondary' | 'pink'
  onClick?: () => void
  href?: string
  className?: string
}

export default function CTAButton({ text, variant, onClick, href, className = '' }: CTAButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const variants = {
    primary: {
      backgroundColor: '#4DD0E1',
      color: '#FFFFFF',
      boxShadow: '0 4px 6px rgba(77, 208, 225, 0.3)'
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      color: '#4DD0E1',
      boxShadow: '0 4px 12px rgba(255,255,255,0.3)'
    },
    pink: {
      backgroundColor: '#FF6B9D',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(255, 107, 157, 0.4)'
    }
  }

  const style = variants[variant]

  const handleClick = () => {
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)

    if (onClick) {
      onClick()
    } else if (href) {
      window.location.href = href
    } else {
      // Default action: scroll to tours or open booking
      const toursSection = document.getElementById('tours')
      if (toursSection) {
        toursSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = '/tours'
      }
    }
  }

  const baseClasses = `
    px-8 py-3 rounded-full font-semibold
    transition-all duration-200
    hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${isPressed ? 'scale-95' : ''}
    ${className}
  `

  return (
    <button
      onClick={handleClick}
      className={baseClasses}
      style={{
        ...style,
        ...(variant === 'primary' && { focusRingColor: '#4DD0E1' }),
        ...(variant === 'pink' && { focusRingColor: '#FF6B9D' })
      }}
      aria-label={text}
    >
      {text}
    </button>
  )
}

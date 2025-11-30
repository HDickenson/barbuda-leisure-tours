'use client'

import { useEffect, useState } from 'react'

export function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLAnchorElement && e.target.classList.contains('skip-link')) {
        setIsVisible(true)
      }
    }

    const handleBlur = (e: FocusEvent) => {
      if (e.target instanceof HTMLAnchorElement && e.target.classList.contains('skip-link')) {
        setIsVisible(false)
      }
    }

    window.addEventListener('focus', handleFocus, true)
    window.addEventListener('blur', handleBlur, true)

    return () => {
      window.removeEventListener('focus', handleFocus, true)
      window.removeEventListener('blur', handleBlur, true)
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.getElementById('main-content')
    if (main) {
      main.focus()
      main.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className={`skip-link fixed top-4 left-4 z-[9999] px-6 py-3 bg-[#4DD0E1] text-white font-semibold rounded-full shadow-lg transition-all ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      } focus:translate-x-0 focus:opacity-100`}
    >
      Skip to main content
    </a>
  )
}

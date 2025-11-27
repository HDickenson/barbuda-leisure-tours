'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

// Navigation links with icons (matching live site)
const navLinks = [
  { text: 'Tours', url: '/our-tours' },
  { text: 'About Us', url: '/about-us' },
  { text: 'Reviews', url: '/reviews' },
  { text: 'FAQs', url: '/faq' },
  { text: 'Our Blog', url: '/our-blog' },
];

// Legal links
const legalLinks = [
  { text: 'Terms and Conditions', url: '/terms-and-conditions' },
  { text: 'Cancellation Policy', url: '/refund_returns' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Wave Divider Above Footer */}
      <div className={styles.waveContainer}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className={styles.wave} preserveAspectRatio="none">
          <path fill="#30BBD8" d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      {/* Main Footer Content - Pink Background */}
      <div className={styles.mainSection}>
        <div className={styles.container}>
          {/* Left Column - Logo and Contact with Large Circular Icons */}
          <div className={styles.leftColumn}>
            {/* Footer Logo */}
            <div className={styles.logoWrapper}>
              <Link href="/">
                <Image
                  src="/images/footer-logo-white.svg"
                  alt="Barbuda Leisure Day Tours"
                  width={180}
                  height={57}
                  className={styles.footerLogo}
                />
              </Link>
            </div>

            {/* Contact Items with Large Circular Icons */}
            <div className={styles.contactList}>
              {/* Location */}
              <div className={styles.contactItem}>
                <div className={styles.circleIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className={styles.contactText}>
                  <p>P.O. Box W595, Woods Centre</p>
                  <p>St. John&apos;s, Antigua &amp; Barbuda, W.I.</p>
                </div>
              </div>

              {/* Phone */}
              <div className={styles.contactItem}>
                <div className={styles.circleIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <a href="tel:+2687282538" className={styles.contactLink}>
                  +268-728-BLDT (2538)
                </a>
              </div>

              {/* Email */}
              <div className={styles.contactItem}>
                <div className={styles.circleIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <a href="mailto:bookings@barbudaleisure.com" className={styles.contactLink}>
                  bookings@barbudaleisure.com
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/BarbudaLeisureDayTours" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/barbudaleisuredaytours/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.5"/>
                </svg>
              </a>
              <a href="https://x.com/BarbudaLeisure" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column - Links with Circular Icons */}
          <div className={styles.rightColumn}>
            <h2 className={styles.linksTitle}>Links</h2>
            <ul className={styles.linksList}>
              {navLinks.map((link) => (
                <li key={link.url} className={styles.linkItem}>
                  <div className={styles.linkCircleIcon}></div>
                  <Link href={link.url} className={styles.navLink}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className={styles.bottomSection}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            © Copyright 2024 Barbuda Leisure Day Tours. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            {legalLinks.map((link) => (
              <Link key={link.url} href={link.url} className={styles.legalLink}>
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

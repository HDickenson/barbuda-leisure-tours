'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

const menuItems = [
  { text: 'Home', url: '/' },
  { text: 'Tours', url: '/our-tours' },
  { text: 'Reviews', url: '/reviews' },
  { text: 'FAQ', url: '/elementor-416' },
  { text: 'Blog', url: '/our-blog' },
  { text: 'About Us', url: '/about-us' },
];

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/BarbudaLeisureDayTours', icon: faFacebookF },
  { name: 'Instagram', url: 'https://www.instagram.com/barbudaleisuredaytours/', icon: faInstagram },
  { name: 'X', url: 'https://x.com/BarbudaLeisure', icon: faXTwitter }
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/BlackBarbuda-Leisure-Day-Tours-2-Colour.webp"
              alt="Barbuda Leisure Day Tours"
              width={200}
              height={70}
              className={styles.logo}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={styles.navLink}
              >
                {item.text}
              </Link>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.name}
              >
                <FontAwesomeIcon icon={social.icon} className={styles.socialIcon} />
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faXmark : faBars}
              className={styles.mobileMenuIcon}
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className={styles.mobileNav}>
            {menuItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.text}
              </Link>
            ))}
            <div className={styles.mobileSocialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                  aria-label={social.name}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBars, faXmark, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import ContactModal from './ContactModal';

const menuItems = [
  { text: 'Home', url: '/' },
  { text: 'Tours', url: '/our-tours' },
  { text: 'Reviews', url: '/reviews' },
  { text: 'FAQ', url: '/faq' },
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
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className={`${styles.header} ${isHome ? styles.headerTransparent : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/header-logo.webp"
              alt="Barbuda Leisure Day Tours"
              width={130}
              height={45}
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

          {/* Contact Button and Social Media Icons */}
          <div className={styles.socialLinks}>
            {/* Contact Button */}
            <button 
              onClick={() => setContactModalOpen(true)}
              className={styles.contactButton}
            >
              Contact <FontAwesomeIcon icon={faBullhorn} className={styles.contactIcon} />
            </button>
            
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

        <ContactModal 
          isOpen={contactModalOpen} 
          onClose={() => setContactModalOpen(false)} 
        />
      </div>
    </header>
  );
}

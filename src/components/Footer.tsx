'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';
import WaveDivider from './WaveDivider';
import UnderwaterWave from './UnderwaterWave';

// Extraction data: Social links
const socialLinks = [
  { platform: 'facebook', url: 'https://www.facebook.com/BarbudaLeisureDayTours', icon: faFacebookF },
  { platform: 'instagram', url: 'https://www.instagram.com/barbudaleisuredaytours/', icon: faInstagram },
  { platform: 'twitter', url: 'https://x.com/BarbudaLeisure', icon: faXTwitter },
];

// Extraction data: Contact info (from WordPress extraction)
const contactInfo = {
  address: "P.O. Box W595, Woods Centre\nSt. John's, Antigua & Barbuda, W.I.",
  phone: '+268-728-BLDT (2538)',
  email: 'bookings@barbudaleisure.com',
};

// Extraction data: Navigation links (from WordPress - correct order)
const navLinks = [
  { text: 'Tours', url: '/our-tours' },
  { text: 'About Us', url: '/about-us' },
  { text: 'Reviews', url: '/reviews' },
  { text: 'FAQs', url: '/faq' },
  { text: 'Our Blog', url: '/our-blog' },
];

// Extraction data: Legal links
const legalLinks = [
  { text: 'Terms and Conditions', url: '/terms-and-conditions' },
  { text: 'Cancellation Policy', url: '/refund_returns' },
];

// Wave-brush paths from WordPress extraction
const waveBrushPaths = [
  { d: "M283.5,9.7c0,0-7.3,4.3-14,4.6c-6.8,0.3-12.6,0-20.9-1.5c-11.3-2-33.1-10.1-44.7-5.7s-12.1,4.6-18,7.4c-6.6,3.2-20,9.6-36.6,9.3C131.6,23.5,99.5,7.2,86.3,8c-1.4,0.1-6.6,0.8-10.5,2c-3.8,1.2-9.4,3.8-17,4.7c-3.2,0.4-8.3,1.1-14.2,0.9c-1.5-0.1-6.3-0.4-12-1.6c-5.7-1.2-11-3.1-15.8-3.7C6.5,9.2,0,10.8,0,10.8V0h283.5V9.7z", className: "elementor-shape-fill", opacity: null },
  { d: "M269.6,18c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3C267.7,18.8,269.7,18,269.6,18z", className: "elementor-shape-fill", opacity: null },
  { d: "M227.4,9.8c-0.2-0.1-4.5-1-9.5-1.2c-5-0.2-12.7,0.6-12.3,0.5c0.3-0.1,5.9-1.8,13.3-1.2S227.6,9.9,227.4,9.8z", className: "elementor-shape-fill", opacity: null },
  { d: "M204.5,13.4c-0.1-0.1,2-1,3.2-1.1c1.2-0.1,2,0,2,0.3c0,0.3-0.1,0.5-1.6,0.4C206.4,12.9,204.6,13.5,204.5,13.4z", className: "elementor-shape-fill", opacity: null },
  { d: "M201,10.6c0-0.1-4.4,1.2-6.3,2.2c-1.9,0.9-6.2,3.1-6.1,3.1c0.1,0.1,4.2-1.6,6.3-2.6S201,10.7,201,10.6z", className: "elementor-shape-fill", opacity: null },
  { d: "M154.5,26.7c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3C152.6,27.5,154.6,26.8,154.5,26.7z", className: "elementor-shape-fill", opacity: null },
  { d: "M41.9,19.3c0,0,1.2-0.3,2.9-0.1c1.7,0.2,5.8,0.9,8.2,0.7c4.2-0.4,7.4-2.7,7-2.6c-0.4,0-4.3,2.2-8.6,1.9c-1.8-0.1-5.1-0.5-6.7-0.4S41.9,19.3,41.9,19.3z", className: "elementor-shape-fill", opacity: null },
  { d: "M75.5,12.6c0.2,0.1,2-0.8,4.3-1.1c2.3-0.2,2.1-0.3,2.1-0.5c0-0.1-1.8-0.4-3.4,0C76.9,11.5,75.3,12.5,75.5,12.6z", className: "elementor-shape-fill", opacity: null },
  { d: "M15.6,13.2c0-0.1,4.3,0,6.7,0.5c2.4,0.5,5,1.9,5,2c0,0.1-2.7-0.8-5.1-1.4C19.9,13.7,15.7,13.3,15.6,13.2z", className: "elementor-shape-fill", opacity: null }
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top Wave Divider */}
      <WaveDivider
        viewBox="0 0 283.5 27.8"
        fillColor="rgb(255, 255, 255)"
        height="120px"
        position="top"
        rotate={false}
        paths={waveBrushPaths}
      />

      {/* Main Footer Content */}
      <div className={styles.container}>
        {/* Left Column - Logo and Contact */}
        <div className={styles.leftColumn}>
          {/* Footer Logo */}
          <div className={styles.logoWrapper}>
            <Link href="/">
              <Image
                src="/images/footer-logo-white.svg"
                alt="Barbuda Leisure Day Tours"
                width={200}
                height={63}
                className={styles.footerLogo}
              />
            </Link>
          </div>

          {/* Contact Information */}
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <span className={styles.contactText}>
              P.O. Box W595, Woods Centre<br />
              St. John&apos;s, Antigua &amp; Barbuda, W.I.
            </span>
          </div>

          {/* Line above phone number */}
          <div className={styles.contactDivider}></div>

          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <a href="tel:+2687282538" className={styles.contactLink}>
              {contactInfo.phone}
            </a>
          </div>

          {/* Line below phone number */}
          <div className={styles.contactDivider}></div>

          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <a href={`mailto:${contactInfo.email}`} className={styles.contactLink}>
              {contactInfo.email}
            </a>
          </div>

          {/* Social Icons */}
          <div className={styles.socialIcons}>
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={social.platform}
              >
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Middle Column - Navigation Links */}
        <div className={styles.middleColumn}>
          <h2 className={styles.linksTitle}>Links</h2>
          <ul className={styles.linksList}>
            {navLinks.map((link, index) => (
              <li key={link.url}>
                <Link href={link.url} className={styles.navLink}>
                  {link.text}
                </Link>
                {/* Dotted divider lines between link items (4 lines total) */}
                {index < navLinks.length - 1 && (
                  <div className={styles.linkDivider}></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Underwater Wave Decoration */}
      <UnderwaterWave className={styles.underwaterWave} />

      {/* Bottom Pink Strip */}
      <div className={styles.bottomStrip}>
        <div className={styles.bottomContent}>
          <p className={styles.bottomText}>
            © Copyright 2024 Barbuda Leisure Day Tours. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            {legalLinks.map((link) => (
              <Link key={link.url} href={link.url} className={styles.bottomLink}>
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

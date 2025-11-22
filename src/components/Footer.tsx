'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';
import WaveDivider from './WaveDivider';
import OceanWaveDivider from './OceanWaveDivider';

// Wave-brush paths from WordPress
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

      {/* Ocean Wave Background */}
      <div className={styles.oceanWaveBackground}>
        <OceanWaveDivider
          fillColor="#006994"
          height="400px"
          position="top"
        />
      </div>

      {/* Underwater coral/seaweed silhouette at bottom */}
      <div className={styles.underwaterDecoration}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 200" preserveAspectRatio="xMidYMax slice">
          <g fill="rgba(0, 40, 80, 0.4)">
            {/* Coral and seaweed silhouettes */}
            <path d="M0,200 L0,160 Q20,140 30,160 Q40,130 60,150 Q70,120 90,140 Q100,110 120,130 L120,200 Z" />
            <path d="M80,200 L80,170 Q100,150 110,165 Q120,140 140,155 Q150,130 170,150 L170,200 Z" />
            <path d="M200,200 Q210,160 200,140 Q220,150 210,120 Q230,130 220,100 Q240,110 230,80" strokeWidth="8" stroke="rgba(0, 40, 80, 0.3)" fill="none" />
            <path d="M250,200 Q260,170 250,150 Q270,160 260,130 Q280,140 270,110" strokeWidth="6" stroke="rgba(0, 40, 80, 0.3)" fill="none" />
            <path d="M400,200 L400,140 Q420,120 440,140 Q460,100 480,130 Q500,90 520,120 Q540,80 560,110 Q580,100 600,130 L600,200 Z" />
            <path d="M550,200 L550,150 Q570,130 590,145 Q610,115 630,135 Q650,105 670,125 L670,200 Z" />
            <path d="M750,200 Q760,150 750,120 Q780,140 760,90 Q800,110 780,60" strokeWidth="10" stroke="rgba(0, 40, 80, 0.25)" fill="none" />
            <path d="M800,200 Q810,160 800,130 Q830,150 810,100" strokeWidth="8" stroke="rgba(0, 40, 80, 0.25)" fill="none" />
            <path d="M1000,200 L1000,130 Q1030,100 1050,125 Q1070,85 1100,115 Q1130,75 1150,105 L1150,200 Z" />
            <path d="M1200,200 L1200,150 Q1220,130 1240,145 Q1260,110 1280,135 L1280,200 Z" />
            <path d="M1400,200 Q1410,150 1400,110 Q1430,130 1410,80 Q1450,100 1430,50" strokeWidth="10" stroke="rgba(0, 40, 80, 0.3)" fill="none" />
            <path d="M1500,200 L1500,140 Q1530,110 1550,130 Q1580,90 1600,120 Q1630,80 1650,110 L1650,200 Z" />
            <path d="M1750,200 L1750,160 Q1780,140 1800,155 Q1830,120 1860,145 Q1890,110 1920,140 L1920,200 Z" />
          </g>
        </svg>
      </div>

      <div className={styles.container}>
        {/* Left Column - Logo & Contact */}
        <div className={styles.leftColumn}>
          {/* Logo - Text-based matching WordPress style */}
          <div className={styles.logoWrapper}>
            <div className={styles.logoText}>
              <span className={styles.logoBlack}>Barbuda</span>
              <span className={styles.logoPink}>Leisure</span>
              <span className={styles.logoSubtext}>Day Tours</span>
            </div>
            <p className={styles.tagline}>One Day, Endless Memories...</p>
          </div>

          {/* Address */}
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <span className={styles.contactText}>
              P.O. Box W595, Woods Centre<br />
              St. John&apos;s, Antigua &amp; Barbuda, W.I.
            </span>
          </div>

          <div className={styles.divider}></div>

          {/* Phone */}
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <a href="tel:+2687282538" className={styles.contactLink}>
              +268-728-BLDT (2538)
            </a>
          </div>

          <div className={styles.divider}></div>

          {/* Email */}
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <a href="mailto:bookings@barbudaleisure.com" className={styles.contactLink}>
              bookings@barbudaleisure.com
            </a>
          </div>

          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/BarbudaLeisureDayTours" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.instagram.com/barbudaleisuredaytours/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://x.com/BarbudaLeisure" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
          </div>
        </div>

        {/* Right Column - Links */}
        <div className={styles.rightColumn}>
          <h3 className={styles.linksTitle}>Links</h3>
          <ul className={styles.linksList}>
            <li>
              <span className={styles.bullet}>●</span>
              <Link href="/our-tours" className={styles.navLink}>Tours</Link>
            </li>
            <li>
              <span className={styles.bullet}>●</span>
              <Link href="/about-us" className={styles.navLink}>About Us</Link>
            </li>
            <li>
              <span className={styles.bullet}>●</span>
              <Link href="/reviews" className={styles.navLink}>Reviews</Link>
            </li>
            <li>
              <span className={styles.bullet}>●</span>
              <Link href="/elementor-416" className={styles.navLink}>FAQs</Link>
            </li>
            <li>
              <span className={styles.bullet}>●</span>
              <Link href="/our-blog" className={styles.navLink}>Our Blog</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Pink Strip */}
      <div className={styles.bottomStrip}>
        <div className={styles.bottomContent}>
          <span className={styles.bottomText}>
            © Copyright 2024 Barbuda Leisure Day Tours. All rights reserved.
          </span>
          <div className={styles.bottomLinks}>
            <Link href="/terms-and-conditions" className={styles.bottomLink}>
              Terms and Conditions
            </Link>
            <Link href="/refund_returns" className={styles.bottomLink}>
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

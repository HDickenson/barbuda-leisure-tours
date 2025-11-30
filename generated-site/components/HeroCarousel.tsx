// TEMPLATE: Hero Carousel Component
// PLACEHOLDERS: AUTOPLAY_DELAY, CAROUSEL_HEIGHT, SLIDE_COUNT
// DEPENDENCIES: swiper@^11.0.0
// DESCRIPTION: Full-width hero carousel with autoplay, navigation, and pagination

'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import styles from './HeroCarousel.module.css';

interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  backgroundOverlayColor?: string;
  minHeight?: string;
}

export default function HeroCarousel({ slides, backgroundOverlayColor, minHeight }: HeroCarouselProps) {
  return (
    <div className={styles.container}>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        initialSlide={0}
        className="hero-carousel"
        style={{ height: minHeight, position: 'relative' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={styles.slideBackground}
              style={{
                backgroundImage: `url(${slide.image})`
              }}
              role="img"
              aria-label={slide.alt}
            />
            <div
              className={styles.slideOverlay}
              style={{
                backgroundColor: backgroundOverlayColor
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hero Text Overlay - Turquoise box matching WordPress */}
      <div className={styles.overlay}>
        <div className={styles.textBox}>
          <h1 className={styles.mainHeading}>
            Discover Barbuda for a Day…
          </h1>
          <h2 className={styles.subHeading}>
            Your escape to the untouched beauty of this Caribbean paradise!
          </h2>
          <Link href="/our-tours" className={styles.ctaButton}>
            Explore Our Tours
            <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// TEMPLATE: Hero Carousel Component
// PLACEHOLDERS: AUTOPLAY_DELAY, CAROUSEL_HEIGHT, SLIDE_COUNT
// DEPENDENCIES: swiper@^11.0.0
// DESCRIPTION: Full-width hero carousel with autoplay, navigation, and pagination

'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import styles from './HeroCarousel.module.css';

interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  return (
    <div className={styles.container}>
      <style jsx global>{`
        .hero-carousel {
          position: relative;
        }
        .hero-carousel .swiper-button-next,
        .hero-carousel .swiper-button-prev {
          background: rgba(255, 255, 255, 0.95);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          color: #17a2b8 !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          z-index: 100 !important;
        }
        .hero-carousel .swiper-button-next:after,
        .hero-carousel .swiper-button-prev:after {
          font-size: 24px !important;
          font-weight: bold;
        }
        .hero-carousel .swiper-button-next:hover,
        .hero-carousel .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }
        .hero-carousel .swiper-pagination {
          bottom: 20px !important;
          z-index: 100 !important;
        }
        .hero-carousel .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.8;
          width: 14px;
          height: 14px;
          margin: 0 6px !important;
        }
        .hero-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          background: #17a2b8;
          transform: scale(1.2);
        }
      `}</style>
      <Swiper
        modules={[Autoplay]}
        navigation={false}
        pagination={false}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        initialSlide={0}
        className="hero-carousel"
        style={{ height: '80vh', position: 'relative' }}
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
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hero Text Overlay - Turquoise box matching WordPress */}
      <div className={styles.overlay}>
        <div className={styles.textBox}>
          <h1 className={styles.mainHeading}>
            Discover Barbuda for a Day...
          </h1>
          <h2 className={styles.subHeading}>
            Your escape to the untouched beauty of this Caribbean paradise!
          </h2>
          <Link href="/our-tours" className={styles.ctaButton}>
            Explore Our Tours
          </Link>
        </div>
      </div>
    </div>
  );
}

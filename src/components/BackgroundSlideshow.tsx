'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from './BackgroundSlideshow.module.css';

interface Slide {
  id: number;
  image: string;
  alt: string;
}

interface BackgroundSlideshowProps {
  slides: Slide[];
  height?: string;
  overlayOpacity?: number;
}

export default function BackgroundSlideshow({
  slides,
  height = '500px',
  overlayOpacity = 0.4
}: BackgroundSlideshowProps) {
  return (
    <div className={styles.container} style={{ height }}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        loop={true}
        speed={1000}
        className={styles.swiper}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={styles.slide}
              style={{
                backgroundImage: `url(${slide.image})`
              }}
              role="img"
              aria-label={slide.alt}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={styles.overlay}
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity * 2}), rgba(0,0,0,${overlayOpacity * 0.8}) 40%, transparent)`
        }}
      />
    </div>
  );
}

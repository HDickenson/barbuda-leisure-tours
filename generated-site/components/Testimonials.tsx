'use client';

import { useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    author: "Jessica R.",
    text: "Barbuda took our breath away! We loved every minute—from the pink sands to the serene bird sanctuary, it was all picture-perfect. Our guide was wonderful and made the tour informative and fun."
  },
  {
    author: "Daniel S.",
    text: "The island is truly a hidden gem, and the experience was seamless. The team went above and beyond to ensure we had everything we needed and more."
  },
  {
    author: "Sophia T.",
    text: "This was the highlight of our trip! Barbuda's natural beauty is unmatched, and the beaches were spectacular. The whole experience was well-organized."
  },
  {
    author: "James P.",
    text: "The best way to see Barbuda! From the boat ride to the stunning beaches and incredible bird watching, we felt like we were in our own little paradise."
  },
  {
    author: "Emily W.",
    text: "The team was so professional and friendly, and we learned so much about the island's history and wildlife. Loved the personalized touches."
  },
  {
    author: "Michael L.",
    text: "Barbuda Leisure handled every detail perfectly, from the transport to the warm welcome. The tour was relaxed, informative, and truly showcased unique beauty."
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>What Our Guests Say</h2>

        <div className={styles.carouselContainer}>
          <div className={styles.relative}>
            {/* Carousel Container */}
            <div className={styles.overflow}>
              <div
                className={styles.slider}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className={styles.slide}>
                    <div className={styles.card}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={styles.star}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className={styles.text}>&ldquo;{testimonial.text}&rdquo;</p>
                      <p className={styles.author}>— {testimonial.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              aria-label="Previous testimonial"
            >
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextTestimonial}
              className={`${styles.navButton} ${styles.navButtonRight}`}
              aria-label="Next testimonial"
            >
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className={styles.dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${styles.dot} ${
                  index === currentIndex ? styles.dotActive : styles.dotInactive
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

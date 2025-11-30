'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './BlogPreviewSection.module.css';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  link?: string;
}

interface BlogPreviewSectionProps {
  posts: BlogPost[];
  heading?: string;
  backgroundColor?: string;
  padding?: string;
}

export default function BlogPreviewSection({
  posts,
  heading = "Latest Updates",
  backgroundColor = "transparent",
  padding = "80px 20px"
}: BlogPreviewSectionProps) {
  return (
    <section
      className={styles.section}
      style={{
        backgroundColor,
        padding
      }}
    >
      <div className={styles.container}>
        {heading && (
          <h2 className={styles.heading}>
            {heading}
          </h2>
        )}

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView="auto"
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 25
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30
            }
          }}
          className={styles.carousel}
        >
          {posts.map((post, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <article className={styles.article}>
                {post.image && (
                  <div className={styles.imageContainer}>
                    <img
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      className={styles.image}
                    />
                  </div>
                )}

                <h3 className={styles.title}>
                  {post.link ? (
                    <a
                      href={post.link}
                      className={styles.titleLink}
                    >
                      {post.title}
                    </a>
                  ) : (
                    post.title
                  )}
                </h3>

                <p className={styles.excerpt}>
                  {post.excerpt}
                </p>

                {post.link && (
                  <a
                    href={post.link}
                    className={styles.readMore}
                  >
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                  </a>
                )}
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

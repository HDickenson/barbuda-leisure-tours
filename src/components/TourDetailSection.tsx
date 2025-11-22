// Tour Detail Section Component
// Reusable section for individual tour descriptions (Sea, Air, Private Charter)

import Image from 'next/image';
import styles from './TourDetailSection.module.css';

interface TourDetailSectionProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function TourDetailSection({
  title,
  description,
  image,
  imageAlt,
  imagePosition = 'left',
  backgroundColor = 'transparent',
  buttonText = 'Read More',
  buttonHref = '#'
}: TourDetailSectionProps) {
  const isImageLeft = imagePosition === 'left';

  return (
    <section
      className={styles.section}
      style={{ backgroundColor }}
    >
      <div className={styles.container}>
        <div className={`${styles.flexContainer} ${!isImageLeft ? styles.flexContainerReverse : ''}`}>
          {/* Image */}
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src={image}
                alt={imageAlt}
                fill
                className={styles.image}
              />
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <h2 className={styles.title}>
              {title}
            </h2>
            <p className={styles.description}>
              {description}
            </p>
            {buttonText && (
              <a href={buttonHref} className={styles.button}>
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

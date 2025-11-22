// TEMPLATE: Tours Section Component
// PLACEHOLDERS: SECTION_HEADING, BACKGROUND_COLOR, PADDING
// DEPENDENCIES: (none)
// DESCRIPTION: Tours grid section with images, titles, and CTAs

import styles from './ExploreOurAmazingToursSection.module.css';

interface TourCard {
  image: string;
  alt: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

interface ToursSectionProps {
  tours: TourCard[];
  heading: string;
  backgroundColor?: string;
}

export default function ToursSection({
  tours,
  heading,
  backgroundColor = '#FFFFFF'
}: ToursSectionProps) {
  return (
    <section
      className={styles.section}
      style={{ backgroundColor }}
    >
      <div className={styles.container}>
        <h2 className={styles.heading}>
          {heading}
        </h2>

        <div className={styles.grid}>
          {tours.map((tour, index) => (
            <div key={index} className={styles.tourCard}>
              <div className={styles.tourImage}>
                <img src={tour.image} alt={tour.alt} className={styles.image} />
              </div>
              <div className={styles.tourContent}>
                <h3 className={styles.tourTitle}>
                  {tour.title}
                </h3>
                {tour.description && (
                  <p className={styles.tourDescription}>{tour.description}</p>
                )}
                {tour.buttonText && (
                  <a
                    href={tour.buttonHref || '#'}
                    className={styles.button}
                  >
                    {tour.buttonText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

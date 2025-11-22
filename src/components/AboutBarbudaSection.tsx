// TEMPLATE: About Barbuda Section - Two Column Layout
// PLACEHOLDERS: BACKGROUND_COLOR, PADDING
// DEPENDENCIES: (none)
// DESCRIPTION: Two-column section with images on left and text on right

import styles from './AboutBarbudaSection.module.css';

interface SectionContent {
  heading: string;
  subHeading?: string;
  paragraphs?: string[];
  buttons?: Array<{
    text: string;
    href: string;
    backgroundColor?: string;
    textColor?: string;
  }>;
}

interface GenericSectionProps {
  content: SectionContent;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export default function GenericSection({
  content,
  backgroundColor = 'transparent'
}: GenericSectionProps) {
  return (
    <section
      className={styles.section}
      style={{ backgroundColor }}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Card 1 */}
          <div className={styles.card}>
            <img
              src="https://www.barbudaleisure.com/wp-content/uploads/2024/11/DSC3121-scaled.jpg"
              alt="Barbuda Beach"
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>
              Barbuda Beach
            </h3>
            <p className={styles.cardDescription}>
              Experience pristine pink sand beaches and crystal-clear turquoise waters.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.card}>
            <img
              src="https://www.barbudaleisure.com/wp-content/uploads/2024/10/The-Catamaran-As-It-Rests-on-one-of-Barbudas-beachs.webp"
              alt="Catamaran Tours"
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>
              Catamaran Tours
            </h3>
            <p className={styles.cardDescription}>
              Sail to Barbuda in comfort and style on our luxury catamaran charters.
            </p>
          </div>
        </div>

        {/* Heading below cards */}
        <div className={styles.contentSection}>
          {content.subHeading && (
            <h2 className={styles.subHeading}>
              {content.subHeading}
            </h2>
          )}
          <h2 className={styles.heading}>
            {content.heading}
          </h2>

          {content.paragraphs && content.paragraphs.map((para, index) => (
            <p key={index} className={styles.paragraph}>
              {para}
            </p>
          ))}

          {content.buttons && (
            <div className={styles.buttonsContainer}>
              {content.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={styles.button}
                  style={{
                    backgroundColor: button.backgroundColor || 'rgb(23, 162, 184)',
                    color: button.textColor || '#ffffff'
                  }}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

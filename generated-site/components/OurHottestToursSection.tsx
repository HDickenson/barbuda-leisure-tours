// TEMPLATE: Generic Section Component
// PLACEHOLDERS: BACKGROUND_COLOR, PADDING
// DEPENDENCIES: (none)
// DESCRIPTION: Generic flexible section with headings, paragraphs, and buttons

import styles from './OurHottestToursSection.module.css';

interface SectionContent {
  heading: string;
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
  backgroundColor = 'transparent',
  textAlign = 'left'
}: GenericSectionProps) {
  return (
    <section
      className={styles.section}
      style={{
        backgroundColor,
        textAlign
      }}
    >
      <div className={styles.container}>
        <h2 className={styles.heading}>{content.heading}</h2>

        {content.paragraphs && content.paragraphs.map((para, index) => (
          <p key={index} className={styles.paragraph}>{para}</p>
        ))}

        {content.buttons && (
          <div className={styles.buttonsContainer} style={{ justifyContent: textAlign }}>
            {content.buttons.map((button, index) => (
              <a
                key={index}
                href={button.href}
                className={styles.button}
                style={{
                  backgroundColor: button.backgroundColor || 'rgb(48, 187, 216)',
                  color: button.textColor || '#ffffff'
                }}
              >
                {button.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

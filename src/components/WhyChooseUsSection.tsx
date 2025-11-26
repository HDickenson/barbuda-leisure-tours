'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faUsers, faGem, faClock } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './WhyChooseUsSection.module.css';

interface Feature {
  title: string;
  description?: string;
  icon?: 'handshake' | 'users' | 'diamond' | 'clock';
}

interface FeaturesSectionProps {
  features: Feature[];
  heading: string;
  intro?: string;
  backgroundColor?: string;
}

const icons: Record<string, IconDefinition> = {
  handshake: faHandshake,
  users: faUsers,
  diamond: faGem,
  clock: faClock,
};

export default function WhyChooseUsSection({
  features,
  heading,
  intro,
  backgroundColor = 'transparent'
}: FeaturesSectionProps) {
  return (
    <section className={styles.section} style={{ backgroundColor }}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{heading}</h2>

        {intro && (
          <p className={styles.intro}>{intro}</p>
        )}

        <div className={styles.dividerLine}></div>

        <div className={styles.grid}>
          {features.map((feature, index) => {
            const icon = feature.icon ? icons[feature.icon] : null;
            return (
              <div key={index} className={styles.featureCard}>
                {icon && (
                  <div className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={icon} className={styles.icon} />
                  </div>
                )}
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                {feature.description && (
                  <p className={styles.featureDescription}>{feature.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

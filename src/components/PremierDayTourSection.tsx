'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './PremierDayTourSection.module.css';

interface PremierDayTourSectionProps {
  heading: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function PremierDayTourSection({
  heading,
  description,
  buttonText = 'Explore Our Tours',
  buttonHref = '/our-tours'
}: PremierDayTourSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.description}>{description}</p>
          <Link href={buttonHref} className={styles.button}>
            {buttonText}
            <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
}

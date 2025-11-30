'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './TourCardsSection.module.css';

interface TourCard {
  id?: string;
  title: string;
  image: string;
  link: string;
  popular?: boolean;
  button?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

interface TourCardsSectionProps {
  heading: string;
  cards: TourCard[];
  backgroundColor?: string;
}

export default function TourCardsSection({
  heading,
  cards,
  backgroundColor = 'transparent'
}: TourCardsSectionProps) {
  return (
    <section className={styles.section} style={{ backgroundColor }}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.grid}>
          {cards.map((card, index) => (
            <div key={card.id || index} className={styles.card}>
              <div className={styles.imageWrapper}>
                {card.popular && (
                  <span className={styles.popularBadge}>POPULAR</span>
                )}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <Link
                  href={card.link}
                  className={styles.learnMore}
                  style={{
                    backgroundColor: card.button?.backgroundColor,
                    color: card.button?.textColor,
                  }}
                >
                  Learn More
                  <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

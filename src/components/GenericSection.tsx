'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './GenericSection.module.css';

// Helper function to calculate hover color (darker version)
function getHoverColor(bgColor: string | undefined): string {
  if (!bgColor) return '#26a7c4'; // Default turquoise hover

  // Map known colors to their hover variants
  const colorMap: Record<string, string> = {
    'rgb(48, 187, 216)': 'rgb(38, 167, 196)',   // Turquoise
    '#30bbd8': '#26a7c4',
    'rgb(245, 182, 211)': 'rgb(240, 165, 200)', // Pink
    '#f5b6d3': '#f0a5c8',
  };

  const normalized = bgColor.toLowerCase().replace(/\s/g, '');
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized === key.toLowerCase().replace(/\s/g, '')) {
      return value;
    }
  }

  // Default: return a slightly darker version (fallback)
  return '#26a7c4';
}

// Helper function to map font family names to CSS variables
function mapFontFamily(fontFamily: string | undefined): string | undefined {
  if (!fontFamily) return undefined;
  const lower = fontFamily.toLowerCase();
  // Check for exact matches or if the string contains the font name
  if (lower.includes('lexend deca')) return 'var(--font-lexend-deca), sans-serif';
  if (lower.includes('leckerli')) return 'var(--font-leckerli), cursive';
  if (lower.includes('open sans')) return 'var(--font-open-sans), sans-serif';
  if (lower.includes('roboto slab')) return 'var(--font-roboto-slab), serif';
  if (lower.includes('roboto')) return 'var(--font-roboto), sans-serif';
  if (lower.includes('lato')) return 'var(--font-lato), sans-serif';
  if (lower.includes('ibm plex')) return 'var(--font-ibm-plex), sans-serif';
  return fontFamily;
}

interface HeadingData {
  tag: string;
  text: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
}

interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ButtonData {
  text: string;
  href: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  padding?: string;
}

interface ParagraphData {
  text: string;
  fontSize?: string;
  color?: string;
  fontFamily?: string;
}

interface ExtractedContent {
  headings?: HeadingData[];
  paragraphs?: ParagraphData[];
  images?: ImageData[];
  buttons?: ButtonData[];
}

interface GenericSectionProps {
  // New: Support extracted Elementor data structure
  content?: ExtractedContent;
  styles?: {
    backgroundColor?: string;
    padding?: string;
    minHeight?: string;
    [key: string]: string | undefined;
  };

  // Backward compatibility: Simple props
  heading?: string;
  subheading?: string;
  bodyHtml?: string;
  backgroundColor?: string;
  padding?: string;
}

export default function GenericSection({
  content,
  styles: stylesProp,
  // Backward compatibility props
  heading,
  subheading,
  bodyHtml,
  backgroundColor,
  padding
}: GenericSectionProps) {
  // Use new structure if available, otherwise fall back to old props
  const sectionStyles = stylesProp || {
    backgroundColor: backgroundColor || 'transparent',
    padding: padding || '4rem 1rem'
  };

  // If using new structure (extracted Elementor data)
  if (content) {
    // Detect feature grid pattern: 1 main heading + N feature headings + matching paragraphs
    const hasFeatureGrid = content.headings && content.headings.length > 1 &&
                          content.paragraphs && content.paragraphs.length > 1 &&
                          content.headings.length === content.paragraphs.length;

    // Detect tour card pattern: 1 main heading + N captions matching N images
    const hasTourCardPattern = content.headings && content.images &&
                               content.headings.length === content.images.length + 1 &&
                               content.headings.length > 2;

    return (
      <section
        className={styles.section}
        style={{
          backgroundColor: sectionStyles.backgroundColor,
          padding: sectionStyles.padding,
          minHeight: sectionStyles.minHeight
        }}
      >
        <div className={styles.container}>
          {/* Main heading (for non-tour-card sections) */}
          {content.headings && content.headings.length > 0 && !hasTourCardPattern && (
            <div className={styles.headingContainer}>
              {(() => {
                const h = content.headings[0];
                const HeadingTag = h.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                return (
                  <>
                    <HeadingTag
                      className={styles.headingMain}
                      style={{
                        fontFamily: mapFontFamily(h.fontFamily),
                        fontSize: h.fontSize,
                        fontWeight: h.fontWeight,
                        color: h.color,
                        textAlign: (h.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined) || 'center'
                      }}
                    >
                      {h.text}
                    </HeadingTag>
                    {/* Decorative line for standalone headings */}
                    {!hasFeatureGrid && content.headings.length === 1 && (
                      <div
                        className={styles.decorativeLine}
                        style={{ backgroundColor: h.color || 'rgb(71, 2, 2)' }}
                      />
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Tour card section heading */}
          {hasTourCardPattern && content.headings && content.headings[0] && (
            <div className={styles.tourHeadingContainer}>
              {(() => {
                const h = content.headings[0];
                const HeadingTag = h.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                return (
                  <HeadingTag
                    className={styles.tourHeading}
                    style={{
                      fontFamily: mapFontFamily(h.fontFamily),
                      fontSize: h.fontSize,
                      fontWeight: h.fontWeight,
                      color: h.color,
                      textAlign: (h.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined) || 'center'
                    }}
                  >
                    {h.text}
                  </HeadingTag>
                );
              })()}
            </div>
          )}

          {/* Main intro paragraph (if feature grid pattern) */}
          {hasFeatureGrid && content.paragraphs && content.paragraphs[0] && (
            <p
              className={styles.introParagraph}
              style={{
                fontSize: content.paragraphs[0].fontSize,
                color: content.paragraphs[0].color,
                fontFamily: mapFontFamily(content.paragraphs[0].fontFamily)
              }}
            >
              {content.paragraphs[0].text}
            </p>
          )}

          {/* Feature grid (if pattern detected) */}
          {hasFeatureGrid && (
            <div className={styles.featureGrid}>
              {content.headings && content.headings.slice(1).map((h, i) => {
                const HeadingTag = h.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                const para = content.paragraphs![i + 1];
                return (
                  <div key={i} className={styles.featureItem}>
                    <HeadingTag
                      className={styles.featureHeading}
                      style={{
                        fontFamily: mapFontFamily(h.fontFamily),
                        fontSize: h.fontSize,
                        fontWeight: h.fontWeight,
                        color: h.color
                      }}
                    >
                      {h.text}
                    </HeadingTag>
                    {para && (
                      <p
                        className={styles.featureParagraph}
                        style={{
                          fontSize: para.fontSize,
                          color: para.color,
                          fontFamily: mapFontFamily(para.fontFamily)
                        }}
                      >
                        {para.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Fallback: Render headings and paragraphs separately (non-feature pattern) */}
          {!hasFeatureGrid && content.headings && content.headings.length > 1 && (
            <div className={styles.headingsContainer}>
              {content.headings.slice(1).map((h, i) => {
                const HeadingTag = h.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                return (
                  <HeadingTag
                    key={i}
                    className={styles.headingItem}
                    style={{
                      fontFamily: mapFontFamily(h.fontFamily),
                      fontSize: h.fontSize,
                      fontWeight: h.fontWeight,
                      color: h.color,
                      textAlign: (h.textAlign as 'left' | 'center' | 'right' | 'justify' | undefined) || 'left'
                    }}
                  >
                    {h.text}
                  </HeadingTag>
                );
              })}
            </div>
          )}

          {!hasFeatureGrid && content.paragraphs && content.paragraphs.length > 0 && (
            <div className={styles.paragraphsContainer}>
              {content.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={styles.paragraph}
                  style={{
                    fontSize: p.fontSize,
                    color: p.color,
                    fontFamily: mapFontFamily(p.fontFamily)
                  }}
                >
                  {p.text}
                </p>
              ))}
            </div>
          )}

          {/* Render images - with buttons if 1:1 match (tour card pattern) */}
          {content.images && content.images.length > 0 && (
            <div
              className={styles.imagesGrid}
              data-count={content.images.length <= 2 ? content.images.length : undefined}
              data-count-gt-2={content.images.length > 2 ? 'true' : undefined}
            >
              {content.images.map((img, i) => {
                const hasMatchingButton = content.buttons && content.buttons.length === content.images!.length;
                const button = hasMatchingButton ? content.buttons![i] : null;
                // For tour cards: headings[0] is main heading, headings[1..N] are captions
                const caption = hasTourCardPattern && content.headings ? content.headings[i + 1] : null;

                return (
                  <div key={i} className={styles.imageWrapper}>
                    <Image
                      src={img.src}
                      alt={img.alt || `Image ${i + 1}`}
                      width={img.width || 800}
                      height={img.height || 600}
                      className={styles.image}
                      data-has-caption={caption ? 'true' : undefined}
                      data-has-button={button && !caption ? 'true' : undefined}
                    />
                    {caption && (
                      <div
                        className={styles.caption}
                        data-has-button={button ? 'true' : undefined}
                        style={{
                          fontFamily: mapFontFamily(caption.fontFamily) || 'var(--font-lexend-deca), sans-serif',
                          fontSize: caption.fontSize || '16px',
                          fontWeight: caption.fontWeight || '600',
                          color: caption.color || 'rgb(122, 122, 122)'
                        }}
                      >
                        {caption.text}
                      </div>
                    )}
                    {button && (
                      <Link href={button.href}>
                        <button
                          className={styles.button}
                          style={{
                            '--btn-bg': button.backgroundColor || '#30bbd8',
                            '--btn-bg-hover': getHoverColor(button.backgroundColor),
                            '--btn-color': button.color || '#ffffff',
                            fontSize: button.fontSize || '0.875rem',
                            padding: button.padding || '0.75rem 2rem'
                          } as React.CSSProperties}
                        >
                          {button.text}
                        </button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Render standalone buttons (if not paired with images) */}
          {content.buttons && content.buttons.length > 0 &&
           (!content.images || content.buttons.length !== content.images.length) && (
            <div className={styles.buttonsContainer}>
              {content.buttons.map((btn, i) => (
                <Link key={i} href={btn.href}>
                  <button
                    className={styles.standaloneButton}
                    style={{
                      '--btn-bg': btn.backgroundColor || '#30bbd8',
                      '--btn-bg-hover': getHoverColor(btn.backgroundColor),
                      '--btn-color': btn.color || '#ffffff',
                      fontSize: btn.fontSize || '1rem',
                      padding: btn.padding || '0.75rem 2rem'
                    } as React.CSSProperties}
                  >
                    {btn.text}
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Backward compatibility: Old simple structure
  return (
    <section
      className={styles.legacySection}
      style={{
        backgroundColor: backgroundColor || 'transparent',
        padding: padding || '4rem 1rem'
      }}
    >
      <div className="container mx-auto">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-lg text-center mb-6 max-w-2xl mx-auto">
            {subheading}
          </p>
        )}
        {bodyHtml && (
          <div
            className="prose max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        )}
      </div>
    </section>
  );
}

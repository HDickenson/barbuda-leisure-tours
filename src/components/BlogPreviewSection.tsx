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

        <div className={styles.grid}>
          {posts.map((post, index) => (
            <article key={index} className={styles.article}>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

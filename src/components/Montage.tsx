import React, { useEffect, useState } from "react";

type MontageImage = {
  src: string;
  alt?: string;
};

type LayoutId = "auto" | "layout1" | "layout2" | "layout3" | "layout4";
type Variant = "hero" | "tall" | "wide" | "square";

interface MontageProps {
  images: MontageImage[];
  className?: string;
  /**
   * layout:
   * - "auto"    -> choose layout based on number of images
   * - "layout1" -> hero-left style
   * - "layout2" -> hero-right style
   * - "layout3" -> hero-top style
   * - "layout4" -> mosaic style
   */
  layout?: LayoutId;
}

const resolveLayout = (total: number, layout: LayoutId): Exclude<LayoutId, "auto"> => {
  if (layout !== "auto") return layout;

  // Auto mode: simple heuristic based on count
  if (total <= 3) return "layout3";      // hero-top works well with few images
  if (total === 4) return "layout4";     // mosaic
  if (total === 5) return "layout1";     // hero-left
  if (total === 6) return "layout2";     // hero-right
  // 7+ – alternate between 1 and 2 just to mix it up
  return total % 2 === 0 ? "layout1" : "layout2";
};

const LAYOUT_PATTERNS: Record<Exclude<LayoutId, "auto">, Variant[]> = {
  // Layout 1: hero-left
  // [0] big hero, [1] tall, [2,3] squares to the right, [4] wide bottom, [5] square
  layout1: ["hero", "tall", "square", "square", "wide", "square"],

  // Layout 2: hero-right
  // [0] tall left, [1] square, [2] big hero right, [3] square, [4] wide bottom, [5] square
  layout2: ["tall", "square", "hero", "square", "wide", "square"],

  // Layout 3: hero-top
  // [0] wide hero top, [1,2] squares under, [3] tall right, [4,5] squares
  layout3: ["wide", "square", "square", "tall", "square", "square"],

  // Layout 4: mosaic
  // more even, grid-like with emphasis on first row
  layout4: ["wide", "wide", "square", "square", "square", "square"],
};

const getVariantForIndex = (
  index: number,
  total: number,
  layout: Exclude<LayoutId, "auto">
): Variant => {
  const pattern = LAYOUT_PATTERNS[layout];

  if (total <= pattern.length) {
    return pattern[index] ?? "square";
  }

  // For more images than pattern definition, just repeat pattern
  return pattern[index % pattern.length] ?? "square";
};

const Montage: React.FC<MontageProps> = ({
  images,
  className = "",
  layout = "auto",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!images || images.length === 0) return null;

  const effectiveLayout = resolveLayout(images.length, layout);

  return (
    <div
      className={`montage-root ${
        isMounted ? "montage-root--mounted" : ""
      } ${className}`}
    >
      <div className={`montage-grid montage-grid--${effectiveLayout}`}>
        {images.map((image, index) => {
          const variant = getVariantForIndex(index, images.length, effectiveLayout);

          return (
            <div
              key={`${image.src}-${index}`}
              className={`montage-item montage-item--${variant}`}
              style={{
                animationDelay: `${index * 120}ms`, // stagger only on first mount
              }}
            >
              <img
                src={image.src}
                alt={image.alt ?? ""}
                loading="lazy"
                className="montage-img"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Montage;


export interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

export interface WavePath {
  d: string;
  className: string;
  opacity: string | null;
}

export interface WaveDivider {
  paths: WavePath[];
  viewBox: string;
  fillColor: string;
  position: 'top' | 'bottom';
  height: string;
}

export interface Tour {
  image: string;
  alt: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  heroImage?: string;
  slug?: string;
  subtitle?: string;
  price?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string | null;
}

export interface Section {
  heading: string;
  backgroundColor: string;
  tours?: Tour[];
  features?: Feature[];
  paragraphs?: string[];
  buttonText?: string;
  buttonHref?: string;
  backgroundImage?: string;
  content?: {
    heading: string;
    subHeading: string;
    paragraphs: string[];
    buttons: {
      text: string;
      href: string;
      backgroundColor: string;
      textColor: string;
      padding: string;
      borderRadius: string;
    }[];
  };
  textAlign?: 'left' | 'center' | 'right';
}

export interface PageData {
  carouselSlides: CarouselSlide[];
  waveDividers: WaveDivider[];
  sections: Section[];
}

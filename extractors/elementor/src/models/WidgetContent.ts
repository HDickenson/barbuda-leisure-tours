/**
 * WidgetContent models
 * Content structures for different Elementor widget types
 */

/**
 * Heading widget content
 */
export interface HeadingContent {
  title: string;
  htmlTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  link?: {
    url: string;
    isExternal: boolean;
    nofollow: boolean;
  };
}

/**
 * Text editor widget content
 */
export interface TextEditorContent {
  editor: string; // HTML content
  dropCap?: boolean;
  columnsCount?: number;
  columnGap?: number;
}

/**
 * Image widget content
 */
export interface ImageContent {
  image: {
    url: string;
    id?: number; // WordPress media ID
    alt: string;
  };
  imageSize: 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' | 'custom';
  caption?: string;
  link?: {
    url: string;
    isExternal: boolean;
    nofollow: boolean;
  };
  openLightbox: boolean;
}

/**
 * Button widget content
 */
export interface ButtonContent {
  text: string;
  link: {
    url: string;
    isExternal: boolean;
    nofollow: boolean;
  };
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: {
    value: string; // Icon class or SVG
    library: 'solid' | 'regular' | 'brands' | 'custom';
  };
  iconAlign: 'left' | 'right';
}

/**
 * Video widget content
 */
export interface VideoContent {
  videoType: 'youtube' | 'vimeo' | 'dailymotion' | 'hosted';
  youtubeUrl?: string;
  vimeoUrl?: string;
  dailymotionUrl?: string;
  hostedUrl?: string;
  startTime?: number; // Seconds
  endTime?: number; // Seconds
  autoplay: boolean;
  mute: boolean;
  loop: boolean;
  controls: boolean;
  modestBranding: boolean; // YouTube specific
  privacyMode: boolean; // YouTube specific
  relatedVideos: boolean; // YouTube specific
  aspectRatio: '169' | '219' | '43' | '32' | '11' | 'custom';
  customAspectRatio?: string; // e.g., "16:9"
  playIconColor?: string;
  lightboxEnabled: boolean;
  thumbnailImage?: {
    url: string;
    id?: number;
  };
}

/**
 * Icon widget content
 */
export interface IconContent {
  icon: {
    value: string; // Icon class or SVG
    library: 'solid' | 'regular' | 'brands' | 'custom';
  };
  link?: {
    url: string;
    isExternal: boolean;
    nofollow: boolean;
  };
  view: 'default' | 'stacked' | 'framed';
  shape: 'circle' | 'square';
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  rotate?: number;
  hoverAnimation?: string;
}

/**
 * Spacer widget content
 */
export interface SpacerContent {
  space: number; // Height in pixels
  spaceTablet?: number;
  spaceMobile?: number;
}

/**
 * Divider widget content
 */
export interface DividerContent {
  style: 'solid' | 'double' | 'dotted' | 'dashed';
  weight: number; // Thickness in pixels
  color?: string;
  width: number; // Width percentage
  gap: number; // Spacing around divider
  align: 'left' | 'center' | 'right';
  icon?: {
    value: string;
    library: 'solid' | 'regular' | 'brands' | 'custom';
  };
}

/**
 * Google Maps widget content
 */
export interface GoogleMapsContent {
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom: number;
  height: number; // Height in pixels
  preventScroll: boolean;
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  streetView: boolean;
  markers?: Array<{
    address?: string;
    latitude?: number;
    longitude?: number;
    title?: string;
    description?: string;
    icon?: string;
  }>;
}

/**
 * Gallery widget content
 */
export interface GalleryContent {
  images: Array<{
    url: string;
    id?: number;
    alt: string;
    title?: string;
    description?: string;
  }>;
  columns: number;
  columnsTablet?: number;
  columnsMobile?: number;
  gap: number;
  gapTablet?: number;
  gapMobile?: number;
  aspectRatio: '1:1' | '3:2' | '4:3' | '9:16' | '16:9' | '21:9' | 'custom';
  linkTo: 'none' | 'file' | 'custom';
  randomOrder?: boolean;
  lazyLoad: boolean;
}

/**
 * Accordion widget content
 */
export interface AccordionContent {
  items: Array<{
    id: string;
    title: string;
    content: string; // HTML content
  }>;
  defaultActive?: number; // Index of default active item
  multipleOpen: boolean;
  icon?: {
    active: string; // Icon class for active state
    inactive: string; // Icon class for inactive state
  };
}

/**
 * Tabs widget content
 */
export interface TabsContent {
  tabs: Array<{
    id: string;
    title: string;
    content: string; // HTML content
  }>;
  defaultActive: number; // Index of default active tab
  icon?: {
    value: string;
    library: 'solid' | 'regular' | 'brands' | 'custom';
  };
}

/**
 * Progress Bar widget content
 */
export interface ProgressBarContent {
  title: string;
  percentage: number; // 0-100
  displayPercentage: boolean;
  innerText?: string;
  barType: 'linear' | 'circular';
  barColor?: string;
  barBackgroundColor?: string;
  animationDuration: number; // milliseconds
}

/**
 * Counter widget content
 */
export interface CounterContent {
  startingNumber: number;
  endingNumber: number;
  prefix?: string;
  suffix?: string;
  animationDuration: number; // milliseconds
  thousandSeparator: string;
  title?: string;
}

/**
 * Social Icons widget content
 */
export interface SocialIconsContent {
  icons: Array<{
    network: string; // facebook, twitter, instagram, etc.
    url: string;
    label?: string;
  }>;
  shape: 'square' | 'circle' | 'rounded';
  view: 'default' | 'stacked' | 'framed';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align: 'left' | 'center' | 'right' | 'justify';
}

/**
 * Form widget content (Elementor Pro)
 */
export interface FormContent {
  formFields: Array<{
    fieldType:
      | 'text'
      | 'email'
      | 'textarea'
      | 'url'
      | 'tel'
      | 'select'
      | 'checkbox'
      | 'radio'
      | 'date'
      | 'time'
      | 'file'
      | 'number';
    label: string;
    placeholder?: string;
    required: boolean;
    fieldOptions?: string[]; // For select/radio/checkbox
  }>;
  submitButton: {
    text: string;
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };
  formActions: Array<{
    type: 'email' | 'redirect' | 'webhook' | 'mailchimp' | 'activecampaign';
    settings: Record<string, unknown>;
  }>;
}

/**
 * Union type for all widget content types
 * Extensible for new widget types
 */
export type WidgetContent =
  | HeadingContent
  | TextEditorContent
  | ImageContent
  | ButtonContent
  | VideoContent
  | IconContent
  | SpacerContent
  | DividerContent
  | GoogleMapsContent
  | GalleryContent
  | AccordionContent
  | TabsContent
  | ProgressBarContent
  | CounterContent
  | SocialIconsContent
  | FormContent
  | Record<string, unknown>; // Fallback for unknown widget types

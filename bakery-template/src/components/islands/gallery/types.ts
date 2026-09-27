import type { Dictionary } from '~/i18n/en';
import type { ResponsiveImage } from '~/lib/images';

export interface GalleryItemView {
  id: string;
  occasion: string;
  alt: string;
  caption: string;
  thumb: ResponsiveImage;
  full: ResponsiveImage;
}

export interface GalleryLabels {
  gallery: Dictionary['gallery'];
  occasions: Dictionary['occasions'];
  cta: Dictionary['cta'];
}

export interface GalleryConfig {
  /** Occasions in display order (only those with photos). */
  occasions: string[];
  /** Localised cake-builder path, or null when the builder is switched off. */
  builderPath: string | null;
}

export interface GalleryProps {
  items: GalleryItemView[];
  labels: GalleryLabels;
  config: GalleryConfig;
}

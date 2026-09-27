import type { Dictionary } from '~/i18n/en';
import type { BuilderContext, MessageLabels } from '~/lib/builder';
import type { ResponsiveImage } from '~/lib/images';

export interface BuilderLabels {
  builder: Dictionary['builder'];
  occasions: Dictionary['occasions'];
  common: Dictionary['common'];
  cta: Dictionary['cta'];
}

export interface FlavourView {
  id: string;
  name: string;
  nameTe?: string | undefined;
  tier: 'classic' | 'premium';
  note?: string | undefined;
  image: ResponsiveImage;
}

export interface BuilderConfig {
  lang: 'en' | 'te';
  brand: string;
  whatsapp: string;
  phone: string;
  addressLine: string;
  radiusKm: number;
  areas: string[];
  ctx: BuilderContext;
}

export interface BuilderProps {
  labels: BuilderLabels;
  messageLabels: MessageLabels;
  flavours: FlavourView[];
  config: BuilderConfig;
}

import type { Dictionary } from '~/i18n/en';
import type { ResponsiveImage } from '~/lib/images';
import type { Badge, Diet } from '~/lib/menu-filter';

export interface MenuItemView {
  id: string;
  name: string;
  nameTe?: string | undefined;
  description: string;
  alt: string;
  diet: Diet;
  egglessAvailable: boolean;
  price?: number | undefined;
  variants?: { label: string; price: number }[] | undefined;
  badges: Badge[];
  image: ResponsiveImage;
  category: string;
}

export interface CategoryView {
  slug: string;
  name: string;
  nameTe?: string | undefined;
  note?: string | undefined;
  items: MenuItemView[];
}

export interface MenuLabels {
  menu: Dictionary['menu'];
  cart: Dictionary['cart'];
  diet: Dictionary['diet'];
  badges: Dictionary['badges'];
  common: Dictionary['common'];
}

export interface MenuConfig {
  lang: 'en' | 'te';
  brand: string;
  whatsapp: string;
  egglessSurcharge: number;
  timezone: string;
  areas: string[];
  cartEnabled: boolean;
}

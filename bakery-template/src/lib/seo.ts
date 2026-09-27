/**
 * Structured data (schema.org JSON-LD) built from site.ts and the menu.
 * No ratings or reviews: Google ignores self-served review markup, and the
 * demo's reviews are samples.
 */
import type { Bakery, DayOfWeek, Menu, MenuItem as SchemaMenuItem, WithContext } from 'schema-dts';
import { site } from '~/config/site';
import { localizePath, lt, type Lang } from '~/i18n';
import type { MenuCategory } from './menu';
import { weekOrder, type DayKey } from './time';

const dayNames: Record<DayKey, DayOfWeek> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/** A real profile link, not a placeholder pointing at a network's home page. */
const isProfile = (url: string) => {
  try {
    return new URL(url).pathname.replace(/\/+$/, '') !== '';
  } catch {
    return false;
  }
};

export function bakeryJsonLd(siteUrl: URL, lang: Lang): WithContext<Bakery> {
  const { contact } = site;
  const home = new URL(localizePath('/', lang), siteUrl).href;
  const { instagram, facebook, youtube } = site.socials;
  const sameAs = [instagram?.url, facebook, youtube].filter(
    (url): url is string => !!url && isProfile(url),
  );

  // One entry per day and opening range, e.g. Monday 09:00–22:00.
  const openingHoursSpecification = weekOrder.flatMap((day) =>
    site.hours[day].map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: dayNames[day],
      opens,
      closes,
    })),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': new URL('/#bakery', siteUrl).href,
    name: site.brand.name,
    description: lt(site.brand.descriptor, lang),
    slogan: lt(site.brand.tagline, lang),
    url: home,
    image: new URL(site.seo.ogImage ?? '/og.jpg', siteUrl).href,
    logo: new URL('/icon-512.png', siteUrl).href,
    telephone: contact.phone,
    email: contact.email,
    priceRange: site.seo.priceRange,
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    },
    openingHoursSpecification,
    hasMenu: new URL(localizePath('/menu/', lang), siteUrl).href,
    areaServed: site.delivery.areas.map((a) => ({ '@type': 'Place', name: lt(a, 'en') })),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function menuJsonLd(
  categories: MenuCategory[],
  siteUrl: URL,
  lang: Lang,
): WithContext<Menu> {
  const te = lang === 'te';
  const item = (i: MenuCategory['items'][number]): SchemaMenuItem => ({
    '@type': 'MenuItem',
    name: (te && i.nameTe) || i.name,
    description: (te && i.descriptionTe) || i.description,
    ...(i.diet === 'veg' ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
    offers: i.variants?.length
      ? i.variants.map((v) => ({
          '@type': 'Offer',
          name: v.label,
          price: v.price,
          priceCurrency: 'INR',
        }))
      : { '@type': 'Offer', price: i.price ?? 0, priceCurrency: 'INR' },
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${site.brand.name} menu`,
    url: new URL(localizePath('/menu/', lang), siteUrl).href,
    inLanguage: lang === 'te' ? 'te' : 'en-IN',
    hasMenuSection: categories.map((c) => ({
      '@type': 'MenuSection',
      name: (te && c.nameTe) || c.name,
      hasMenuItem: c.items.map(item),
    })),
  };
}

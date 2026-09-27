/**
 * Language helpers. English lives at "/", Telugu at "/te/…" (only when
 * site.features.telugu is on). Pages under src/pages/[...lang]/ call
 * `langPaths()` from getStaticPaths.
 */
import type { FeatureKey, LocalizedText } from '~/config/schema';
import { site } from '~/config/site';
import { fmt, joinList } from '~/lib/format';
import { en, type Dictionary } from './en';
import { te } from './te';

export const languages = ['en', 'te'] as const;
export type Lang = (typeof languages)[number];

/** Value for <html lang>. */
export const htmlLang: Record<Lang, string> = { en: 'en-IN', te: 'te' };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export function getDictionary(lang: Lang): Dictionary {
  return lang === 'te' ? te : en;
}

export function activeLanguages(): Lang[] {
  return site.features.telugu ? ['en', 'te'] : ['en'];
}

/** getStaticPaths helper: one page per language, none if the feature is off. */
export function langPaths(feature?: FeatureKey) {
  if (feature && !site.features[feature]) return [];
  return activeLanguages().map((lang) => ({
    params: { lang: lang === 'en' ? undefined : lang },
    props: { lang },
  }));
}

/** "/menu/" → "/te/menu/" for Telugu. Keeps query strings and hashes. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean;
  return clean === '/' ? '/te/' : `/te${clean}`;
}

/** "/te/menu/" → "/menu/" */
export function stripLang(pathname: string): string {
  const stripped = pathname.replace(/^\/te(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Pick the right language from a LocalizedText value in site.ts. */
export function lt(value: LocalizedText, lang: Lang): string {
  if (typeof value === 'string') return value;
  return (lang === 'te' && value.te) || value.en;
}

/** Values available to every {placeholder} in the copy. */
export function copyVars(lang: Lang): Record<string, string | number> {
  const areas = site.delivery.areas.map((a) => lt(a, lang));
  return {
    brand: site.brand.name,
    city: lt(site.contact.cityName, lang),
    radius: site.delivery.radiusKm,
    areas: joinList(areas.slice(0, 5), lang),
    standardHours: site.cakeBuilder.leadTimeHours.standard,
    extendedHours: site.cakeBuilder.leadTimeHours.extended,
    standard: site.cakeBuilder.leadTimeHours.standard,
    extended: site.cakeBuilder.leadTimeHours.extended,
    eggless: site.menu.egglessSurcharge,
    studio: site.studio.name,
    handle: site.socials.instagram?.handle ?? '',
    year: new Date().getFullYear(),
  };
}

/** Translate helper bound to one language: t(dict.home.hero.subtitle). */
export function makeFormatter(lang: Lang) {
  const vars = copyVars(lang);
  return (template: string, extra: Record<string, string | number> = {}) =>
    fmt(template, { ...vars, ...extra });
}

export type { Dictionary };

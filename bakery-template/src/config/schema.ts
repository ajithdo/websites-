/**
 * Schema for src/config/site.ts.
 *
 * The config is validated when Astro loads (astro.config.ts), so a typo in
 * client data stops the build with a readable message instead of shipping a
 * broken page. Only types are imported by browser code; zod stays server-side.
 */
import { z } from 'astro/zod';
import { themeIds } from './themes';

const time = z
  .string()
  .regex(/^([01]\d|2[0-4]):[0-5]\d$/, 'Use 24-hour "HH:MM", e.g. "09:00" or "22:00"');
const range = z.tuple([time, time]);
const day = z.array(range);

/** Text that can be translated: a plain string, or { en, te }. */
export const localized = z.union([
  z.string().min(1),
  z.object({ en: z.string().min(1), te: z.string().min(1).optional() }),
]);

const imagePath = z
  .string()
  .regex(
    /^[\w\-/]+\.(jpe?g|png|webp|avif)$/i,
    'Image paths are relative to src/assets/images, e.g. "hero/hero.jpg"',
  );

const digits = (label: string) =>
  z.string().regex(/^\d{10,15}$/, `${label}: digits only with country code, e.g. 919000000000`);

export const occasionIds = [
  'birthday',
  'anniversary',
  'wedding',
  'kids',
  'baby-shower',
  'festive',
  'corporate',
  'other',
] as const;
export type OccasionId = (typeof occasionIds)[number];

export const designStyleIds = ['simple', 'semi-custom', 'designer', 'photo', 'two-tier'] as const;
export type DesignStyleId = (typeof designStyleIds)[number];

export const shapeIds = ['round', 'heart', 'square'] as const;
export type ShapeId = (typeof shapeIds)[number];

export const featureKeys = [
  'cakeBuilder',
  'enquiryCart',
  'gallery',
  'testimonials',
  'instagramGrid',
  'festiveBanner',
  'telugu',
  'corporateOrders',
  'faq',
  'demoMode',
] as const;
export type FeatureKey = (typeof featureKeys)[number];

export const siteSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    descriptor: localized,
    tagline: localized,
    logo: z.object({
      /** "text": live wordmark in the theme's heading font. "image": use `wordmark` file. */
      mode: z.enum(['text', 'image']),
      wordmark: z.string().startsWith('/'),
      mark: z.string().startsWith('/'),
    }),
  }),
  /** Canonical URL. Leave empty to use Netlify's URL or Cloudflare's CF_PAGES_URL. */
  url: z.union([z.literal(''), z.url()]),
  timezone: z.string().min(1),
  contact: z.object({
    phoneDisplay: z.string().min(1),
    phone: z.string().regex(/^\+\d{10,15}$/, 'phone: E.164 format, e.g. +919000000000'),
    whatsapp: digits('whatsapp'),
    email: z.email(),
    address: z.object({
      street: z.string().min(1),
      locality: z.string().min(1),
      city: z.string().min(1),
      region: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().length(2),
    }),
    geo: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
    /** Search text for Google Maps (embed and directions). */
    mapQuery: z.string().min(1),
    /** City name as it should read in copy ({city}), per language. */
    cityName: localized,
  }),
  hours: z.object({
    mon: day,
    tue: day,
    wed: day,
    thu: day,
    fri: day,
    sat: day,
    sun: day,
  }),
  socials: z.object({
    instagram: z.object({ handle: z.string().min(1), url: z.url() }).nullable(),
    facebook: z.url().nullable(),
    youtube: z.url().nullable(),
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(50).max(170),
    priceRange: z.string().min(1),
    /** Custom OG image in /public (e.g. "/brand/og-image.jpg"); null = auto-generated. */
    ogImage: z.string().startsWith('/').nullable(),
  }),
  theme: z.enum(themeIds),
  features: z.object(
    Object.fromEntries(featureKeys.map((k) => [k, z.boolean()])) as Record<
      FeatureKey,
      z.ZodBoolean
    >,
  ),
  motion: z.object({ intro: z.boolean(), smoothScroll: z.boolean() }),
  announcement: z.object({
    text: localized,
    href: z.string().nullable(),
    /** Last day to show it (YYYY-MM-DD, IST). null = no expiry. */
    until: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
  }),
  googleRating: z
    .object({ value: z.number().min(1).max(5), count: z.number().int().min(1), url: z.string() })
    .nullable(),
  fssai: z.string(),
  hero: z.object({
    image: imagePath,
    mobileImage: imagePath.nullable(),
    /** Optional muted looping video in /public, e.g. "/video/hero.mp4". */
    video: z.string().startsWith('/').nullable(),
    alt: localized,
    /** CSS object-position for the hero photo. */
    position: z.string(),
    mobilePosition: z.string(),
  }),
  home: z.object({
    /** Menu item ids shown in "Signature bakes" (4–6). */
    signature: z.array(z.string()).min(4).max(6),
    /** Menu item id featured on the desktop hero card. */
    heroCard: z.string(),
    storyImages: z.tuple([imagePath, imagePath]),
    builderTeaserImage: imagePath,
  }),
  occasions: z
    .array(
      z.object({
        id: z.enum(occasionIds),
        image: imagePath.nullable(),
        /** Show as a "Shop by occasion" tile on Home. */
        tile: z.boolean(),
      }),
    )
    .min(1),
  cakeBuilder: z.object({
    flavours: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: z.string().min(1),
          nameTe: z.string().optional(),
          tier: z.enum(['classic', 'premium']),
          image: imagePath,
          note: z.string().optional(),
        }),
      )
      .min(2),
    sizesKg: z.array(z.number().positive()).min(1),
    servingsPerKg: z.number().positive(),
    messageMaxLength: z.number().int().positive(),
    pricing: z.object({
      perKg: z.object({
        classic: z.number().positive(),
        premium: z.number().positive(),
        designer: z.number().positive(),
      }),
      semiCustomPerKg: z.number().min(0),
      egglessPerKg: z.number().min(0),
      photoPrint: z.number().min(0),
      twoTier: z.number().min(0),
      shape: z.object({
        round: z.number().min(0),
        heart: z.number().min(0),
        square: z.number().min(0),
      }),
      minKg: z.partialRecord(z.enum(designStyleIds), z.number().positive()),
      /** Upper end of the estimate as a fraction above the computed price (0.15 = +15%). */
      rangeSpread: z.number().min(0).max(1),
      roundTo: z.number().int().positive(),
    }),
    leadTimeHours: z.object({ standard: z.number().min(0), extended: z.number().min(0) }),
    /** Design styles that need the extended lead time. */
    extendedLeadStyles: z.array(z.enum(designStyleIds)),
    /** Pickup / delivery time slots (24h). */
    slots: z.array(time).min(1),
  }),
  delivery: z.object({
    areas: z.array(localized),
    radiusKm: z.number().positive(),
  }),
  menu: z.object({
    /** Flat surcharge per eggless cake on the menu. */
    egglessSurcharge: z.number().min(0),
  }),
  studio: z.object({
    name: z.string().min(1),
    whatsapp: digits('studio.whatsapp'),
    /** Show "Website by <studio>" in the footer (client mode too). */
    footerCredit: z.boolean(),
  }),
});

export type SiteConfig = z.input<typeof siteSchema>;
export type LocalizedText = z.input<typeof localized>;
export type WeekHours = SiteConfig['hours'];
export type Flavour = SiteConfig['cakeBuilder']['flavours'][number];
export type BuilderPricing = SiteConfig['cakeBuilder']['pricing'];

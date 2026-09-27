/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG: everything client-specific that is a *fact* lives here.
 *  Words and page copy live in src/i18n/en.ts (and te.ts).
 *  Menu, gallery and testimonials live in src/content/.
 *  See REBRAND.md for the full 30–60 minute checklist.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This demo brand is fictional. Contact details are deliberate placeholders.
 * The file is validated against src/config/schema.ts on every build.
 */
import type { SiteConfig } from './schema';

export const site: SiteConfig = {
  brand: {
    name: 'Butter & Bloom',
    descriptor: { en: 'Patisserie · Celebration Cakes', te: 'పటిస్సెరీ · వేడుకల కేకులు' },
    tagline: {
      en: 'French technique, Hanamkonda heart.',
      te: 'ఫ్రెంచ్ నైపుణ్యం, హనుమకొండ హృదయం.',
    },
    logo: {
      mode: 'text',
      wordmark: '/brand/logo.svg',
      mark: '/brand/logo-mark.svg',
    },
  },

  url: '',
  timezone: 'Asia/Kolkata',

  contact: {
    phoneDisplay: '+91 90000 00000',
    phone: '+919000000000',
    whatsapp: '919000000000',
    email: 'hello@butterandbloom.example',
    address: {
      street: '12 Sample Street',
      locality: 'Hanamkonda',
      city: 'Hanamkonda',
      region: 'Telangana',
      postalCode: '506001',
      country: 'IN',
    },
    geo: { lat: 18.0115, lng: 79.561 },
    mapQuery: 'Hanamkonda, Telangana 506001',
    cityName: { en: 'Hanamkonda', te: 'హనుమకొండ' },
  },

  hours: {
    mon: [['09:00', '22:00']],
    tue: [['09:00', '22:00']],
    wed: [['09:00', '22:00']],
    thu: [['09:00', '22:00']],
    fri: [['09:00', '22:00']],
    sat: [['09:00', '22:00']],
    sun: [['09:00', '22:00']],
  },

  socials: {
    instagram: { handle: 'butterandbloom.sample', url: 'https://www.instagram.com/' },
    facebook: null,
    youtube: null,
  },

  seo: {
    title: 'Butter & Bloom · Patisserie & Celebration Cakes in Hanamkonda',
    description:
      'Custom celebration cakes, French pastries and fresh bakes in Hanamkonda. Design your cake online and order on WhatsApp. Eggless options, baked daily.',
    priceRange: '₹₹',
    ogImage: null,
  },

  theme: 'classic',

  features: {
    cakeBuilder: true,
    enquiryCart: true,
    gallery: true,
    testimonials: true,
    instagramGrid: true,
    festiveBanner: true,
    telugu: true,
    corporateOrders: true,
    faq: true,
    demoMode: true,
  },

  motion: { intro: true, smoothScroll: true },

  announcement: {
    text: {
      en: 'Diwali hampers are here · Pre-order by 5 Nov',
      te: 'దీపావళి హ్యాంపర్లు వచ్చేశాయి · నవంబర్ 5 లోపు ముందుగా ఆర్డర్ చేయండి',
    },
    href: '/custom-cakes/?occasion=festive',
    until: '2026-11-08',
  },

  /** Shown with a "Sample" tag in demo mode. In client mode, set real values + profile URL, or null. */
  googleRating: { value: 4.9, count: 312, url: '' },

  /** FSSAI licence number. Hidden when empty. Never invent one. */
  fssai: '',

  hero: {
    image: 'hero/hero.jpg',
    mobileImage: 'hero/hero-mobile.jpg',
    video: null,
    alt: {
      en: 'A tall celebration cake with cream swirls and fresh berries on a cake stand',
      te: 'క్రీమ్ అలంకరణ, తాజా బెర్రీలతో కేక్ స్టాండ్‌పై ఉన్న ఎత్తైన వేడుక కేక్',
    },
    position: '50% 50%',
    mobilePosition: '50% 50%',
  },

  home: {
    signature: [
      'belgian-chocolate-truffle',
      'pistachio-rose',
      'rasmalai-fusion-cake',
      'almond-croissant',
      'lotus-biscoff',
      'garlic-cheese-pull-apart',
    ],
    heroCard: 'almond-croissant',
    storyImages: ['story/story-1.jpg', 'story/story-2.jpg'],
    builderTeaserImage: 'misc/builder-teaser.jpg',
  },

  occasions: [
    { id: 'birthday', image: 'occasions/birthday.jpg', tile: true },
    { id: 'anniversary', image: 'occasions/anniversary.jpg', tile: true },
    { id: 'wedding', image: 'occasions/wedding.jpg', tile: true },
    { id: 'kids', image: 'occasions/kids.jpg', tile: true },
    { id: 'festive', image: 'occasions/festive.jpg', tile: true },
    { id: 'corporate', image: 'occasions/corporate.jpg', tile: true },
    { id: 'baby-shower', image: null, tile: false },
    { id: 'other', image: null, tile: false },
  ],

  cakeBuilder: {
    flavours: [
      {
        id: 'belgian-chocolate',
        name: 'Belgian Chocolate Truffle',
        nameTe: 'బెల్జియన్ చాక్లెట్ ట్రఫుల్',
        tier: 'classic',
        image: 'menu/belgian-chocolate-truffle.jpg',
      },
      {
        id: 'red-velvet',
        name: 'Red Velvet & Cream Cheese',
        nameTe: 'రెడ్ వెల్వెట్ & క్రీమ్ చీజ్',
        tier: 'classic',
        image: 'menu/red-velvet-cream-cheese.jpg',
      },
      {
        id: 'butterscotch',
        name: 'Salted Caramel Butterscotch',
        nameTe: 'సాల్టెడ్ కారమెల్ బటర్‌స్కాచ్',
        tier: 'classic',
        image: 'menu/salted-caramel-butterscotch.jpg',
      },
      {
        id: 'mango',
        name: 'Fresh Mango Cream',
        nameTe: 'తాజా మామిడి క్రీమ్',
        tier: 'classic',
        image: 'menu/fresh-mango-cream.jpg',
        note: 'In season',
      },
      {
        id: 'rasmalai',
        name: 'Rasmalai Fusion',
        nameTe: 'రసమలై ఫ్యూజన్',
        tier: 'premium',
        image: 'menu/rasmalai-fusion-cake.jpg',
      },
      {
        id: 'pistachio-rose',
        name: 'Pistachio Rose',
        nameTe: 'పిస్తా రోజ్',
        tier: 'premium',
        image: 'menu/pistachio-rose.jpg',
      },
      {
        id: 'biscoff',
        name: 'Lotus Biscoff',
        nameTe: 'లోటస్ బిస్కాఫ్',
        tier: 'premium',
        image: 'menu/lotus-biscoff.jpg',
      },
      {
        id: 'blueberry-cheesecake',
        name: 'Blueberry Cheesecake',
        nameTe: 'బ్లూబెర్రీ చీజ్‌కేక్',
        tier: 'premium',
        image: 'menu/baked-blueberry-cheesecake.jpg',
      },
    ],
    sizesKg: [0.5, 1, 1.5, 2, 3],
    servingsPerKg: 8,
    messageMaxLength: 30,
    pricing: {
      perKg: { classic: 900, premium: 1200, designer: 1600 },
      /** Not in the brief: an assumed demo value. Adjust per client. */
      semiCustomPerKg: 200,
      egglessPerKg: 100,
      photoPrint: 250,
      twoTier: 500,
      shape: { round: 0, heart: 100, square: 100 },
      minKg: { designer: 1, 'two-tier': 1 },
      rangeSpread: 0.15,
      roundTo: 50,
    },
    leadTimeHours: { standard: 48, extended: 72 },
    extendedLeadStyles: ['designer', 'two-tier'],
    slots: [
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
    ],
  },

  delivery: {
    areas: [
      { en: 'Hanamkonda', te: 'హనుమకొండ' },
      { en: 'Warangal', te: 'వరంగల్' },
      { en: 'Kazipet', te: 'కాజీపేట' },
      { en: 'Subedari', te: 'సుబేదారి' },
      { en: 'Nakkalagutta', te: 'నక్కలగుట్ట' },
      { en: 'Balasamudram', te: 'బాలసముద్రం' },
      { en: 'Hunter Road', te: 'హంటర్ రోడ్' },
      { en: 'Naimnagar', te: 'నయీంనగర్' },
    ],
    radiusKm: 8,
  },

  menu: { egglessSurcharge: 100 },

  studio: {
    name: 'Your Studio',
    whatsapp: '919000000001',
    footerCredit: true,
  },
};

export type Site = typeof site;

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
      en: 'A tall tiered celebration cake decorated with roses, on a candlelit table',
      te: 'కొవ్వొత్తుల వెలుగులో టేబుల్‌పై గులాబీలతో అలంకరించిన ఎత్తైన అంతస్తుల వేడుక కేక్',
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
    storyImages: [
      {
        src: 'story/story-1.jpg',
        alt: {
          en: 'A baker’s floured hands shaping a round of dough',
          te: 'పిండి అంటిన చేతులతో పిండి ముద్దను గుండ్రంగా మలుస్తున్న బేకర్',
        },
      },
      {
        src: 'story/story-2.jpg',
        alt: {
          en: 'A tray of golden croissants fresh from the oven',
          te: 'ఓవెన్ నుంచి వచ్చిన బంగారు రంగు క్రొయిసాంట్‌ల ట్రే',
        },
      },
    ],
    builderTeaserImage: {
      src: 'misc/builder-teaser.jpg',
      alt: {
        en: 'Piping cream onto a layered sponge cake',
        te: 'పొరల స్పాంజ్ కేక్‌పై క్రీమ్ పైప్ చేస్తున్న దృశ్యం',
      },
    },
  },

  about: {
    hero: {
      src: 'about/about-hero.jpg',
      alt: {
        en: 'Trays of freshly baked chocolate croissants and pastries',
        te: 'ట్రేలలో తాజాగా బేక్ చేసిన చాక్లెట్ క్రొయిసాంట్లు, పేస్ట్రీలు',
      },
    },
    strip: [
      {
        src: 'about/strip-1.jpg',
        alt: { en: 'Kneading dough by hand', te: 'చేతితో పిండి పిసుకుతున్న దృశ్యం' },
      },
      {
        src: 'about/strip-2.jpg',
        alt: {
          en: 'Piping a chocolate border onto a cream cake',
          te: 'క్రీమ్ కేక్‌పై చాక్లెట్ అంచు పైప్ చేస్తున్న దృశ్యం',
        },
      },
      {
        src: 'about/strip-3.jpg',
        alt: {
          en: 'Racks of fresh bread loaves in the bakery',
          te: 'బేకరీలో అరల నిండా తాజా బ్రెడ్లు',
        },
      },
      {
        src: 'about/strip-4.jpg',
        alt: {
          en: 'Hands working flour into dough on a wooden table',
          te: 'చెక్క బల్లపై పిండిని కలుపుతున్న చేతులు',
        },
      },
    ],
    hands: {
      src: 'about/hands.jpg',
      alt: {
        en: 'A baker’s hands holding a ball of dough',
        te: 'పిండి ముద్దను పట్టుకున్న బేకర్ చేతులు',
      },
    },
  },

  contactPage: {
    corporateImage: {
      src: 'misc/corporate.jpg',
      alt: {
        en: 'A kraft-paper gift box tied with a pink ribbon',
        te: 'గులాబీ రిబ్బన్‌తో కట్టిన కాగితపు బహుమతి పెట్టె',
      },
    },
  },

  notFoundImage: {
    src: 'misc/not-found.jpg',
    alt: { en: 'A single croissant on a white plate', te: 'తెల్లని ప్లేట్‌లో ఒక క్రొయిసాంట్' },
  },

  occasions: [
    {
      id: 'birthday',
      image: {
        src: 'occasions/birthday.jpg',
        alt: {
          en: 'Candles being lit on a piped birthday cake',
          te: 'పుట్టినరోజు కేక్‌పై కొవ్వొత్తులు వెలిగిస్తున్న దృశ్యం',
        },
      },
      tile: true,
    },
    {
      id: 'anniversary',
      image: {
        src: 'occasions/anniversary.jpg',
        alt: {
          en: 'A cream cake decorated with pink carnations',
          te: 'గులాబీ రంగు కార్నేషన్ పూలతో అలంకరించిన క్రీమ్ కేక్',
        },
      },
      tile: true,
    },
    {
      id: 'wedding',
      image: {
        src: 'occasions/wedding.jpg',
        alt: {
          en: 'A white three-tier wedding cake with deep red roses',
          te: 'ముదురు ఎరుపు గులాబీలతో తెల్లని మూడు అంతస్తుల పెళ్లి కేక్',
        },
      },
      tile: true,
    },
    {
      id: 'kids',
      image: {
        src: 'occasions/kids.jpg',
        alt: {
          en: 'A pink drip cake topped with an ice-cream cone and sprinkles',
          te: 'ఐస్‌క్రీమ్ కోన్, రంగు స్ప్రింకిల్స్‌తో గులాబీ రంగు డ్రిప్ కేక్',
        },
      },
      tile: true,
    },
    {
      id: 'festive',
      image: {
        src: 'occasions/festive.jpg',
        alt: {
          en: 'Boondi laddoos on a tray beside a lit diya',
          te: 'వెలిగించిన దీపం పక్కన ట్రేలో బూందీ లడ్డూలు',
        },
      },
      tile: true,
    },
    {
      id: 'corporate',
      image: {
        src: 'occasions/corporate.jpg',
        alt: {
          en: 'Black gift boxes tied with gold satin ribbons',
          te: 'బంగారు రంగు శాటిన్ రిబ్బన్లతో కట్టిన నల్లని బహుమతి పెట్టెలు',
        },
      },
      tile: true,
    },
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

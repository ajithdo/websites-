# Butter & Bloom: premium bakery website template

A fast, phone-first bakery website that does two jobs:

1. **A sales demo.** "Butter & Bloom" is a fictional Hanamkonda patisserie that shows a bakery owner, on their phone, what their site could be. It has a live theme switcher and can preview the owner's own bakery name (`?name=`).
2. **A rebrandable template.** Everything client-specific lives in config and content files, so a rebrand takes 30–60 minutes. See [REBRAND.md](REBRAND.md).

Built with Astro 7 (static output), React islands, Tailwind 4 and TypeScript. It needs no server, no database and no monthly fees: it hosts free on Netlify or Cloudflare Pages.

## What the site does

- **Home.** A full-bleed hero, signature bakes, the story, shop-by-occasion tiles, how ordering works, a cake-builder teaser, reviews, an Instagram grid, visit us (map, hours, live open/closed status in IST), FAQ and a WhatsApp call to action.
- **Menu.** Sticky category tabs, veg/egg/non-veg filters, search, ½ kg / 1 kg options, and an **enquiry cart** that writes a formatted WhatsApp order. The cart survives a reload.
- **Custom cakes.** A 9-step **cake builder**: occasion, flavour, size, design, options, date and time, pickup or delivery, details, summary. It shows a live price estimate and applies 48 h / 72 h lead-time rules in IST. The draft is saved on the device, it works fully from the keyboard, and it sends the exact order on WhatsApp.
- **Gallery.** A masonry grid with occasion filters and a lightbox: swipe, arrow keys, Esc, captions.
- **About** and **Contact.** Contact has cards, a map, hours, an enquiry form (WhatsApp or email, nothing stored) and a corporate and bulk orders block.
- **Telugu.** Every page also exists at `/te/…`, marked `lang="te"`. The visitor's choice is remembered. WhatsApp orders stay in English for the bakery staff.
- **SEO.** Bakery and Menu structured data, a generated 1200 × 630 link-preview image (for WhatsApp shares), favicons, a web manifest, a sitemap, robots.txt and canonical and hreflang tags.
- **Honest demo mode.** A "Sample website by …" ribbon, "Sample" labels on reviews and ratings, and `noindex`. Setting `features.demoMode: false` removes all of it, which `npm run qa:client-mode` checks.

Lighthouse mobile scores are Performance 92–100 on the key pages and 100 for Accessibility, Best Practices and SEO. See [docs/qa/lighthouse.md](docs/qa/lighthouse.md).

Screenshots (phone and desktop, all three looks, Telugu) are in [docs/screenshots/](docs/screenshots/).

## Quick start

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:4321
```

Demo tools, available in demo mode only:

- `/?name=Sri%20Lakshmi%20Bakers` shows that bakery name across the site for the visit.
- `/?theme=pastel` (or `classic`, `cocoa`) opens the site in that look.
- **Try another look** (top ribbon) switches looks, previews a name, and copies or WhatsApps a link to that preview.

## Scripts

| Command                             | What it does                                                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev` / `build` / `preview` | Develop, build to `dist/`, and serve the build                                                                                                                                          |
| `npm run check` · `lint` · `format` | Type-check (`astro check`), ESLint, Prettier                                                                                                                                            |
| `npm test`                          | Unit tests (pricing, lead times, IST hours, WhatsApp text, cart, contrast, i18n, config)                                                                                                |
| `npm run test:e2e`                  | Playwright end-to-end tests, run after a build: cart, keyboard-only cake builder, gallery, contact, demo tools, SEO, axe in all three themes, no sideways scroll from 320 px to 1920 px |
| `npm run whatsapp:sample`           | Prints a sample cart order and cake order as they appear in WhatsApp                                                                                                                    |
| `npm run qa:screens`                | Screenshots every page at 4 widths in 3 themes into `docs/screenshots/matrix/`                                                                                                          |
| `npm run qa:lighthouse`             | Lighthouse mobile (median of 3) for the key pages                                                                                                                                       |
| `npm run qa:client-mode`            | Builds with demo mode off into `dist-client/` and fails if anything demo-only remains                                                                                                   |
| `npm run photos:fetch`              | Downloads the demo photos in `scripts/photos/manifest.json` and rewrites `CREDITS.md`                                                                                                   |
| `npm run brand`                     | Regenerates the SVG logo, mark and paper grain from `site.ts`                                                                                                                           |
| `npm run fonts:rupee`               | Rebuilds the tiny ₹-only font files (run after adding a font)                                                                                                                           |

## Where things live

```
src/config/site.ts      brand, contact, hours, features, pricing, lead times, delivery areas, studio
src/config/themes.ts    the three looks (colours, fonts, shapes); contrast-tested
src/content/            menu (one JSON per category), gallery, testimonials
src/i18n/en.ts, te.ts   all copy (te.ts is machine-drafted: have a native speaker review it)
src/assets/images/      every photo, by slot name (swap files, keep names)
public/brand/           logo SVGs
src/pages/              Home, Menu, Custom cakes, Gallery, About, Contact, 404, plus generated
                        og.jpg, favicons, manifest and robots.txt
```

A typo in `site.ts` or the content JSON stops the build with a readable message, so a mistake never ships.

## Deploy

- **Netlify.** New site from Git, base directory `bakery-template`. `netlify.toml` covers the rest.
- **Cloudflare Pages.** Root directory `bakery-template`, build command `npm run build`, output `dist`.

Before a client site goes live, set `site.url` to the real domain (used for canonical links, the sitemap and link previews) and `features.demoMode: false`.

## Credits

Photos are from Unsplash (listed in [CREDITS.md](CREDITS.md)). Fonts are under the SIL Open Font License, via Fontsource. Icons: Lucide (ISC) and Simple Icons (CC0).

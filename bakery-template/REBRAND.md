# Rebrand checklist (30–60 minutes)

This turns the Butter & Bloom demo into a client's site. Almost everything is config and content. Work top to bottom, then run the checks at the end.

**Collect from the client first:**

- bakery name
- phone and WhatsApp numbers
- email
- address and a Google Maps pin
- opening hours
- Instagram handle
- FSSAI licence number
- the menu with prices
- 10–30 photos of their own products
- a logo, if they have one

## 1. Business details: `src/config/site.ts` (10 min)

- [ ] `brand.name`, `descriptor`, `tagline` (English and Telugu).
- [ ] `url`: the live domain, e.g. `https://sweetcrumbs.in`. It's used for canonical links, the sitemap and WhatsApp link previews.
- [ ] `contact`:
  - `phoneDisplay`, `phone` (+91…) and `whatsapp` (digits only, e.g. `919876543210`)
  - `email`, the `address` fields, `geo` (lat/lng from Google Maps) and `mapQuery`
- [ ] `hours`: per weekday in 24 h `HH:MM`. Split shifts and closed days (`[]`) work. The open/closed status is shown in IST.
- [ ] `socials`: set the real Instagram URL, or `null` to hide it.
- [ ] `seo.title` and `seo.description` (50–170 characters).
- [ ] `theme`: `classic`, `pastel` or `cocoa` (see step 6).
- [ ] `features`: set **`demoMode: false`**, and switch off anything not in the client's package (`cakeBuilder`, `enquiryCart`, `gallery`, `testimonials`, `instagramGrid`, `festiveBanner`, `telugu`, `corporateOrders`, `faq`).
- [ ] `announcement`: the text, the link, and `until` (the date it hides itself). To hide the bar entirely, set `features.festiveBanner: false`.
- [ ] `googleRating`: the real value, count **and** profile URL, or `null`. It's hidden in client mode without a URL, and never invented.
- [ ] `fssai`: the licence number (the footer hides the line when empty).
- [ ] `cakeBuilder`:
  - flavours and tiers
  - sizes
  - `pricing` (per kg by tier, designer, eggless, photo print, two-tier, shapes, minimum sizes)
  - `leadTimeHours` and the time slots
- [ ] `delivery.areas` and `radiusKm`, plus `menu.egglessSurcharge`.
- [ ] `studio`: your studio name and WhatsApp number, for the footer credit (`footerCredit: false` removes it).

A typo stops `npm run build` with a message naming the field, so the site can't ship broken.

## 2. Menu, gallery, reviews: `src/content/` (10–20 min)

- [ ] **Menu** (`menu/*.json`, one file per category):
  - Each item has an `id`, `name`, optional `nameTe`, a `description` (≤ 140 characters) with an optional `descriptionTe`, an `image` and an `alt`.
  - It also needs a `diet` of `veg`, `egg` or `nonveg`, plus `egglessAvailable`.
  - Give either a `price` or `variants` (e.g. `½ kg` / `1 kg`), and optional `badges` (`bestseller`, `new`, `seasonal`).
- [ ] **Home "signature bakes":** the six item ids in `site.home.signature`, plus `heroCard`.
- [ ] **Gallery** (`gallery/*.json`): photos per occasion, with a caption and a truthful `alt`.
- [ ] **Testimonials:** real reviews only, with the customer's permission. Otherwise set `features.testimonials: false`. The demo reviews are samples.

## 3. Photos: `src/assets/images/` (10 min + the client's photos)

Replace files **keeping the same file names**; every page picks them up. The build makes AVIF/WebP in every size, so upload the largest you have.

| Slot                                                                   | Size (or larger, same shape) |
| ---------------------------------------------------------------------- | ---------------------------- |
| `hero/hero.jpg` (desktop), `hero/hero-mobile.jpg` (phones)             | 2400 × 1600, 1200 × 1800     |
| `menu/<item>.jpg`                                                      | 1200 × 1200 (square)         |
| `occasions/*.jpg`, `about/strip-*.jpg`, `about/hands.jpg`              | 1200 × 1500                  |
| `story/story-1.jpg`, `story/story-2.jpg`                               | 1200 × 1600, 1200 × 1200     |
| `about/about-hero.jpg`                                                 | 2000 × 1300                  |
| `misc/builder-teaser.jpg`, `misc/corporate.jpg` · `misc/not-found.jpg` | 1600 × 1200 · 1200 × 1200    |
| `gallery/*.jpg`                                                        | any shape, long edge ≥ 1600  |

- [ ] Update each photo's `alt` (in `site.ts` and the content JSON) to say what the photo shows.
- [ ] **Tip for the client:** their own photos of their own bakes sell far better than stock. Phone photos by a window, in daylight, are enough. Keep the stock photos only as stand-ins until theirs arrive.
- [ ] Remove the Unsplash rows from `CREDITS.md` for any photo that was replaced, or delete the file if all were.

## 4. Logo (5 min)

- **No logo yet:** keep `brand.logo.mode: 'text'`. The name is set in the theme's display font. Run `npm run brand` to regenerate the SVG mark and wordmark (used for app icons and the link-preview image).
- **Has a logo:** put `logo.svg` (wordmark) and `logo-mark.svg` (square mark) in `public/brand/` and set `brand.logo.mode: 'image'`.

## 5. Words: `src/i18n/en.ts` and `te.ts` (5–10 min)

- [ ] Edit the story, the FAQ answers (lead times fill in automatically from config), the hero headline and the CTA copy.
- [ ] **Telugu:** `te.ts` is machine-drafted. Have a native Telugu speaker review it (and each `nameTe`/`descriptionTe`) before going live, or set `features.telugu: false`.

## 6. Look: `src/config/themes.ts` (0–15 min)

- Pick a preset in `site.theme`:
  - **Classic** (cream and gold, Fraunces / Manrope)
  - **Pastel** (blush and raspberry, Playfair Display / DM Sans)
  - **Cocoa** (dark, Cormorant Garamond / Inter)
- To use the client's colours, edit that theme's `colors`. `npm test` checks every text/background pair against WCAG AA and names any pair that fails.
- To use a new font:
  1. `npm install @fontsource-variable/<font>`
  2. Add it to `src/config/fonts.ts`.
  3. Run `npm run fonts:rupee`.

## 7. Check and deploy (5 min)

```bash
npm run check && npm run lint && npm test
npm run build && npm run qa:client-mode   # confirms no demo leftovers
npm run preview                          # click through on your phone (same Wi-Fi: npm run preview -- --host)
```

- [ ] Deploy on Netlify or Cloudflare Pages (see README). Connect the client's domain.
- [ ] Send the site link to yourself on WhatsApp and check that the link-preview image and title look right.
- [ ] Place a test order through the cart and the cake builder, and confirm it arrives on the client's WhatsApp.
- [ ] Submit the sitemap (`/sitemap-index.xml`) in Google Search Console. Link the site from the client's Google Business Profile.

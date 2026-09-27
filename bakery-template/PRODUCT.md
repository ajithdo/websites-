# Product

<!-- impeccable:product-schema 1 -->

Source of truth: the build brief (premium bakery demo) and the approved plan. Facts below are from the brief unless marked _assumption_.

## Platform

web

## Stack

Astro (static output) with TypeScript, Tailwind CSS, React islands (Motion), content collections with zod schemas. Hosting on Netlify or Cloudflare Pages. No backend, database or paid APIs. (Specified by the user.)

## Users

- **Bakery and cake-shop owners** in Tier-2 Telangana cities (Hanamkonda / Warangal). They see the demo on a phone, often in their own shop, shown by the developer. Their job: decide within about 60 seconds whether this is worth ₹20,000+ over the local ₹5,000 template sites, and picture their own name, colours and cakes on it.
- **Their customers** (after a sale): local families and offices ordering celebration cakes, pastries and everyday bakes on a phone. They order on WhatsApp.
- **The developer** who sells and rebrands the site for each client in 30–60 minutes.

## Product Purpose

A premium, config-driven bakery website that works first as a sales demo and then as a reusable template. Success means owners buy it, customers send clear, complete orders over WhatsApp, and a rebrand takes under an hour of editing config and data files.

## Positioning

Studio-grade editorial design combined with working ordering tools that local template sites don't have: a cake builder with price estimates and lead-time rules, and an enquiry cart that writes a formatted WhatsApp order. It also offers a Telugu option and costs nothing to host.

## Operating Context

- Orders and enquiries go through WhatsApp deep links (`wa.me`), `tel:` and `mailto:`. This is how Indian bakeries actually take orders.
- Custom cakes follow a set flow. The customer shares a reference photo on WhatsApp, then confirms and pays an advance, then picks the cake up or has it delivered.
- All times are in Asia/Kolkata.
- Customers expect the standard veg / egg / non-veg marks and look for eggless options.

## Capabilities and Constraints

- **Pages:** Home, Menu with an enquiry cart, Custom Cakes (the builder), Gallery, About, Contact and a branded 404.
- **Feature flags** switch these on and off to make lighter or heavier packages: cakeBuilder, enquiryCart, gallery, testimonials, instagramGrid, festiveBanner, telugu, corporateOrders, faq and demoMode.
- **Performance targets:** Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95, with CLS under 0.05.
- **Layout:** mobile-first at 375 px, with no horizontal scroll anywhere from 320 to 1920 px.
- **Demo mode** is on by default. It shows a visible "sample website" ribbon, labels testimonials as samples, sets `noindex` and uses obviously fake contact details. Switching it off leaves a clean client site.
- **Telugu:** a UI toggle. The Telugu strings are machine-drafted and need review by a native speaker before going live.

## Brand Commitments

- **Demo brand:** "Butter & Bloom", with the descriptor _Patisserie · Celebration Cakes_. It is fictional and swappable in config.
- **Story:** a family-run patisserie that blends French technique with Indian flavours and bakes fresh every morning.
- **Voice:** sensory, confident and concise, in short sentences. Banned phrases: "mouth-watering", "delicious treats", "one-stop shop", "look no further", "best in town", "yummy".
- **Themes:** three presets with the palettes and font pairings pinned in the brief (Classic Patisserie, Modern Pastel, Rich Cocoa).

## Evidence on Hand

- There are no real testimonials, ratings, photographs, licence numbers or contact details.
- Testimonials are samples and are labelled as such.
- The Google rating appears only as a labelled sample in demo mode.
- The FSSAI number is left empty.
- Photos are royalty-free stock, credited in `CREDITS.md`, and must show no real bakery's name, logo or signage.
- Never use a real bakery's name, menu, photos or contact details.

## Product Principles

1. **Honest demo:** a visitor can never mistake the demo for a real business.
2. **Config over code:** every client fact lives in config, content or i18n files.
3. **Phone first, WhatsApp native:** every path ends in an easy WhatsApp, call or directions action.
4. **Fast and accessible by default:** performance and accessibility are part of the product, not polish.
5. **Expensive, not busy:** restraint in motion and layout is part of the premium feel.

## Accessibility & Inclusion

- WCAG AA contrast in all three themes.
- Full keyboard access, including the cake builder and cart.
- `prefers-reduced-motion` is respected.
- Tap targets are at least 44 px.
- English and Telugu UI, with Telugu set in Noto Telugu fonts.

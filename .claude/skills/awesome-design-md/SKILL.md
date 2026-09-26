---
name: awesome-design-md
description: Library of 74 ready-made DESIGN.md style guides (colors, fonts, spacing, components, do's and don'ts) analyzed from well-known sites such as Stripe, Apple, Linear, Vercel, Notion, Airbnb, Spotify, Tesla, Nike and Figma. Use when the user wants a page or UI that looks like, feels like, or is inspired by a named brand or website, asks for a DESIGN.md or design system for their project, or wants to browse brand styles to pick one.
---

# Awesome DESIGN.md

Brand style guides from https://github.com/VoltAgent/awesome-design-md (MIT). Each file is in
`designs/<slug>/DESIGN.md` next to this SKILL.md, and describes one site's visual language:
YAML tokens (colors, typography, radii, spacing, components) followed by prose sections
(Overview, Colors, Typography, Layout, Elevation, Shapes, Components, Do's and Don'ts,
Responsive Behavior).

## How to use

1. **Pick the brand.** Match the user's request to a slug in the index below. If they describe
   a vibe instead of naming a brand ("dark and techy", "warm and editorial"), suggest 2-3
   matching brands from the index and let them choose, or pick the closest one and say which.
   Do not load more than one or two files; each is large (20-40 KB).
2. **Read only that file**: `designs/<slug>/DESIGN.md`.
3. **Build from it.** Use its tokens (hex colors, font stacks, sizes, radii, spacing) and follow
   its Components and Do's and Don'ts sections. Honor its Responsive Behavior section.
4. **If the user wants a DESIGN.md for their own project**, copy the chosen file to the project
   root as `DESIGN.md` and adapt the name and description to their project.

## Rules

- **Inspiration, not a clone.** Never copy the brand's logo, name, trademarks, product
  screenshots or marketing copy onto the user's site. Use the user's own brand name and content.
  The files already use altered names (for example "Stripi") for this reason.
- **Proprietary fonts.** Many brands use licensed fonts (Sohne, SF Pro, Circular, etc.). Use the
  free fallback named in the file's "Note on Font Substitutes" / fallback stack unless the user
  owns the license.
- **Working with the taste skills.** When the user asked for a specific brand look, this file
  wins on visual choices (palette, fonts, radii, layout signatures), even where
  `design-taste-frontend` or the other style skills would ban them (e.g. Inter, a purple accent).
  Keep their quality checks that don't conflict: accessibility contrast, responsive collapse,
  reduced motion, no placeholder copy.
- The "Iteration Guide" in some files mentions `npx @google/design.md lint`; only run it if the
  user is editing a DESIGN.md and agrees to installing that package.

## Index (slug: description)

### AI & LLM platforms
- `claude`: Anthropic's AI assistant. Warm terracotta accent, clean editorial layout
- `cohere`: Enterprise AI. Vibrant gradients, data-rich dashboard aesthetic
- `elevenlabs`: AI voice. Dark cinematic UI, audio-waveform aesthetics
- `minimax`: AI models. Bold dark interface with neon accents
- `mistral.ai`: Open-weight LLMs. French-engineered minimalism, purple-toned
- `ollama`: Local LLMs. Terminal-first, monochrome simplicity
- `opencode.ai`: AI coding. Developer-centric dark theme
- `replicate`: ML models via API. Clean white canvas, code-forward
- `runwayml`: AI creative tools. Editorial film-festival look, cinematic dark heroes, black pill CTAs
- `together.ai`: Open-source AI infra. Technical, blueprint-style design
- `voltagent`: AI agent framework. Void-black canvas, emerald accent, terminal-native
- `x.ai`: xAI. Stark monochrome, futuristic minimalism

### Developer tools
- `cursor`: AI code editor. Sleek dark interface, gradient accents
- `expo`: React Native platform. Dark theme, tight letter-spacing, code-centric
- `lovable`: AI full-stack builder. Playful gradients, friendly dev aesthetic
- `raycast`: Productivity launcher. Sleek dark chrome, vibrant gradient accents
- `superhuman`: Email client. Premium dark UI, keyboard-first, purple glow
- `vercel`: Frontend deployment. Black and white precision, Geist font
- `warp`: Terminal. Dark IDE-like interface, block-based command UI

### Backend, database & DevOps
- `clickhouse`: Analytics database. Yellow-accented, technical documentation style
- `composio`: Tool integrations. Modern dark with colorful integration icons
- `hashicorp`: Infrastructure automation. Enterprise-clean, black and white
- `mongodb`: Document database. Green leaf branding, documentation focus
- `posthog`: Product analytics. Playful hedgehog branding, dev-friendly dark UI
- `sanity`: Headless CMS. Dark-first editorial, 112px display type, coral-red CTA
- `sentry`: Error monitoring. Dark dashboard, data-dense, pink-purple accent
- `supabase`: Firebase alternative. Dark emerald theme, code-first

### Productivity & SaaS
- `cal`: Cal.com scheduling. Clean neutral UI, developer-oriented simplicity
- `intercom`: Customer messaging. Friendly blue palette, conversational UI
- `linear.app`: Linear. Ultra-minimal, precise, purple accent
- `mintlify`: Docs platform. Clean, green-accented, reading-optimized
- `notion`: Workspace. Warm minimalism, serif headings, soft surfaces
- `resend`: Email API. Minimal dark theme, monospace accents
- `slack`: Workplace messaging. Deep aubergine primary, cream-lavender hero gradients, pill CTAs
- `zapier`: Automation. Warm orange, friendly illustration-driven

### Design & creative tools
- `airtable`: Colorful, friendly, structured data aesthetic
- `clay`: Creative agency. Organic shapes, soft gradients, art-directed layout
- `figma`: Vibrant multi-color, playful yet professional
- `framer`: Bold black and blue, motion-first, design-forward
- `miro`: Bright yellow accent, infinite canvas aesthetic
- `webflow`: Blue-accented, polished marketing site aesthetic

### Fintech & crypto
- `binance`: Bold yellow on monochrome, trading-floor urgency
- `coinbase`: Clean blue identity, trust-focused, institutional
- `kraken`: Purple-accented dark UI, data-dense dashboards
- `mastercard`: Warm cream canvas, orbital pill shapes, editorial warmth
- `revolut`: Sleek dark interface, gradient cards, fintech precision
- `stripe`: Signature purple gradients, weight-300 elegance
- `wise`: Bright green accent, friendly and clear

### E-commerce & retail
- `airbnb`: Warm coral accent, photography-driven, rounded UI
- `meta`: Photography-first store, binary light/dark surfaces, blue CTAs
- `nike`: Monochrome UI, massive uppercase Futura, full-bleed photography
- `shopify`: Dark-first cinematic, neon green accent, ultra-light display type
- `starbucks`: Earth-green system, warm cream canvas

### Media & consumer tech
- `apple`: Premium white space, SF Pro, cinematic imagery
- `hp`: Pure white canvas, electric blue CTA, geometric type
- `ibm`: Carbon design system, structured blue palette
- `nvidia`: Green-black energy, technical power aesthetic
- `pinterest`: Red accent, masonry grid, image-first
- `playstation`: Three-surface channel layout, cyan hover-scale interaction
- `spacex`: Stark black and white, full-bleed imagery, futuristic
- `spotify`: Vibrant green on dark, bold type, album-art-driven
- `theverge`: Acid-mint and ultraviolet accents, bold display type
- `uber`: Bold black and white, tight type, urban energy
- `vodafone`: Monumental uppercase display, red chapter bands
- `wired`: Paper-white broadsheet density, custom serif, ink-blue links

### Automotive
- `bmw`: Dark premium surfaces, precise German engineering
- `bmw-m`: Motorsport contrast, M color accents
- `bugatti`: Cinema-black canvas, monochrome austerity, monumental type
- `ferrari`: Chiaroscuro black-white editorial, red with extreme sparseness
- `lamborghini`: True black, gold accent, custom neo-grotesk
- `renault`: Vivid aurora gradients, zero-radius buttons
- `tesla`: Radical subtraction, full-viewport photography

### Retro web
- `dell-1996`: Catalog-era web. Black page frame, flat color-block cards, chunky Helvetica
- `nintendo-2001`: Y2K console chrome. Beveled metal panels, glowing amber nav

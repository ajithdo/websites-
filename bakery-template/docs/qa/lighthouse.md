# Lighthouse (mobile) results

Lighthouse 13, mobile preset: simulated slow 4G and a 4× slower CPU. Each page was run three times and the median run is shown. Measured on 27 Sep 2026 against `npm run preview`.

## Demo build (as shown to bakery owners)

| Page         | Performance | Accessibility | Best Practices | SEO | LCP   | CLS   | Page weight |
| ------------ | ----------- | ------------- | -------------- | --- | ----- | ----- | ----------- |
| Home         | 92          | 100           | 100            | 69* | 3.4 s | 0     | 532 KiB     |
| Menu         | 99          | 100           | 100            | 69* | 2.0 s | 0     | 283 KiB     |
| Custom cakes | 97          | 100           | 100            | 66* | 2.3 s | 0.002 | 355 KiB     |
| Gallery      | 89          | 100           | 100            | 69* | 3.8 s | 0.001 | 645 KiB     |
| Contact      | 95          | 100           | 100            | 69* | 2.4 s | 0     | 232 KiB     |

\* The demo is deliberately `noindex` so a sample site never shows up in Google. Lighthouse marks that as "page is blocked from indexing", which caps SEO. The client build below is the real SEO score.

## Client build (`features.demoMode: false`)

| Page         | Performance | Accessibility | Best Practices | SEO | LCP   | CLS   | Page weight |
| ------------ | ----------- | ------------- | -------------- | --- | ----- | ----- | ----------- |
| Home         | 92          | 100           | 100            | 100 | 3.4 s | 0.003 | 527 KiB     |
| Menu         | 97          | 100           | 100            | 100 | 2.3 s | 0     | 280 KiB     |
| Custom cakes | 100         | 100           | 100            | 100 | 1.7 s | 0.003 | 352 KiB     |
| Gallery      | 87          | 100           | 100            | 100 | 3.6 s | 0.001 | 642 KiB     |
| Contact      | 97          | 100           | 100            | 100 | 2.3 s | 0.002 | 227 KiB     |

Targets from the brief (Home, Menu, Custom cakes): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. **All met.** Total Blocking Time is 0 ms on every page.

Gallery is the heaviest page (21 photos) and sits just under 90. The first row loads eagerly on purpose, so the page never looks empty.

## What made the difference

Performance before tuning was 83–94.

- Text in the first screen paints at once instead of waiting for the scroll-reveal script (about −1.5 s LCP on text pages).
- The ₹ sign comes from 1.5 KB subset fonts (`npm run fonts:rupee`) instead of pulling in 15–58 KB extended-Latin files.
- CSS is inlined, with no render-blocking requests; the off-screen footer skips layout (`content-visibility`).
- AVIF/WebP at quality 60 (no visible change on a 3× phone screen), an 800 px hero size for mid-range phones, and no blur-up data URIs on small thumbnails.

## Re-running

```bash
npm run build && npm run preview            # terminal 1
npm run qa:lighthouse                       # terminal 2 → docs/qa/lighthouse/demo/
npm run qa:client-mode                      # builds dist-client/ and checks for demo leftovers
```

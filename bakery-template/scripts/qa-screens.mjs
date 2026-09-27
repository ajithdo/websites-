/**
 * Full-page screenshots of every page at phone, tablet, laptop and desktop
 * widths in all three themes, plus the Telugu home page, for visual review.
 *   npm run build && npm run preview   (in another terminal)
 *   npm run qa:screens -- [baseUrl]
 *
 * Output: docs/screenshots/matrix/<theme>/<page>-<width>.jpg (git-ignored).
 * Set QA_THEMES, QA_WIDTHS or QA_PAGES (comma-separated) to narrow the set.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4321';
const list = (name, fallback) => (process.env[name] ? process.env[name].split(',') : fallback);
const themes = list('QA_THEMES', ['classic', 'pastel', 'cocoa']);
const widths = list('QA_WIDTHS', ['375', '768', '1280', '1440']).map(Number);
const pages = list('QA_PAGES', [
  'home:/',
  'menu:/menu/',
  'custom-cakes:/custom-cakes/',
  'gallery:/gallery/',
  'about:/about/',
  'contact:/contact/',
  'te-home:/te/',
]).map((p) => p.split(':'));

const browser = await chromium.launch();
let count = 0;
for (const theme of themes) {
  const dir = join('docs/screenshots/matrix', theme);
  mkdirSync(dir, { recursive: true });
  for (const width of widths) {
    const phone = width < 768;
    const context = await browser.newContext({
      viewport: { width, height: phone ? 812 : 900 },
      isMobile: phone,
      hasTouch: phone,
    });
    for (const [name, path] of pages) {
      // Telugu is checked once per theme, at phone and desktop widths.
      if (name.startsWith('te-') && width !== 375 && width !== 1440) continue;
      const page = await context.newPage();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => sessionStorage.setItem('bb:intro', '1'));
      await page.route(/google\.com\/maps/, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<body style="background:#e8e2d6">',
        }),
      );
      await page.goto(`${base}${path}?theme=${theme}`, { waitUntil: 'networkidle' });
      // Full-page captures do not scroll, so draw sections deferred with content-visibility.
      await page.addStyleTag({ content: '* { content-visibility: visible !important; }' });
      // Scroll through so lazy images load, then return to the top.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await page
        .waitForFunction(() => [...document.images].every((img) => img.complete), null, {
          timeout: 8000,
        })
        .catch(() => {});
      await page.waitForTimeout(400);
      await page.screenshot({
        path: join(dir, `${name}-${width}.jpg`),
        fullPage: true,
        type: 'jpeg',
        quality: 70,
      });
      count += 1;
      await page.close();
    }
    await context.close();
  }
}
await browser.close();
console.log(`${count} screenshots in docs/screenshots/matrix/`);

/**
 * Quick single screenshot of a running preview (npm run preview):
 *   node scripts/shot.mjs <url> <out.png> [width=375] [height=812] [fullPage=1] [theme]
 * Prints horizontal overflow in px (should be 0).
 */
import { chromium } from '@playwright/test';

const [, , url, out, w = '375', h = '812', full = '1', theme = ''] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.route(/google\.com\/maps/, (route) =>
  route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<body style="margin:0;background:#e8e2d6"></body>',
  }),
);
const target = theme ? `${url}${url.includes('?') ? '&' : '?'}theme=${theme}` : url;
await page.goto(target, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: full === '1' });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - window.innerWidth,
);
console.log(`${out} overflow-x: ${overflow}px`);
await browser.close();

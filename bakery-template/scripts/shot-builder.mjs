/**
 * Walks the cake builder with pointer taps and screenshots every step:
 *   node scripts/shot-builder.mjs <outDir> [width=375] [height=812] [theme]
 * Needs a running preview (npm run preview). Prints horizontal overflow per step.
 */
import { chromium } from '@playwright/test';

const [, , outDir = '.', w = '375', h = '812', theme = ''] = process.argv;
const base = 'http://localhost:4321/custom-cakes/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.addInitScript(() => sessionStorage.setItem('bb:intro', '1'));
await page.goto(theme ? `${base}?theme=${theme}` : base, { waitUntil: 'networkidle' });
const tag = `${w}${theme ? `-${theme}` : ''}`;
let n = 0;
const shot = async (name, full = false) => {
  n += 1;
  await page.waitForTimeout(250);
  const path = `${outDir}/builder-${tag}-${String(n).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path, fullPage: full });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(`${path} overflow-x: ${overflow}px`);
};
const heading = page.locator('#builder-step-title');
const tap = async (name) => {
  await page.getByRole('radio', { name, exact: false }).first().click();
  await page.waitForTimeout(500);
};

await shot('occasion', true);
await tap('Birthday');
await heading.scrollIntoViewIfNeeded();
await shot('flavour');
await tap('Pistachio Rose');
await shot('size');
await tap('1.5 kg');
await shot('design');
await tap('Semi-custom');
await shot('options');
await page.getByRole('switch').check();
await page.getByRole('radio', { name: 'Heart' }).check();
await page.getByLabel(/Message on the cake/).fill('Happy Birthday Anu');
await shot('options-filled');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(400);
await shot('date');
// Second bookable day, so a mid-afternoon slot is free whatever the time now.
await page.locator('.date-chip:not(.is-disabled) input').nth(1).check();
await page.waitForTimeout(200);
await page.locator('.time-chip:not(.is-disabled) input[value="17:00"]').check();
await shot('date-picked');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(400);
await shot('fulfilment');
await tap('Delivery');
await page.getByLabel(/Area/).fill('Kazipet, near the railway station');
await shot('fulfilment-filled');
await page.getByRole('button', { name: 'Continue' }).click();
await page.waitForTimeout(400);
await shot('details');
await page.getByLabel('Your name').fill('Anjali');
await page.getByLabel('Mobile number').fill('98765 43210');
if (+w < 1024) {
  await page.getByRole('button', { name: 'Show your order ticket' }).click();
  await page.waitForTimeout(300);
  await shot('sheet');
  await page.getByRole('button', { name: 'Hide your order ticket' }).click();
}
await page.getByRole('button', { name: 'Review your cake' }).click();
await page.waitForTimeout(400);
await shot('summary', true);
await browser.close();

import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const h = document.querySelector('[data-header]');
  const nav = document.querySelector('.header-nav a');
  const logo = document.querySelector('.logo-word');
  return {
    htmlClass: document.documentElement.className,
    scrolled: h.hasAttribute('data-scrolled'),
    overlay: h.hasAttribute('data-overlay'),
    headerColor: getComputedStyle(h).color,
    navColor: getComputedStyle(nav).color,
    logoColor: getComputedStyle(logo).color,
    bgOpacity: getComputedStyle(h.querySelector('.header-bg')).opacity,
  };
});
console.log(info);
await page.screenshot({ path: process.argv[2] });
await browser.close();

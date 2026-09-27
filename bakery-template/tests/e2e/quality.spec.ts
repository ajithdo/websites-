import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const pages = ['/', '/menu/', '/custom-cakes/', '/gallery/', '/about/', '/contact/', '/te/'];
const themes = ['classic', 'pastel', 'cocoa'] as const;

async function open(page: Page, path: string, theme?: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('bb:intro', '1'));
  // The map only loads on request; keep third-party frames out of the scan.
  await page.route(/google\.com\/maps/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Map</title>' }),
  );
  await page.goto(theme ? `${path}?theme=${theme}` : path);
  await page.waitForFunction(
    () => !document.querySelector('astro-island[ssr]:not([client="interaction"])'),
  );
}

test.describe('accessibility (axe, WCAG 2.2 AA)', () => {
  test.skip(({ isMobile }) => isMobile, 'Colours and structure match on every device');
  for (const theme of themes) {
    for (const path of pages) {
      test(`${path} · ${theme}`, async ({ page }) => {
        await open(page, path, theme);
        // Show the reveal-on-scroll content so it is checked in its final state.
        await page.evaluate(() =>
          document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')),
        );
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const summary = results.violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
        );
        expect(summary).toEqual([]);
      });
    }
  }
});

test.describe('no sideways scrolling', () => {
  test.skip(({ isMobile }) => isMobile, 'Widths are set explicitly');
  for (const width of [320, 375, 768, 1280, 1440, 1920]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of [...pages, '/404-check/']) {
        await open(page, path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

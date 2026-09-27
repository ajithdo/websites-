import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';

test.skip(({ isMobile }) => isMobile, 'SEO output is the same on every device');

async function jsonLd(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b) as Record<string, unknown>);
}

test('home carries bakery structured data and complete meta tags', async ({ page }) => {
  await page.goto('/');
  const bakery = (await jsonLd(page)).find((b) => b['@type'] === 'Bakery');
  expect(bakery).toBeTruthy();
  expect(bakery).toMatchObject({
    name: 'Butter & Bloom',
    telephone: '+919000000000',
    address: { '@type': 'PostalAddress', postalCode: '506001', addressCountry: 'IN' },
  });
  expect(bakery!.openingHoursSpecification).toHaveLength(7);
  expect(bakery).not.toHaveProperty('aggregateRating');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/);
  await expect(page.locator('link[rel="alternate"][hreflang="te"]')).toHaveAttribute(
    'href',
    /\/te\/$/,
  );
  // Demo mode keeps the sample site out of search results.
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\.jpg$/);
});

test('menu page lists every item as structured data', async ({ page }) => {
  await page.goto('/menu/');
  const menu = (await jsonLd(page)).find((b) => b['@type'] === 'Menu') as {
    hasMenuSection: { hasMenuItem: { offers: unknown }[] }[];
  };
  const items = menu.hasMenuSection.flatMap((s) => s.hasMenuItem);
  expect(items).toHaveLength(35);
  expect(items.every((i) => i.offers)).toBe(true);
});

test('link preview image, icons and manifest are generated', async ({ request }) => {
  const og = await request.get('/og.jpg');
  expect(og.ok()).toBe(true);
  expect(og.headers()['content-type']).toContain('image/jpeg');
  const body = await og.body();
  expect(body.length).toBeLessThan(300 * 1024);
  const meta = await sharp(body).metadata();
  expect([meta.width, meta.height]).toEqual([1200, 630]);

  const manifest = (await (await request.get('/site.webmanifest')).json()) as {
    icons: { src: string; sizes: string }[];
  };
  for (const path of [
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
    ...manifest.icons.map((i) => i.src),
  ]) {
    expect((await request.get(path)).ok(), path).toBe(true);
  }
  const icon = await sharp(await (await request.get('/icon-512.png')).body()).metadata();
  expect(icon.width).toBe(512);

  expect(await (await request.get('/robots.txt')).text()).toContain('User-agent: *');
  expect((await request.get('/sitemap-index.xml')).ok()).toBe(true);
});

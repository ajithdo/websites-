import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('bb:intro', '1'));
  await context.route('https://wa.me/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<p>WhatsApp</p>' }),
  );
});

test('contact enquiry validates, then opens WhatsApp with the message', async ({
  page,
  context,
}) => {
  await page.goto('/contact/');
  const form = page.locator('form[data-enquiry-form]');
  await form.getByRole('button', { name: 'Send via WhatsApp' }).click();
  await expect(form.getByText('Please enter your name.')).toBeVisible();
  await expect(form.getByLabel('Your name')).toBeFocused();

  await form.getByLabel('Your name').fill('Priya');
  await form.getByLabel('Mobile number').fill('12345');
  await form.getByRole('button', { name: 'Send via WhatsApp' }).click();
  await expect(form.getByLabel('Mobile number')).toBeFocused();
  await expect(form.getByText('Please enter your name.')).toBeHidden();

  await form.getByLabel('Mobile number').fill('+91 98765 43210');
  await form.getByRole('radio', { name: 'Corporate' }).check();
  await form.getByLabel('Message').fill('40 Diwali boxes for our team, delivered by 3 Nov.');
  const popup = context.waitForEvent('page');
  await form.getByRole('button', { name: 'Send via WhatsApp' }).click();
  const wa = await popup;
  const text = new URL(wa.url()).searchParams.get('text')!;
  expect(new URL(wa.url()).pathname).toBe('/919381487875');
  expect(text).toContain('Hi Butter & Bloom! I have a corporate enquiry.');
  expect(text).toContain('*Name:* Priya');
  expect(text).toContain('*Phone:* 98765 43210');
  expect(text).toContain('40 Diwali boxes for our team, delivered by 3 Nov.');
  await expect(page).toHaveURL(/\/contact\/$/);
});

/** Islands drop their `ssr` attribute once hydrated. */
const hydrated = (page: Page) =>
  page.waitForFunction(
    () => !document.querySelector('astro-island[ssr]:not([client="interaction"])'),
  );

test('gallery lightbox works with the keyboard and filters by occasion', async ({ page }) => {
  await page.goto('/gallery/');
  await hydrated(page);
  await expect(page.locator('.gallery-item')).toHaveCount(21);

  const first = page.locator('.gallery-tile').first();
  await first.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await expect(dialog.getByText('1 of 21')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByText('2 of 21')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByText('21 of 21')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();

  await page.getByRole('button', { name: /^Festive/ }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(4);
  await expect(page).toHaveURL(/\?occasion=festive$/);
  await page.reload();
  await hydrated(page);
  await expect(page.locator('.gallery-item')).toHaveCount(4);
  await expect(page.getByRole('button', { name: /^Festive/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('a missing page shows the branded 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page crumbled.');
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});

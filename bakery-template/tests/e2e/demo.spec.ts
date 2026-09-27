import { expect, test, type Page } from '@playwright/test';

/** Uses the header switch on desktop, or the one inside the menu on phones. */
async function switchLanguage(page: Page, to: 'en' | 'te') {
  const visible = page.locator(`[data-lang-switch="${to}"]:visible`);
  if (!(await visible.count())) await page.locator('[data-menu-open]').click();
  await page.locator(`[data-lang-switch="${to}"]:visible`).first().click();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('bb:intro', '1'));
});

test('?theme= and ?name= preview a look and a bakery name across pages', async ({ page }) => {
  await page.goto('/?theme=cocoa&name=Sri%20Lakshmi%20Bakers');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cocoa');
  await expect(page.locator('[data-brand-name]').first()).toHaveText('Sri Lakshmi Bakers');
  await expect(page).toHaveTitle(/^Sri Lakshmi Bakers/);

  // Prefilled WhatsApp messages greet the previewed name.
  const wa = await page.locator('header a[href^="https://wa.me/"]').first().getAttribute('href');
  expect(new URL(wa!).searchParams.get('text')).toContain('Hi Sri Lakshmi Bakers!');
  expect(wa).toContain('Sri%20Lakshmi%20Bakers');

  // Internal links carry the preview.
  const menuLink = page.locator('header a[href^="/menu/"]').first();
  await expect(menuLink).toHaveAttribute('href', /theme=cocoa/);
  await page.locator('a[href^="/menu/"]:visible').first().click();
  await expect(page).toHaveURL(/\/menu\/\?/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cocoa');
  await expect(page.locator('[data-brand-name]').first()).toHaveText('Sri Lakshmi Bakers');
});

test('the theme panel switches looks and previews a name from the keyboard', async ({ page }) => {
  await page.goto('/about/');
  const trigger = page.getByRole('button', { name: 'Try another look' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const panel = page.getByRole('dialog', { name: 'Try a look' });
  await expect(panel).toBeVisible();

  await panel.getByRole('radio', { name: /Rich Cocoa/ }).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cocoa');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1E1411');
  await expect(page).toHaveURL(/theme=cocoa/);

  await panel.getByLabel('Preview a bakery name').fill('Cake Corner');
  await expect(page.locator('[data-brand-name]').first()).toHaveText('Cake Corner');
  await panel.getByLabel('Preview a bakery name').fill('');
  await expect(page.locator('[data-brand-name]').first()).toHaveText('Butter & Bloom');

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();

  // The choice holds on the next page in this tab.
  await page.goto('/gallery/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cocoa');
});

test('Telugu is remembered and pages are marked lang="te"', async ({ page }) => {
  await page.goto('/menu/');
  await switchLanguage(page, 'te');
  await expect(page).toHaveURL(/\/te\/menu\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'te');
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(/menu/i);

  // Returning to an English address goes straight to the Telugu page.
  await page.goto('/contact/');
  await expect(page).toHaveURL(/\/te\/contact\/$/);

  await switchLanguage(page, 'en');
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-IN');
  await page.goto('/');
  await expect(page).toHaveURL(/localhost:4321\/$/);
});

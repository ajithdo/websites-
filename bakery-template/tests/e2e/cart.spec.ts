import { expect, test, type Page } from '@playwright/test';

/** Capture the wa.me URL instead of leaving the page. */
async function captureWhatsApp(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __wa: string[] }).__wa = [];
    window.open = ((url: string) => {
      (window as unknown as { __wa: string[] }).__wa.push(String(url));
      return {} as Window;
    }) as typeof window.open;
  });
}

test.describe('menu enquiry cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('adds items, switches sizes, survives a reload and writes a WhatsApp order', async ({
    page,
  }) => {
    await captureWhatsApp(page);
    await page.goto('/menu/');
    const truffle = page.locator('#belgian-chocolate-truffle');
    await truffle.getByRole('radio', { name: '1 kg' }).check();
    await truffle.getByRole('button', { name: /Add Belgian Chocolate Truffle/ }).click();
    await page
      .locator('#butter-croissant')
      .getByRole('button', { name: /Add Butter Croissant/ })
      .click();
    await page
      .locator('#butter-croissant')
      .getByRole('button', { name: /Add one more Butter Croissant/ })
      .click();

    const pill = page.getByRole('button', { name: /View order/ });
    await expect(pill).toContainText('3');
    await expect(pill).toContainText('₹1,170');

    await page.reload();
    await expect(page.getByRole('button', { name: /View order/ })).toContainText('₹1,170');

    await page.getByRole('button', { name: /View order/ }).click();
    const drawer = page.getByRole('dialog', { name: 'Your order' });
    await expect(drawer).toBeVisible();
    await drawer.getByLabel(/Make it eggless/).check();
    await expect(drawer.getByText('Estimated total')).toBeVisible();

    // Validation: nothing is sent until the details are complete.
    await drawer.getByRole('button', { name: 'Send order on WhatsApp' }).click();
    await expect(drawer.getByText('Please enter your name.')).toBeVisible();
    await expect(drawer.getByLabel('Your name')).toBeFocused();

    await drawer.getByLabel('Your name').fill('Ananya');
    await drawer.getByLabel('Mobile number').fill('+91 98765-43210');
    await drawer.getByRole('radio', { name: 'Delivery' }).check();
    await drawer.getByLabel('Area / landmark').fill('Kazipet, near the railway station');
    await drawer.getByLabel('Date needed').fill('2031-12-24');
    await drawer.getByRole('button', { name: 'Send order on WhatsApp' }).click();

    const sent = await page.evaluate(() => (window as unknown as { __wa: string[] }).__wa);
    expect(sent).toHaveLength(1);
    const url = new URL(sent[0]!);
    expect(url.origin + url.pathname).toBe('https://wa.me/919000000000');
    const text = url.searchParams.get('text')!;
    expect(text).toContain('• Belgian Chocolate Truffle (1 kg, eggless) × 1 — ₹1,050');
    expect(text).toContain('• Butter Croissant × 2 — ₹220');
    expect(text).toContain('*Estimated total:* ₹1,270');
    expect(text).toContain('*Phone:* 98765 43210');
    expect(text).toContain('*Pickup or delivery:* Delivery to Kazipet, near the railway station');
    expect(text).toContain('*Date needed:* Wed, 24 Dec 2031');
  });

  test('filters and search narrow the menu', async ({ page }) => {
    await page.goto('/menu/');
    await page.getByRole('button', { name: 'Non-veg' }).click();
    await expect(page.locator('.menu-card')).toHaveCount(2);
    await page.getByRole('button', { name: 'Non-veg' }).click();
    await page.getByLabel('Search the menu').fill('croissant');
    await expect(page.locator('.menu-card')).toHaveCount(3);
    await page.getByLabel('Search the menu').fill('zzz');
    await expect(page.getByText(/Nothing matches that/)).toBeVisible();
  });
});

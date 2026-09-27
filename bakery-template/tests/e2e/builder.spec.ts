import { expect, test, type Locator, type Page } from '@playwright/test';

/** Saturday 20 Dec 2031, 10:00 in Hanamkonda (IST), so lead times are predictable. */
const NOW = new Date('2031-12-20T04:30:00Z');

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

/** Presses Tab until `target` has focus, proving it is reachable by keyboard. */
async function tabTo(page: Page, target: Locator, max = 80) {
  for (let i = 0; i < max; i++) {
    if (await target.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('Could not reach the element with the Tab key');
}

const heading = (page: Page) => page.locator('#builder-step-title');

async function continueTo(page: Page, button: string, nextTitle: string | RegExp) {
  await tabTo(page, page.getByRole('button', { name: button, exact: true }));
  await page.keyboard.press('Enter');
  await expect(heading(page)).toContainText(nextTitle);
  await expect(heading(page)).toBeFocused();
}

test.describe('cake builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.setFixedTime(NOW);
    await page.addInitScript(() => sessionStorage.setItem('bb:intro', '1'));
  });

  test('can be completed with the keyboard alone and writes the WhatsApp order', async ({
    page,
  }) => {
    await captureWhatsApp(page);
    await page.goto('/custom-cakes/');

    // 1 · Occasion. Choosing with the keyboard never jumps ahead on its own.
    const birthday = page.getByRole('radio', { name: 'Birthday' });
    await tabTo(page, birthday);
    await page.keyboard.press('Space');
    await expect(birthday).toBeChecked();
    await expect(heading(page)).toContainText('What are we celebrating?');

    // Continue without a choice is blocked on the next step, with the error announced.
    await continueTo(page, 'Continue', 'Choose a flavour');
    await tabTo(page, page.getByRole('button', { name: 'Continue', exact: true }));
    await page.keyboard.press('Enter');
    await expect(page.getByRole('alert')).toHaveText('Choose a flavour to continue.');

    // 2 · Flavour: arrow keys move through the radio group.
    await tabTo(page, page.getByRole('radio', { name: /Belgian Chocolate Truffle/ }));
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /Pistachio Rose/ })).toBeChecked();
    await continueTo(page, 'Continue', 'How big?');

    // 3 · Size
    await tabTo(page, page.getByRole('radio', { name: /½ kg/ }));
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /1\.5 kg/ })).toBeChecked();
    await continueTo(page, 'Continue', 'Pick a design style');

    // 4 · Design
    await tabTo(page, page.getByRole('radio', { name: /Simple cream/ }));
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /Semi-custom/ })).toBeChecked();
    await continueTo(page, 'Continue', 'Final touches');

    // 5 · Options
    await tabTo(page, page.getByRole('switch', { name: /Make it eggless/ }));
    await page.keyboard.press('Space');
    await tabTo(page, page.getByRole('radio', { name: /Round/ }));
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: /Heart/ })).toBeChecked();
    await tabTo(page, page.getByLabel(/Message on the cake/));
    await page.keyboard.type('Happy Birthday Anu');
    await continueTo(page, 'Continue', 'When do you need it?');

    // 6 · Date: today and tomorrow are too soon (48 hours' notice).
    await expect(page.getByRole('radio', { name: /Sat\s*20/ })).toBeDisabled();
    await expect(page.getByRole('radio', { name: /Sun\s*21/ })).toBeDisabled();
    await tabTo(page, page.getByRole('radio', { name: /Mon\s*22/ }));
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: /Wed\s*24/ })).toBeChecked();
    await tabTo(page, page.getByRole('radio', { name: '10 AM', exact: true }));
    for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: '5 PM', exact: true })).toBeChecked();
    await continueTo(page, 'Continue', 'Pickup or delivery?');

    // 7 · Fulfilment
    await tabTo(page, page.getByRole('radio', { name: /Pickup from our counter/ }));
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /Delivery/ })).toBeChecked();
    await tabTo(page, page.getByLabel('Area / landmark'));
    await page.keyboard.type('Kazipet, near the railway station');
    await continueTo(page, 'Continue', 'Who is it for?');

    // 8 · Details: an invalid number is caught before review.
    await tabTo(page, page.getByLabel('Your name'));
    await page.keyboard.type('Anjali');
    await tabTo(page, page.getByLabel('Mobile number'));
    await page.keyboard.type('12345');
    await tabTo(page, page.getByRole('button', { name: 'Review your cake' }));
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Mobile number')).toBeFocused();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('98765 43210');
    await continueTo(page, 'Review your cake', 'Your cake');

    // 9 · Summary: the preview shows the exact message, then send it.
    await expect(page.getByText('₹2,350 – ₹2,750').filter({ visible: true }).first()).toBeVisible();
    await tabTo(page, page.getByRole('button', { name: 'Send on WhatsApp' }));
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('status').filter({ hasText: 'WhatsApp should now be open' }),
    ).toBeVisible();

    const sent = await page.evaluate(() => (window as unknown as { __wa: string[] }).__wa);
    expect(sent).toHaveLength(1);
    const url = new URL(sent[0]!);
    expect(url.origin + url.pathname).toBe('https://wa.me/919381487875');
    const text = url.searchParams.get('text')!;
    for (const line of [
      '*Occasion:* Birthday',
      '*Flavour:* Pistachio Rose (Premium)',
      '*Size:* 1.5 kg · serves ~12',
      '*Design:* Semi-custom',
      '*Shape:* Heart',
      '*Eggless:* Yes',
      '*Message on cake:* "Happy Birthday Anu"',
      '*When:* Wed, 24 Dec 2031 · 5 PM',
      '*Pickup or delivery:* Delivery to Kazipet, near the railway station',
      '*Name:* Anjali',
      '*Phone:* 98765 43210',
      '*Estimate:* ₹2,350 – ₹2,750',
    ]) {
      expect(text).toContain(line);
    }
  });

  test('sending opens WhatsApp in a new tab and keeps the site open', async ({ page, context }) => {
    await context.route('https://wa.me/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<p>WhatsApp</p>' }),
    );
    // A finished design saved from an earlier visit.
    await page.addInitScript(() =>
      localStorage.setItem(
        'bb:builder:v1',
        JSON.stringify({
          step: 8,
          maxStep: 8,
          occasion: 'anniversary',
          flavour: 'red-velvet',
          sizeKg: 1,
          style: 'simple',
          eggless: false,
          shape: 'round',
          message: '',
          date: '2031-12-24',
          time: '12:00',
          fulfilment: 'pickup',
          area: '',
          name: 'Ravi',
          phone: '9876543210',
        }),
      ),
    );
    await page.goto('/custom-cakes/');
    await expect(heading(page)).toContainText('Your cake');
    const popup = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Send on WhatsApp' }).click();
    const wa = await popup;
    expect(wa.url()).toMatch(/^https:\/\/wa\.me\/919381487875\?text=/);
    expect(decodeURIComponent(wa.url())).toContain('*Occasion:* Anniversary');
    await expect(page).toHaveURL(/\/custom-cakes\/$/);
    await expect(
      page.getByRole('status').filter({ hasText: 'WhatsApp should now be open' }),
    ).toBeVisible();
  });

  test('taps advance, drafts survive a reload, and bigger designs need more notice', async ({
    page,
  }) => {
    // A link from the home page's occasion tiles pre-selects the occasion.
    await page.goto('/custom-cakes/?occasion=wedding');
    await expect(heading(page)).toContainText('Choose a flavour');
    await expect(page).toHaveURL(/\/custom-cakes\/$/);

    await page.getByRole('radio', { name: /Red Velvet/ }).click();
    await expect(heading(page)).toContainText('How big?');

    await page.reload();
    await expect(page.getByText('We saved your design from last time.')).toBeVisible();
    await expect(heading(page)).toContainText('How big?');

    await page.getByRole('radio', { name: /½ kg/ }).click();
    await expect(heading(page)).toContainText('Pick a design style');

    // Two-tier cakes start at 1 kg: the size moves up automatically.
    await page.getByRole('radio', { name: /Two-tier/ }).click();
    await expect(heading(page)).toContainText('Final touches');
    await expect(page.locator('.builder-aside')).toContainText('1 kg');

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(heading(page)).toContainText('When do you need it?');
    // 72 hours' notice: Monday is now too soon as well, Tuesday is open.
    await expect(page.getByRole('radio', { name: /Mon\s*22/ })).toBeDisabled();
    await expect(page.getByRole('radio', { name: /Tue\s*23/ })).toBeEnabled();
    await expect(page.getByText(/Earliest available: Tue, 23 Dec/)).toBeVisible();
  });
});

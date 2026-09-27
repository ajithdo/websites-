import { describe, expect, it } from 'vitest';
import { cakeMessage, cartMessage, waLink } from '~/lib/whatsapp';
import { sampleCakeMessage, sampleCartMessage } from '../fixtures/whatsapp-samples';

describe('waLink', () => {
  it('builds a wa.me link with the message URL-encoded (line breaks as %0A)', () => {
    const url = waLink('+91 90000 00000', 'Hi!\n*Bold* & more');
    expect(url).toBe('https://wa.me/919000000000?text=Hi!%0A*Bold*%20%26%20more');
  });
});

describe('cart message', () => {
  const text = cartMessage(sampleCartMessage);
  it('lists every line as a bullet with size, eggless, quantity and price', () => {
    expect(text).toContain('• Belgian Chocolate Truffle (1 kg, eggless) × 1 — ₹1,050');
    expect(text).toContain('• Butter Croissant × 4 — ₹440');
  });
  it('bolds labels with WhatsApp asterisks and ends with the indicative-price note', () => {
    expect(text).toContain('*Estimated total:* ₹1,570');
    expect(text).toContain('*Pickup or delivery:* Delivery to Kazipet, near the railway station');
    expect(
      text.trim().endsWith('_Website prices are indicative. Please confirm the final amount._'),
    ).toBe(true);
  });
  it('matches the reviewed format', () => {
    expect(text).toMatchSnapshot();
  });
});

describe('cake message', () => {
  const text = cakeMessage(sampleCakeMessage);
  it('covers every builder choice and the estimate', () => {
    for (const line of [
      '*Occasion:* Birthday',
      '*Flavour:* Pistachio Rose (Premium)',
      '*Size:* 1.5 kg · serves ~12',
      '*Design:* Designer fondant',
      '*Shape:* Heart',
      '*Eggless:* Yes',
      '*Message on cake:* "Happy 30th, Priya"',
      '*When:* Sat, 10 Oct 2026 · 6 PM',
      '*Estimate:* ₹2,650 – ₹3,050',
    ]) {
      expect(text).toContain(line);
    }
    expect(text).toContain("I'll share a reference photo here.");
  });
  it('matches the reviewed format', () => {
    expect(text).toMatchSnapshot();
  });
});

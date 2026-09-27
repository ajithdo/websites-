/** Sample inputs used by the WhatsApp tests and `npm run whatsapp:sample`. */
import type { CakeMessageInput } from '~/lib/whatsapp';

export const sampleCartMessage = {
  brand: 'Butter & Bloom',
  lines: [
    { name: 'Belgian Chocolate Truffle', variant: '1 kg', qty: 1, total: 1050, eggless: true },
    { name: 'Butter Croissant', qty: 4, total: 440 },
    { name: 'Masala Chai', qty: 2, total: 80 },
  ],
  total: 1570,
  customer: {
    name: 'Ananya',
    phone: '98765 43210',
    fulfilment: 'delivery' as const,
    area: 'Kazipet, near the railway station',
    date: 'Sat, 10 Oct 2026',
    notes: 'Please write "Happy Birthday Amma" on a card.',
  },
};

export const sampleCakeMessage: CakeMessageInput = {
  brand: 'Butter & Bloom',
  occasion: 'Birthday',
  flavour: 'Pistachio Rose',
  tier: 'Premium',
  size: '1.5 kg',
  servings: 12,
  design: 'Designer fondant',
  shape: 'Heart',
  eggless: true,
  message: 'Happy 30th, Priya',
  when: 'Sat, 10 Oct 2026 · 6 PM',
  customer: { name: 'Ananya', phone: '98765 43210', fulfilment: 'pickup' },
  estimate: { low: 2650, high: 3050 },
};

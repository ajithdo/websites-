import { describe, expect, it } from 'vitest';
import {
  cartReducer,
  lineKey,
  priceCart,
  sanitizeCart,
  type CartLine,
  type CartMenuItem,
} from '~/lib/cart';

const menu = new Map<string, CartMenuItem>([
  [
    'truffle',
    {
      id: 'truffle',
      name: 'Belgian Chocolate Truffle',
      egglessAvailable: true,
      variants: [
        { label: '½ kg', price: 550 },
        { label: '1 kg', price: 950 },
      ],
    },
  ],
  ['croissant', { id: 'croissant', name: 'Butter Croissant', egglessAvailable: false, price: 110 }],
]);

describe('cart reducer', () => {
  it('adds, increments and removes at zero', () => {
    let s: CartLine[] = [];
    s = cartReducer(s, { type: 'add', id: 'croissant', variant: null });
    s = cartReducer(s, { type: 'add', id: 'croissant', variant: null });
    expect(s).toEqual([{ id: 'croissant', variant: null, qty: 2, eggless: false }]);
    s = cartReducer(s, { type: 'dec', key: 'croissant' });
    s = cartReducer(s, { type: 'dec', key: 'croissant' });
    expect(s).toEqual([]);
  });

  it('keeps sizes of the same cake as separate lines', () => {
    let s: CartLine[] = [];
    s = cartReducer(s, { type: 'add', id: 'truffle', variant: '½ kg' });
    s = cartReducer(s, { type: 'add', id: 'truffle', variant: '1 kg' });
    expect(s.map((l) => lineKey(l.id, l.variant))).toEqual(['truffle::½ kg', 'truffle::1 kg']);
  });
});

describe('sanitizeCart (data restored from localStorage)', () => {
  it('drops unknown items, unknown sizes, bad quantities and duplicates', () => {
    const raw = [
      { id: 'truffle', variant: '1 kg', qty: 2, eggless: true },
      { id: 'truffle', variant: '2 kg', qty: 1 },
      { id: 'gone', variant: null, qty: 1 },
      { id: 'croissant', variant: null, qty: 0 },
      { id: 'croissant', variant: null, qty: 3, eggless: true },
      { id: 'croissant', variant: null, qty: 1 },
      'junk',
    ];
    expect(sanitizeCart(raw, menu)).toEqual([
      { id: 'truffle', variant: '1 kg', qty: 2, eggless: true },
      { id: 'croissant', variant: null, qty: 3, eggless: false },
    ]);
    expect(sanitizeCart('not an array', menu)).toEqual([]);
  });
});

describe('priceCart', () => {
  it('uses current menu prices plus the eggless surcharge', () => {
    const lines: CartLine[] = [
      { id: 'truffle', variant: '1 kg', qty: 1, eggless: true },
      { id: 'croissant', variant: null, qty: 4, eggless: false },
    ];
    const priced = priceCart(lines, menu, 100);
    expect(priced.rows.map((r) => r.total)).toEqual([1050, 440]);
    expect(priced.total).toBe(1490);
    expect(priced.count).toBe(5);
  });
});

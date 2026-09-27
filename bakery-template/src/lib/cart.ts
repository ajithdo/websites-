/**
 * Enquiry cart state. Only ids, sizes, quantities and the eggless flag are
 * stored; names and prices always come from the current menu, so a stale
 * cart in localStorage can never show an old price.
 */

export interface CartLine {
  id: string;
  /** Variant label ("½ kg"), or null for single-price items. */
  variant: string | null;
  qty: number;
  eggless: boolean;
}

export interface CartMenuItem {
  id: string;
  name: string;
  price?: number;
  variants?: readonly { label: string; price: number }[];
  egglessAvailable: boolean;
}

export type CartAction =
  | { type: 'add'; id: string; variant: string | null }
  | { type: 'inc'; key: string }
  | { type: 'dec'; key: string }
  | { type: 'remove'; key: string }
  | { type: 'eggless'; key: string; value: boolean }
  | { type: 'clear' }
  | { type: 'replace'; lines: CartLine[] };

export const MAX_QTY = 99;

export const lineKey = (id: string, variant: string | null) => (variant ? `${id}::${variant}` : id);
const keyOf = (l: CartLine) => lineKey(l.id, l.variant);

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.id, action.variant);
      const existing = state.find((l) => keyOf(l) === key);
      if (existing) {
        return state.map((l) =>
          keyOf(l) === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l,
        );
      }
      return [...state, { id: action.id, variant: action.variant, qty: 1, eggless: false }];
    }
    case 'inc':
      return state.map((l) =>
        keyOf(l) === action.key ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l,
      );
    case 'dec':
      return state
        .map((l) => (keyOf(l) === action.key ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0);
    case 'remove':
      return state.filter((l) => keyOf(l) !== action.key);
    case 'eggless':
      return state.map((l) => (keyOf(l) === action.key ? { ...l, eggless: action.value } : l));
    case 'clear':
      return [];
    case 'replace':
      return action.lines;
  }
}

/** Drop anything that no longer matches the menu (renamed items, removed sizes). */
export function sanitizeCart(raw: unknown, byId: ReadonlyMap<string, CartMenuItem>): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  const seen = new Set<string>();
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const { id, variant, qty, eggless } = entry as Partial<CartLine>;
    if (typeof id !== 'string') continue;
    const item = byId.get(id);
    if (!item) continue;
    const v = typeof variant === 'string' ? variant : null;
    if (item.variants ? !item.variants.some((x) => x.label === v) : v !== null) continue;
    const n = Math.floor(Number(qty));
    if (!Number.isFinite(n) || n < 1) continue;
    const key = lineKey(id, v);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      id,
      variant: v,
      qty: Math.min(MAX_QTY, n),
      eggless: Boolean(eggless) && item.egglessAvailable,
    });
  }
  return out;
}

export function unitPrice(item: CartMenuItem, variant: string | null): number {
  if (item.variants) return item.variants.find((v) => v.label === variant)?.price ?? 0;
  return item.price ?? 0;
}

export interface PricedLine {
  key: string;
  line: CartLine;
  item: CartMenuItem;
  unit: number;
  total: number;
}

export function priceCart(
  lines: readonly CartLine[],
  byId: ReadonlyMap<string, CartMenuItem>,
  egglessSurcharge: number,
): { rows: PricedLine[]; total: number; count: number } {
  const rows: PricedLine[] = [];
  for (const line of lines) {
    const item = byId.get(line.id);
    if (!item) continue;
    const unit = unitPrice(item, line.variant) + (line.eggless ? egglessSurcharge : 0);
    rows.push({ key: keyOf(line), line, item, unit, total: unit * line.qty });
  }
  return {
    rows,
    total: rows.reduce((sum, r) => sum + r.total, 0),
    count: rows.reduce((sum, r) => sum + r.line.qty, 0),
  };
}

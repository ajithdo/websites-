/**
 * Custom-cake price estimate. All numbers come from site.cakeBuilder.pricing.
 *
 *   per kg   = flavour tier price (Classic / Premium),
 *              or the Designer fondant price for designer cakes,
 *              + semi-custom surcharge (semi-custom only)
 *              + eggless surcharge (if eggless)
 *   subtotal = per kg × size (never below the style's minimum size)
 *   extras   = photo print (photo cakes) + two-tier charge + shape charge
 *   range    = subtotal + extras … +rangeSpread, rounded to `roundTo`
 */
export type Tier = 'classic' | 'premium';
export type StyleId = 'simple' | 'semi-custom' | 'designer' | 'photo' | 'two-tier';
export type Shape = 'round' | 'heart' | 'square';

export interface Pricing {
  perKg: { classic: number; premium: number; designer: number };
  semiCustomPerKg: number;
  egglessPerKg: number;
  photoPrint: number;
  twoTier: number;
  shape: Record<Shape, number>;
  minKg: Partial<Record<StyleId, number>>;
  rangeSpread: number;
  roundTo: number;
}

export interface CakeChoice {
  tier: Tier | null;
  sizeKg: number | null;
  style: StyleId | null;
  eggless: boolean;
  shape: Shape;
}

export interface Estimate {
  perKg: number;
  kg: number;
  subtotal: number;
  extras: number;
  total: number;
  low: number;
  high: number;
}

export function minKgFor(style: StyleId | null, pricing: Pricing): number {
  return (style && pricing.minKg[style]) || 0;
}

export function estimateCake(choice: CakeChoice, pricing: Pricing): Estimate | null {
  if (!choice.tier || !choice.sizeKg) return null;
  const style = choice.style ?? 'simple';

  let perKg = style === 'designer' ? pricing.perKg.designer : pricing.perKg[choice.tier];
  if (style === 'semi-custom') perKg += pricing.semiCustomPerKg;
  if (choice.eggless) perKg += pricing.egglessPerKg;

  const kg = Math.max(choice.sizeKg, minKgFor(style, pricing));
  const subtotal = perKg * kg;

  let extras = pricing.shape[choice.shape] ?? 0;
  if (style === 'photo') extras += pricing.photoPrint;
  if (style === 'two-tier') extras += pricing.twoTier;

  const total = subtotal + extras;
  const step = pricing.roundTo;
  return {
    perKg,
    kg,
    subtotal,
    extras,
    total,
    low: Math.floor(total / step) * step,
    high: Math.ceil((total * (1 + pricing.rangeSpread)) / step) * step,
  };
}

/** Approximate servings for a size (≈ 8 slices per kg by default). */
export function servings(kg: number, perKg: number): number {
  return Math.round(kg * perKg);
}

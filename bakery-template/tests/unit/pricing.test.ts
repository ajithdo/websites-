import { describe, expect, it } from 'vitest';
import { site } from '~/config/site';
import { estimateCake, minKgFor, servings, type Pricing } from '~/lib/pricing';

const pricing = site.cakeBuilder.pricing as Pricing;
const base = { eggless: false, shape: 'round' as const };

describe('estimateCake (brief pricing rules)', () => {
  it('prices a classic 1 kg simple cake at ₹900 → ₹1,050', () => {
    const e = estimateCake({ ...base, tier: 'classic', sizeKg: 1, style: 'simple' }, pricing)!;
    expect(e.total).toBe(900);
    expect([e.low, e.high]).toEqual([900, 1050]);
  });

  it('uses the premium per-kg price', () => {
    const e = estimateCake({ ...base, tier: 'premium', sizeKg: 2, style: 'simple' }, pricing)!;
    expect(e.total).toBe(2400);
  });

  it('adds eggless per kg, semi-custom per kg and the heart/square charge', () => {
    const e = estimateCake(
      { tier: 'premium', sizeKg: 1.5, style: 'semi-custom', eggless: true, shape: 'heart' },
      pricing,
    )!;
    expect(e.perKg).toBe(1200 + 200 + 100);
    expect(e.total).toBe(1500 * 1.5 + 100);
    expect([e.low, e.high]).toEqual([2350, 2750]);
  });

  it('prices designer fondant at ₹1,600/kg with a 1 kg minimum', () => {
    const e = estimateCake({ ...base, tier: 'classic', sizeKg: 0.5, style: 'designer' }, pricing)!;
    expect(e.kg).toBe(1);
    expect(e.total).toBe(1600);
    expect(minKgFor('designer', pricing)).toBe(1);
  });

  it('adds ₹250 for a photo print and ₹500 for two tiers', () => {
    expect(
      estimateCake({ ...base, tier: 'classic', sizeKg: 1, style: 'photo' }, pricing)!.total,
    ).toBe(1150);
    const twoTier = estimateCake(
      { ...base, tier: 'premium', sizeKg: 0.5, style: 'two-tier' },
      pricing,
    )!;
    expect(twoTier.kg).toBe(1);
    expect(twoTier.total).toBe(1200 + 500);
  });

  it('gives a range from the computed price to +15%', () => {
    for (const sizeKg of site.cakeBuilder.sizesKg) {
      const e = estimateCake({ ...base, tier: 'premium', sizeKg, style: 'simple' }, pricing)!;
      expect(e.low).toBeLessThanOrEqual(e.total);
      expect(e.high).toBeGreaterThanOrEqual(e.total * 1.15);
      expect(e.high - e.total * 1.15).toBeLessThan(pricing.roundTo);
    }
  });

  it('returns null until flavour and size are chosen', () => {
    expect(estimateCake({ ...base, tier: null, sizeKg: 1, style: null }, pricing)).toBeNull();
    expect(
      estimateCake({ ...base, tier: 'classic', sizeKg: null, style: null }, pricing),
    ).toBeNull();
  });

  it('estimates ~8 servings per kg', () => {
    expect(servings(1.5, site.cakeBuilder.servingsPerKg)).toBe(12);
    expect(servings(0.5, site.cakeBuilder.servingsPerKg)).toBe(4);
  });
});

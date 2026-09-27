import { describe, expect, it } from 'vitest';
import { sampleCakeMessage } from '../fixtures/whatsapp-samples';
import { estimateCake } from '~/lib/pricing';
import { designStyleIds, occasionIds, shapeIds } from '~/config/schema';
import { site } from '~/config/site';
import {
  builderReducer,
  cakeMessageInput,
  emptyDraft,
  estimateFor,
  firstInvalidStep,
  sanitizeDraft,
  validateStep,
  type BuilderContext,
  type BuilderDraft,
  type MessageLabels,
} from '~/lib/builder';
import type { LeadConfig } from '~/lib/leadtime';
import type { Pricing } from '~/lib/pricing';
import { zonedToEpoch } from '~/lib/time';
import { cakeMessage } from '~/lib/whatsapp';

const ctx: BuilderContext = {
  occasions: occasionIds,
  flavours: site.cakeBuilder.flavours,
  sizesKg: site.cakeBuilder.sizesKg,
  styles: designStyleIds,
  shapes: shapeIds,
  messageMaxLength: site.cakeBuilder.messageMaxLength,
  servingsPerKg: site.cakeBuilder.servingsPerKg,
  pricing: site.cakeBuilder.pricing as Pricing,
  lead: site.cakeBuilder as LeadConfig,
  hours: site.hours,
  timezone: site.timezone,
};
const now = new Date(zonedToEpoch('2026-10-01', '10:00', 'Asia/Kolkata'));
const set = (
  d: BuilderDraft,
  patch: Parameters<typeof builderReducer>[1] extends infer A
    ? A extends { type: 'set'; patch: infer P }
      ? P
      : never
    : never,
) => builderReducer(d, { type: 'set', patch }, ctx);

const complete: BuilderDraft = {
  ...emptyDraft,
  step: 8,
  maxStep: 8,
  occasion: 'birthday',
  flavour: 'pistachio-rose',
  sizeKg: 1.5,
  style: 'designer',
  eggless: true,
  shape: 'heart',
  message: 'Happy 30th, Priya',
  date: '2026-10-10',
  time: '18:00',
  fulfilment: 'pickup',
  name: 'Ananya',
  phone: '98765 43210',
};

describe('builder rules', () => {
  it('raises the size to the 1 kg minimum for designer and two-tier cakes', () => {
    const d = set({ ...emptyDraft, sizeKg: 0.5 }, { style: 'designer' });
    expect(d.sizeKg).toBe(1);
    expect(set({ ...emptyDraft, sizeKg: 0.5 }, { style: 'simple' }).sizeKg).toBe(0.5);
  });

  it('caps the message on the cake at the configured length', () => {
    expect(set(emptyDraft, { message: 'x'.repeat(50) }).message).toHaveLength(30);
  });

  it('requires 48 hours for a simple cake and 72 for designer', () => {
    const base = { ...complete, date: '2026-10-03', time: '10:00' };
    expect(validateStep('date', { ...base, style: 'simple' }, ctx, now)).toEqual({});
    expect(validateStep('date', { ...base, style: 'designer' }, ctx, now)).toEqual({
      time: 'tooSoon',
    });
  });

  it('validates delivery area and Indian mobile numbers', () => {
    expect(
      validateStep('fulfilment', { ...complete, fulfilment: 'delivery', area: '' }, ctx, now),
    ).toEqual({
      area: 'area',
    });
    expect(validateStep('details', { ...complete, phone: '12345' }, ctx, now)).toEqual({
      phone: 'phone',
    });
  });

  it('finds the first unfinished step', () => {
    expect(firstInvalidStep(complete, ctx, now)).toBeNull();
    expect(firstInvalidStep({ ...complete, flavour: null }, ctx, now)).toBe(1);
  });

  it('estimates from the live pricing rules', () => {
    const e = estimateFor(complete, ctx)!;
    // designer ₹1,600 + eggless ₹100 = ₹1,700/kg × 1.5 kg + heart ₹100
    expect(e.total).toBe(2650);
    expect([e.low, e.high]).toEqual([2650, 3050]);
  });
});

describe('saved drafts', () => {
  it('keeps valid fields and drops anything the config no longer offers', () => {
    const d = sanitizeDraft(
      { ...complete, flavour: 'discontinued', sizeKg: 7, shape: 'star', step: 99 },
      ctx,
    )!;
    expect(d.flavour).toBeNull();
    expect(d.sizeKg).toBeNull();
    expect(d.shape).toBe('round');
    expect(d.step).toBe(0);
    expect(d.occasion).toBe('birthday');
  });
  it('ignores empty or broken data', () => {
    expect(sanitizeDraft(null, ctx)).toBeNull();
    expect(sanitizeDraft({ step: 3 }, ctx)).toBeNull();
  });
});

describe('WhatsApp message for a sample build', () => {
  const labels: MessageLabels = {
    occasions: { birthday: 'Birthday' },
    styles: {
      simple: 'Simple cream',
      'semi-custom': 'Semi-custom',
      designer: 'Designer fondant',
      photo: 'Photo cake',
      'two-tier': 'Two-tier',
    },
    shapes: { round: 'Round', heart: 'Heart', square: 'Square' },
    tiers: { classic: 'Classic', premium: 'Premium' },
  };
  it('reads cleanly in WhatsApp', () => {
    const input = cakeMessageInput(complete, ctx, labels, 'Butter & Bloom')!;
    const text = cakeMessage(input);
    expect(text).toContain('*Flavour:* Pistachio Rose (Premium)');
    expect(text).toContain('*Size:* 1.5 kg · serves ~12');
    expect(text).toContain('*When:* Sat, 10 Oct 2026 · 6 PM');
    expect(text).toContain('*Estimate:* ₹2,650 – ₹3,050');
    console.log(`\n${text}\n`);
  });
});

describe('sample WhatsApp cake message', () => {
  it('quotes the price the demo pricing actually produces', () => {
    const est = estimateCake(
      { tier: 'premium', sizeKg: 1.5, style: 'designer', eggless: true, shape: 'heart' },
      site.cakeBuilder.pricing,
    );
    expect(sampleCakeMessage.estimate).toEqual({ low: est!.low, high: est!.high });
  });
});

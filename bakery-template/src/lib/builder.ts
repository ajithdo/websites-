/**
 * Custom-cake builder: state, rules and validation (no UI). Shared by the
 * builder island and its unit tests.
 */
import { formatIndianMobile, formatKg, normalizeIndianMobile } from './format';
import { isSlotAllowed, leadHoursFor, type LeadConfig } from './leadtime';
import {
  estimateCake,
  minKgFor,
  servings,
  type Pricing,
  type Shape,
  type StyleId,
} from './pricing';
import { formatClock, formatDateKey, type WeekHours } from './time';
import type { CakeMessageInput } from './whatsapp';

export const stepIds = [
  'occasion',
  'flavour',
  'size',
  'design',
  'options',
  'date',
  'fulfilment',
  'details',
  'summary',
] as const;
export type StepId = (typeof stepIds)[number];

export interface FlavourOption {
  id: string;
  name: string;
  nameTe?: string | undefined;
  tier: 'classic' | 'premium';
}

export interface BuilderContext {
  occasions: readonly string[];
  flavours: readonly FlavourOption[];
  sizesKg: readonly number[];
  styles: readonly StyleId[];
  shapes: readonly Shape[];
  messageMaxLength: number;
  servingsPerKg: number;
  pricing: Pricing;
  lead: LeadConfig;
  hours: WeekHours;
  timezone: string;
}

export interface BuilderDraft {
  step: number;
  /** Furthest step reached; earlier steps can be revisited from the progress bar. */
  maxStep: number;
  occasion: string | null;
  flavour: string | null;
  sizeKg: number | null;
  style: StyleId | null;
  eggless: boolean;
  shape: Shape;
  message: string;
  date: string | null;
  time: string | null;
  fulfilment: 'pickup' | 'delivery' | null;
  area: string;
  name: string;
  phone: string;
}

export const emptyDraft: BuilderDraft = {
  step: 0,
  maxStep: 0,
  occasion: null,
  flavour: null,
  sizeKg: null,
  style: null,
  eggless: false,
  shape: 'round',
  message: '',
  date: null,
  time: null,
  fulfilment: null,
  area: '',
  name: '',
  phone: '',
};

export type BuilderAction =
  | { type: 'set'; patch: Partial<Omit<BuilderDraft, 'step' | 'maxStep'>> }
  | { type: 'goto'; step: number }
  | { type: 'replace'; draft: BuilderDraft }
  | { type: 'reset' };

const lastStep = stepIds.length - 1;

/** Applies an action and the cross-field rules (minimum size, lead time). */
export function builderReducer(
  state: BuilderDraft,
  action: BuilderAction,
  ctx: BuilderContext,
): BuilderDraft {
  switch (action.type) {
    case 'reset':
      return emptyDraft;
    case 'replace':
      return action.draft;
    case 'goto': {
      const step = Math.max(0, Math.min(lastStep, action.step));
      return { ...state, step, maxStep: Math.max(state.maxStep, step) };
    }
    case 'set': {
      const next = { ...state, ...action.patch };
      // Designer and two-tier cakes have a minimum size.
      const min = minKgFor(next.style, ctx.pricing);
      if (next.sizeKg !== null && next.sizeKg < min) {
        next.sizeKg = ctx.sizesKg.find((s) => s >= min) ?? min;
      }
      if (next.message.length > ctx.messageMaxLength) {
        next.message = next.message.slice(0, ctx.messageMaxLength);
      }
      return next;
    }
  }
}

export function leadFor(draft: Pick<BuilderDraft, 'style'>, ctx: BuilderContext): number {
  return leadHoursFor(draft.style, ctx.lead);
}

export type ErrorKey =
  | 'occasion'
  | 'flavour'
  | 'size'
  | 'design'
  | 'message'
  | 'date'
  | 'time'
  | 'tooSoon'
  | 'area'
  | 'name'
  | 'phone';

export type StepErrors = Partial<Record<keyof BuilderDraft, ErrorKey>>;

/** Errors for one step (empty object = the step is complete). */
export function validateStep(
  step: StepId,
  d: BuilderDraft,
  ctx: BuilderContext,
  now: Date,
): StepErrors {
  const e: StepErrors = {};
  switch (step) {
    case 'occasion':
      if (!d.occasion || !ctx.occasions.includes(d.occasion)) e.occasion = 'occasion';
      break;
    case 'flavour':
      if (!d.flavour || !ctx.flavours.some((f) => f.id === d.flavour)) e.flavour = 'flavour';
      break;
    case 'size':
      if (d.sizeKg === null || !ctx.sizesKg.includes(d.sizeKg)) e.sizeKg = 'size';
      break;
    case 'design':
      if (!d.style || !ctx.styles.includes(d.style)) e.style = 'design';
      break;
    case 'options':
      if (d.message.length > ctx.messageMaxLength) e.message = 'message';
      break;
    case 'date':
      if (!d.date) e.date = 'date';
      else if (!d.time) e.time = 'time';
      else if (
        !isSlotAllowed(
          { date: d.date, time: d.time },
          now,
          leadFor(d, ctx),
          ctx.hours,
          ctx.timezone,
        )
      )
        e.time = 'tooSoon';
      break;
    case 'fulfilment':
      if (!d.fulfilment) e.fulfilment = 'area';
      else if (d.fulfilment === 'delivery' && d.area.trim().length < 3) e.area = 'area';
      break;
    case 'details':
      if (!d.name.trim()) e.name = 'name';
      if (!normalizeIndianMobile(d.phone)) e.phone = 'phone';
      break;
    case 'summary':
      break;
  }
  return e;
}

/** The first step with a problem, or null when everything is ready to send. */
export function firstInvalidStep(d: BuilderDraft, ctx: BuilderContext, now: Date): number | null {
  for (let i = 0; i < lastStep; i++) {
    if (Object.keys(validateStep(stepIds[i]!, d, ctx, now)).length) return i;
  }
  return null;
}

export function flavourOf(d: BuilderDraft, ctx: BuilderContext): FlavourOption | undefined {
  return ctx.flavours.find((f) => f.id === d.flavour);
}

export function estimateFor(d: BuilderDraft, ctx: BuilderContext) {
  const flavour = flavourOf(d, ctx);
  return estimateCake(
    {
      tier: flavour?.tier ?? null,
      sizeKg: d.sizeKg,
      style: d.style,
      eggless: d.eggless,
      shape: d.shape,
    },
    ctx.pricing,
  );
}

/** Keeps a saved draft only as far as it still matches the current config. */
export function sanitizeDraft(raw: unknown, ctx: BuilderContext): BuilderDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<BuilderDraft>;
  const pick = <T>(value: unknown, ok: (v: unknown) => boolean, fallback: T): T =>
    ok(value) ? (value as T) : fallback;
  const str = (v: unknown) => typeof v === 'string';
  const draft: BuilderDraft = {
    step: pick(
      r.step,
      (v) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= lastStep,
      0,
    ),
    maxStep: pick(
      r.maxStep,
      (v) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= lastStep,
      0,
    ),
    occasion: pick(r.occasion, (v) => str(v) && ctx.occasions.includes(v as string), null),
    flavour: pick(r.flavour, (v) => ctx.flavours.some((f) => f.id === v), null),
    sizeKg: pick(r.sizeKg, (v) => typeof v === 'number' && ctx.sizesKg.includes(v), null),
    style: pick(r.style, (v) => ctx.styles.includes(v as StyleId), null),
    eggless: Boolean(r.eggless),
    shape: pick(r.shape, (v) => ctx.shapes.includes(v as Shape), 'round' as Shape),
    message: pick(r.message, str, '').slice(0, ctx.messageMaxLength),
    date: pick(r.date, (v) => str(v) && /^\d{4}-\d{2}-\d{2}$/.test(v as string), null),
    time: pick(r.time, (v) => str(v) && ctx.lead.slots.includes(v as string), null),
    fulfilment: pick(r.fulfilment, (v) => v === 'pickup' || v === 'delivery', null),
    area: pick(r.area, str, '').slice(0, 120),
    name: pick(r.name, str, '').slice(0, 80),
    phone: pick(r.phone, str, '').slice(0, 20),
  };
  draft.maxStep = Math.max(draft.maxStep, draft.step);
  const meaningful = draft.occasion || draft.flavour || draft.sizeKg || draft.style;
  return meaningful ? draft : null;
}

/** English labels for the WhatsApp message (the bakery reads English). */
export interface MessageLabels {
  occasions: Record<string, string>;
  styles: Record<StyleId, string>;
  shapes: Record<Shape, string>;
  tiers: { classic: string; premium: string };
}

export function cakeMessageInput(
  d: BuilderDraft,
  ctx: BuilderContext,
  labels: MessageLabels,
  brand: string,
): CakeMessageInput | null {
  const flavour = flavourOf(d, ctx);
  if (!d.occasion || !flavour || !d.sizeKg || !d.style || !d.date || !d.time || !d.fulfilment)
    return null;
  const phone = normalizeIndianMobile(d.phone);
  if (!phone) return null;
  const estimate = estimateFor(d, ctx);
  return {
    brand,
    occasion: labels.occasions[d.occasion] ?? d.occasion,
    flavour: flavour.name,
    tier: labels.tiers[flavour.tier],
    size: formatKg(d.sizeKg),
    servings: servings(d.sizeKg, ctx.servingsPerKg),
    design: labels.styles[d.style],
    shape: labels.shapes[d.shape],
    eggless: d.eggless,
    message: d.message,
    when: `${formatDateKey(d.date, 'en')} · ${formatClock(d.time, 'en')}`,
    customer: {
      name: d.name,
      phone: formatIndianMobile(phone),
      fulfilment: d.fulfilment,
      area: d.area,
    },
    estimate: estimate ? { low: estimate.low, high: estimate.high } : null,
  };
}

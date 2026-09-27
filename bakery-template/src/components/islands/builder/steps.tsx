import { useRef, type ReactNode } from 'react';
import type { BuilderDraft, StepErrors } from '~/lib/builder';
import { leadFor } from '~/lib/builder';
import { fmt, formatINR, formatKg } from '~/lib/format';
import type { IconName } from '~/lib/icons';
import { dayOptions, earliestSlot, timeOptions } from '~/lib/leadtime';
import { minKgFor, servings, type Shape, type StyleId } from '~/lib/pricing';
import { dateParts, formatClock, formatDateKey } from '~/lib/time';
import { Icon } from '../shared/Icon';
import { ResponsivePicture } from '../shared/ResponsivePicture';
import { ShapeArt, SizeArt, StyleArt } from './illustrations';
import type { BuilderConfig, BuilderLabels, FlavourView } from './types';

export type Patch = Partial<Omit<BuilderDraft, 'step' | 'maxStep'>>;

export interface StepProps {
  draft: BuilderDraft;
  errors: StepErrors;
  labels: BuilderLabels;
  config: BuilderConfig;
  now: Date;
  /** Update the draft; `advance` is true for pointer taps on single-choice cards. */
  onPick: (patch: Patch, advance?: boolean) => void;
}

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

function OptionCard(props: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: (advance: boolean) => void;
  className?: string;
  describedBy?: string;
  children: ReactNode;
}) {
  // Pointer taps may auto-advance to the next step; keyboard selection never does,
  // so arrow keys can move through the options without leaving the step.
  const viaPointer = useRef(false);
  return (
    <label className={cx('option-card', props.className, props.disabled && 'is-disabled')}>
      <input
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        disabled={props.disabled}
        aria-describedby={props.describedBy}
        onPointerDown={() => {
          viaPointer.current = true;
        }}
        onKeyDown={() => {
          viaPointer.current = false;
        }}
        onChange={() => {
          props.onSelect(viaPointer.current);
          viaPointer.current = false;
        }}
        onClick={(e) => {
          // Tapping the card that is already chosen moves on as well (no change event fires).
          if (e.detail > 0 && props.checked) props.onSelect(true);
        }}
      />
      {props.children}
      <span className="option-check" aria-hidden="true">
        <Icon name="check" size={14} strokeWidth={2.4} />
      </span>
    </label>
  );
}

function ErrorText({ id, text }: { id: string; text: string | undefined }) {
  if (!text) return null;
  return (
    <p className="field-error" id={id} role="alert">
      <Icon name="info" size={16} />
      {text}
    </p>
  );
}

const occasionIcons: Record<string, IconName> = {
  birthday: 'cake',
  anniversary: 'heart',
  wedding: 'gem',
  kids: 'party-popper',
  'baby-shower': 'baby',
  festive: 'sparkles',
  corporate: 'briefcase',
  other: 'message-circle',
};

export function OccasionStep({ draft, errors, labels, config, onPick }: StepProps) {
  const e = labels.builder.errors;
  return (
    <fieldset aria-describedby={errors.occasion ? 'err-occasion' : undefined}>
      <legend className="sr-only">{labels.builder.steps.occasion.title}</legend>
      <div className="option-grid option-grid-4">
        {config.ctx.occasions.map((o) => (
          <OptionCard
            key={o}
            name="occasion"
            value={o}
            checked={draft.occasion === o}
            onSelect={(advance) => onPick({ occasion: o }, advance)}
            className="option-card-icon"
          >
            <Icon name={occasionIcons[o] ?? 'cake'} size={26} strokeWidth={1.4} />
            <span className="option-title">
              {labels.occasions[o as keyof BuilderLabels['occasions']]?.label ?? o}
            </span>
          </OptionCard>
        ))}
      </div>
      <ErrorText id="err-occasion" text={errors.occasion && e.occasion} />
    </fieldset>
  );
}

export function FlavourStep({
  draft,
  errors,
  labels,
  config,
  onPick,
  flavours,
}: StepProps & { flavours: FlavourView[] }) {
  const s = labels.builder.steps.flavour;
  const perKg = config.ctx.pricing.perKg;
  return (
    <fieldset aria-describedby={errors.flavour ? 'err-flavour' : undefined}>
      <legend className="sr-only">{s.title}</legend>
      <div className="option-grid option-grid-flavour">
        {flavours.map((f) => (
          <OptionCard
            key={f.id}
            name="flavour"
            value={f.id}
            checked={draft.flavour === f.id}
            onSelect={(advance) => onPick({ flavour: f.id }, advance)}
            className="option-card-photo"
          >
            <span className="option-photo">
              <ResponsivePicture image={f.image} alt="" />
            </span>
            <span className="option-text">
              <span className={cx('option-tier', f.tier === 'premium' && 'is-premium')}>
                {s[f.tier]}
              </span>
              <span className="option-title">
                {config.lang === 'te' && f.nameTe ? f.nameTe : f.name}
              </span>
              <span className="option-price tabular">
                {fmt(labels.builder.perKg, { price: formatINR(perKg[f.tier]) })}
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
      <ErrorText id="err-flavour" text={errors.flavour && labels.builder.errors.flavour} />
    </fieldset>
  );
}

export function SizeStep({ draft, errors, labels, config, onPick }: StepProps) {
  const s = labels.builder.steps.size;
  const { ctx } = config;
  const min = minKgFor(draft.style, ctx.pricing);
  const max = Math.max(...ctx.sizesKg);
  return (
    <fieldset aria-describedby={errors.sizeKg ? 'err-size' : min ? 'size-min' : undefined}>
      <legend className="sr-only">{s.title}</legend>
      <div className="option-grid option-grid-size">
        {ctx.sizesKg.map((kg) => (
          <OptionCard
            key={kg}
            name="size"
            value={String(kg)}
            checked={draft.sizeKg === kg}
            disabled={kg < min}
            onSelect={(advance) => onPick({ sizeKg: kg }, advance)}
            className="option-card-size"
          >
            <SizeArt kg={kg} max={max} />
            <span className="option-title tabular">{formatKg(kg, labels.common.kg)}</span>
            <span className="option-sub">
              {fmt(s.serves, { n: servings(kg, ctx.servingsPerKg) })}
            </span>
          </OptionCard>
        ))}
      </div>
      {min > 0 && draft.style && (
        <p className="step-note" id="size-min">
          {fmt(s.minNote, {
            style: labels.builder.steps.design.styles[draft.style].name,
            kg: formatKg(min, labels.common.kg),
          })}
        </p>
      )}
      <ErrorText id="err-size" text={errors.sizeKg && labels.builder.errors.size} />
    </fieldset>
  );
}

export function DesignStep({ draft, errors, labels, config, onPick }: StepProps) {
  const s = labels.builder.steps.design;
  const p = config.ctx.pricing;
  const hint: Record<StyleId, string> = {
    simple: s.base,
    'semi-custom': `+${fmt(labels.builder.perKg, { price: formatINR(p.semiCustomPerKg) })}`,
    designer: fmt(labels.builder.perKg, { price: formatINR(p.perKg.designer) }),
    photo: `+${formatINR(p.photoPrint)}`,
    'two-tier': `+${formatINR(p.twoTier)}`,
  };
  return (
    <fieldset aria-describedby={errors.style ? 'err-design' : undefined}>
      <legend className="sr-only">{s.title}</legend>
      <div className="option-grid option-grid-design">
        {config.ctx.styles.map((style) => {
          const extended = config.ctx.lead.extendedLeadStyles.includes(style);
          return (
            <OptionCard
              key={style}
              name="design"
              value={style}
              checked={draft.style === style}
              onSelect={(advance) => onPick({ style }, advance)}
              className="option-card-design"
            >
              <span className="option-art">
                <StyleArt style={style} />
              </span>
              <span className="option-text">
                <span className="option-title">{s.styles[style].name}</span>
                <span className="option-sub">{s.styles[style].body}</span>
                <span className="option-meta">
                  <span className="option-price tabular">{hint[style]}</span>
                  {extended && (
                    <span className="option-lead">
                      <Icon name="clock" size={14} />
                      {fmt(s.leadNote, { hours: config.ctx.lead.leadTimeHours.extended })}
                    </span>
                  )}
                </span>
              </span>
            </OptionCard>
          );
        })}
      </div>
      <ErrorText id="err-design" text={errors.style && labels.builder.errors.design} />
    </fieldset>
  );
}

export function OptionsStep({ draft, errors, labels, config, onPick }: StepProps) {
  const s = labels.builder.steps.options;
  const p = config.ctx.pricing;
  const max = config.ctx.messageMaxLength;
  const shapes: Shape[] = [...config.ctx.shapes];
  return (
    <div className="step-stack">
      <label className="switch-row">
        <input
          type="checkbox"
          role="switch"
          checked={draft.eggless}
          onChange={(e) => onPick({ eggless: e.target.checked })}
        />
        <span className="switch-ui" aria-hidden="true" />
        <span className="switch-text">
          {s.eggless}
          <span className="option-sub">{fmt(s.egglessHint, { price: p.egglessPerKg })}</span>
        </span>
      </label>

      <fieldset>
        <legend className="field-label">{s.shape}</legend>
        <div className="option-grid option-grid-3">
          {shapes.map((shape) => (
            <OptionCard
              key={shape}
              name="shape"
              value={shape}
              checked={draft.shape === shape}
              onSelect={() => onPick({ shape })}
              className="option-card-shape"
            >
              <ShapeArt shape={shape} />
              <span className="option-title">{s.shapes[shape]}</span>
              <span className="option-sub tabular">
                {p.shape[shape] ? `+${formatINR(p.shape[shape])}` : s.noExtra}
              </span>
            </OptionCard>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="field-label" htmlFor="cake-message">
          {s.message}
        </label>
        <input
          id="cake-message"
          name="message"
          className="field"
          maxLength={max}
          value={draft.message}
          onChange={(e) => onPick({ message: e.target.value })}
          aria-describedby="cake-message-hint"
          aria-invalid={errors.message ? true : undefined}
          autoComplete="off"
        />
        <p className="field-hint flex justify-between gap-4" id="cake-message-hint">
          <span>{fmt(s.messageHint, { max })}</span>
          <span className="tabular" aria-hidden="true">
            {fmt(s.messageCount, { count: draft.message.length, max })}
          </span>
        </p>
        <p className="sr-only" aria-live="polite">
          {draft.message.length > max - 6
            ? fmt(s.messageCount, { count: draft.message.length, max })
            : ''}
        </p>
      </div>
    </div>
  );
}

export function DateStep({ draft, errors, labels, config, now, onPick }: StepProps) {
  const s = labels.builder.steps.date;
  const { ctx, lang } = config;
  const lead = leadFor(draft, ctx);
  const earliest = earliestSlot(now, lead, ctx.lead, ctx.hours, ctx.timezone);
  const days = dayOptions(now, 14, lead, ctx.lead, ctx.hours, ctx.timezone);
  const times = draft.date
    ? timeOptions(draft.date, now, lead, ctx.lead, ctx.hours, ctx.timezone)
    : [];
  const earliestText = earliest
    ? `${formatDateKey(earliest.date, lang, { weekday: 'short', day: 'numeric', month: 'short' })} · ${formatClock(earliest.time, lang)}`
    : '';
  const styleName = draft.style ? labels.builder.steps.design.styles[draft.style].name : '';
  const outsideStrip = draft.date && !days.some((d) => d.date === draft.date);
  const tooSoon = errors.time === 'tooSoon';

  return (
    <div className="step-stack">
      <p className="lead-banner">
        <Icon name="clock" size={18} />
        <span>
          {tooSoon
            ? fmt(s.tooSoon, { style: styleName, hours: lead, earliest: earliestText })
            : fmt(s.earliest, { earliest: earliestText })}
        </span>
      </p>

      <fieldset aria-describedby={errors.date ? 'err-date' : undefined}>
        <legend className="field-label">{s.daysLabel}</legend>
        <div className="date-strip no-scrollbar">
          {days.map((d) => {
            const parts = dateParts(d.date, lang);
            return (
              <label key={d.date} className={cx('date-chip', !d.available && 'is-disabled')}>
                <input
                  type="radio"
                  name="date"
                  value={d.date}
                  checked={draft.date === d.date}
                  disabled={!d.available}
                  onChange={() => onPick({ date: d.date, time: null })}
                />
                <span className="date-chip-week">{parts.weekday}</span>
                <span className="date-chip-day">{parts.day}</span>
                <span className="date-chip-month">
                  {d.available ? parts.month : labels.builder.tooSoonShort}
                </span>
              </label>
            );
          })}
        </div>
        <div className="mt-4">
          <label className="field-label" htmlFor="cake-date">
            {s.otherDate}
          </label>
          <input
            id="cake-date"
            name="date"
            type="date"
            className={cx('field tabular max-w-xs', outsideStrip && 'is-picked')}
            min={earliest?.date}
            value={outsideStrip ? (draft.date ?? '') : ''}
            onChange={(e) => onPick({ date: e.target.value || null, time: null })}
            aria-invalid={errors.date ? true : undefined}
          />
        </div>
        <ErrorText id="err-date" text={errors.date && labels.builder.errors.date} />
      </fieldset>

      {draft.date && (
        <fieldset aria-describedby={errors.time ? 'err-time' : undefined}>
          <legend className="field-label">
            {s.timeLabel} ·{' '}
            {formatDateKey(draft.date, lang, { weekday: 'long', day: 'numeric', month: 'long' })}
          </legend>
          <div className="time-grid">
            {times.map((t) => (
              <label key={t.time} className={cx('time-chip', !t.available && 'is-disabled')}>
                <input
                  type="radio"
                  name="time"
                  value={t.time}
                  checked={draft.time === t.time}
                  disabled={!t.available}
                  onChange={() => onPick({ time: t.time })}
                />
                <span>{formatClock(t.time, lang)}</span>
              </label>
            ))}
          </div>
          <ErrorText
            id="err-time"
            text={
              errors.time === 'time'
                ? labels.builder.errors.time
                : tooSoon
                  ? labels.builder.errors.tooSoon
                  : undefined
            }
          />
        </fieldset>
      )}
    </div>
  );
}

export function FulfilmentStep({ draft, errors, labels, config, onPick }: StepProps) {
  const s = labels.builder.steps.fulfilment;
  return (
    <div className="step-stack">
      <fieldset aria-describedby={errors.fulfilment ? 'err-fulfilment' : undefined}>
        <legend className="sr-only">{s.title}</legend>
        <div className="option-grid option-grid-2">
          <OptionCard
            name="fulfilment"
            value="pickup"
            checked={draft.fulfilment === 'pickup'}
            onSelect={(advance) => onPick({ fulfilment: 'pickup' }, advance)}
            className="option-card-row"
          >
            <Icon name="store" size={26} strokeWidth={1.4} />
            <span className="option-text">
              <span className="option-title">{s.pickup}</span>
              <span className="option-sub">
                {fmt(s.pickupBody, { address: config.addressLine })}
              </span>
            </span>
          </OptionCard>
          <OptionCard
            name="fulfilment"
            value="delivery"
            checked={draft.fulfilment === 'delivery'}
            onSelect={() => onPick({ fulfilment: 'delivery' })}
            className="option-card-row"
          >
            <Icon name="truck" size={26} strokeWidth={1.4} />
            <span className="option-text">
              <span className="option-title">{s.delivery}</span>
              <span className="option-sub">{fmt(s.deliveryBody, { radius: config.radiusKm })}</span>
            </span>
          </OptionCard>
        </div>
        <ErrorText id="err-fulfilment" text={errors.fulfilment && labels.builder.errors.area} />
      </fieldset>
      {draft.fulfilment === 'delivery' && (
        <div>
          <label className="field-label" htmlFor="cake-area">
            {s.area}
          </label>
          <input
            id="cake-area"
            name="area"
            className="field"
            list="cake-areas"
            placeholder={s.areaHint}
            value={draft.area}
            onChange={(e) => onPick({ area: e.target.value })}
            aria-invalid={errors.area ? true : undefined}
            aria-describedby={errors.area ? 'err-area' : undefined}
            autoComplete="address-level3"
          />
          <datalist id="cake-areas">
            {config.areas.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
          <ErrorText id="err-area" text={errors.area && labels.builder.errors.area} />
        </div>
      )}
    </div>
  );
}

export function DetailsStep({ draft, errors, labels, onPick }: StepProps) {
  const s = labels.builder.steps.details;
  return (
    <div className="step-stack">
      <div>
        <label className="field-label" htmlFor="cake-name">
          {s.name}
        </label>
        <input
          id="cake-name"
          name="name"
          className="field"
          autoComplete="name"
          value={draft.name}
          onChange={(e) => onPick({ name: e.target.value })}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'err-name' : undefined}
        />
        <ErrorText id="err-name" text={errors.name && labels.builder.errors.name} />
      </div>
      <div>
        <label className="field-label" htmlFor="cake-phone">
          {s.phone}
        </label>
        <input
          id="cake-phone"
          name="phone"
          className="field tabular"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="98765 43210"
          value={draft.phone}
          onChange={(e) => onPick({ phone: e.target.value })}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? 'err-phone' : 'cake-phone-hint'}
        />
        {!errors.phone && (
          <p className="field-hint" id="cake-phone-hint">
            {s.phoneHint}
          </p>
        )}
        <ErrorText id="err-phone" text={errors.phone && labels.builder.errors.phone} />
      </div>
      <p className="step-note">
        <Icon name="info" size={16} />
        {s.privacy}
      </p>
    </div>
  );
}

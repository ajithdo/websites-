import type { BuilderContext, BuilderDraft } from '~/lib/builder';
import { estimateFor, flavourOf } from '~/lib/builder';
import { fmt, formatINR, formatKg } from '~/lib/format';
import { servings } from '~/lib/pricing';
import { formatClock, formatDateKey } from '~/lib/time';
import { Icon } from '../shared/Icon';
import { useTween } from '../shared/useTween';
import type { BuilderLabels, BuilderConfig } from './types';

interface Props {
  draft: BuilderDraft;
  ctx: BuilderContext;
  labels: BuilderLabels;
  config: BuilderConfig;
  /** Show "Edit" buttons that jump back to a step. */
  onEdit?: (step: number) => void;
  className?: string;
}

/** The order ticket: fills in as the customer chooses, with a live estimate. */
export function Ticket({ draft, ctx, labels, config, onEdit, className }: Props) {
  const b = labels.builder;
  const s = b.steps;
  const lang = config.lang;
  const flavour = flavourOf(draft, ctx);
  const estimate = estimateFor(draft, ctx);
  const low = useTween(estimate?.low ?? 0);
  const high = useTween(estimate?.high ?? 0);
  const kg = labels.common.kg;

  const rows: { step: number; label: string; value: string }[] = [];
  if (draft.occasion) {
    rows.push({
      step: 0,
      label: s.occasion.label,
      value:
        labels.occasions[draft.occasion as keyof BuilderLabels['occasions']]?.label ??
        draft.occasion,
    });
  }
  if (flavour) {
    const name = lang === 'te' && flavour.nameTe ? flavour.nameTe : flavour.name;
    rows.push({ step: 1, label: s.flavour.label, value: `${name} · ${s.flavour[flavour.tier]}` });
  }
  if (draft.sizeKg) {
    const serves = fmt(s.size.serves, { n: servings(draft.sizeKg, ctx.servingsPerKg) });
    rows.push({ step: 2, label: s.size.label, value: `${formatKg(draft.sizeKg, kg)} · ${serves}` });
  }
  if (draft.style)
    rows.push({ step: 3, label: s.design.label, value: s.design.styles[draft.style].name });
  const extras = [
    draft.eggless ? b.summaryCard.eggless : null,
    draft.shape !== 'round' ? s.options.shapes[draft.shape] : null,
    draft.message.trim() ? `“${draft.message.trim()}”` : null,
  ].filter(Boolean);
  if (draft.step >= 4 && (extras.length || draft.style)) {
    rows.push({
      step: 4,
      label: s.options.label,
      value: extras.length ? extras.join(' · ') : s.options.shapes.round,
    });
  }
  if (draft.date && draft.time) {
    const when = `${formatDateKey(draft.date, lang, { weekday: 'short', day: 'numeric', month: 'short' })} · ${formatClock(draft.time, lang)}`;
    rows.push({ step: 5, label: b.summaryCard.when, value: when });
  }
  if (draft.fulfilment) {
    const value =
      draft.fulfilment === 'delivery'
        ? `${s.fulfilment.delivery}${draft.area.trim() ? ` · ${draft.area.trim()}` : ''}`
        : s.fulfilment.pickup;
    rows.push({ step: 6, label: s.fulfilment.label, value });
  }

  return (
    <div className={['ticket builder-ticket', className].filter(Boolean).join(' ')}>
      <p className="ticket-title">
        <span>{b.summaryCard.title}</span>
        <Icon name="cake" size={16} />
      </p>
      {rows.length === 0 ? (
        <p className="ticket-empty">{b.summaryCard.empty}</p>
      ) : (
        <dl className="ticket-rows">
          {rows.map((r) => (
            <div className="ticket-row" key={r.step}>
              <dt>{r.label}</dt>
              <dd>
                {r.value}
                {onEdit && (
                  <button
                    type="button"
                    className="ticket-edit"
                    onClick={() => onEdit(r.step)}
                    aria-label={`${b.edit}: ${r.label}`}
                  >
                    {b.edit}
                  </button>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <div className="ticket-total">
        <span className="text-ink-muted text-sm">{b.summaryCard.estimate}</span>
        {estimate ? (
          <strong>
            {formatINR(low)} – {formatINR(high)}
          </strong>
        ) : (
          <span className="ticket-pending">{b.summaryCard.estimatePending}</span>
        )}
      </div>
      <p className="ticket-note">{s.summary.estimateNote}</p>
    </div>
  );
}

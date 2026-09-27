import { AnimatePresence, LazyMotion, m, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cakeMessageInput,
  estimateFor,
  firstInvalidStep,
  leadFor,
  stepIds,
  validateStep,
  type StepErrors,
  type StepId,
} from '~/lib/builder';
import { fmt, formatINR, formatINRRange } from '~/lib/format';
import { isSlotAllowed } from '~/lib/leadtime';
import { cakeMessage, waLink } from '~/lib/whatsapp';
import { openExternal } from '~/lib/browser';
import { Icon } from '../shared/Icon';
import './builder.css';
import {
  DateStep,
  DesignStep,
  DetailsStep,
  FlavourStep,
  FulfilmentStep,
  OccasionStep,
  OptionsStep,
  SizeStep,
  type Patch,
} from './steps';
import { Ticket } from './Ticket';
import type { BuilderProps } from './types';
import { useBuilderStore } from './useBuilderStore';
import { WhatsAppPreview } from './WhatsAppPreview';

const loadFeatures = () => import('../shared/motion-features').then((mod) => mod.default);
const autoAdvance: StepId[] = ['occasion', 'flavour', 'size', 'design', 'fulfilment'];

export default function CakeBuilder({ labels, messageLabels, flavours, config }: BuilderProps) {
  const { ctx } = config;
  const b = labels.builder;
  const { draft, dispatch, store } = useBuilderStore(ctx);
  const [now, setNow] = useState(() => new Date());
  const [errors, setErrors] = useState<StepErrors>({});
  const [direction, setDirection] = useState(1);
  const [sent, setSent] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);
  const stepChanged = useRef(false);

  const stepId = stepIds[draft.step]!;
  const total = stepIds.length;
  const estimate = estimateFor(draft, ctx);

  // Lead times depend on the clock; refresh it every minute.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // When a new step's heading mounts (after the old step has animated out), move focus
  // to it so it is announced, and bring the step into view if it starts off-screen or low.
  const headingRef = useCallback(
    (heading: HTMLHeadingElement | null) => {
      if (!heading || !stepChanged.current) return;
      stepChanged.current = false;
      heading.focus({ preventScroll: true });
      const root = rootRef.current;
      if (!root) return;
      const top = root.getBoundingClientRect().top;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (top < 0 || top > offset + 32) {
        root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    },
    [reduced],
  );

  useEffect(() => {
    const dialog = sheetRef.current;
    if (!dialog) return;
    if (sheetOpen && !dialog.open) dialog.showModal();
    if (!sheetOpen && dialog.open) dialog.close();
  }, [sheetOpen]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const goto = (step: number) => {
    window.clearTimeout(advanceTimer.current);
    if (step !== draft.step) stepChanged.current = true;
    setDirection(step >= draft.step ? 1 : -1);
    setErrors({});
    setSent(false);
    dispatch({ type: 'goto', step });
  };

  const focusFirstError = () =>
    window.requestAnimationFrame(() => {
      const target = rootRef.current?.querySelector<HTMLElement>(
        '.builder-step [aria-invalid="true"], .builder-step fieldset[aria-describedby^="err-"] input:not(:disabled)',
      );
      target?.focus();
    });

  const next = () => {
    const found = validateStep(stepId, draft, ctx, now);
    if (Object.keys(found).length) {
      setErrors(found);
      focusFirstError();
      return;
    }
    goto(draft.step + 1);
  };

  const pick = (patch: Patch, advance = false) => {
    // A style change can make the chosen slot too soon (72 h vs 48 h): clear the time.
    if (patch.style && draft.date && draft.time) {
      const lead = leadFor({ style: patch.style }, ctx);
      if (
        !isSlotAllowed({ date: draft.date, time: draft.time }, now, lead, ctx.hours, ctx.timezone)
      ) {
        patch = { ...patch, time: null };
      }
    }
    dispatch({ type: 'set', patch });
    setErrors({});
    window.clearTimeout(advanceTimer.current);
    if (advance && autoAdvance.includes(stepId)) {
      const target = draft.step + 1;
      advanceTimer.current = window.setTimeout(() => goto(target), 320);
    }
  };

  const send = () => {
    const invalid = firstInvalidStep(draft, ctx, now);
    if (invalid !== null) {
      goto(invalid);
      setErrors(validateStep(stepIds[invalid]!, draft, ctx, now));
      return;
    }
    const brand = document.documentElement.dataset.brandPreview ?? config.brand;
    const input = cakeMessageInput(draft, ctx, messageLabels, brand);
    if (!input) return;
    const url = waLink(config.whatsapp, cakeMessage(input));
    openExternal(url);
    setSent(true);
  };

  const startOver = () => {
    if (!window.confirm(b.startOverConfirm)) return;
    setNoticeDismissed(true);
    setErrors({});
    setSent(false);
    setDirection(-1);
    stepChanged.current = draft.step !== 0;
    dispatch({ type: 'reset' });
  };

  const stepProps = { draft, errors, labels, config, now, onPick: pick };
  const stepLabels = stepIds.map((id) => b.steps[id].label);
  const messageInput =
    stepId === 'summary' ? cakeMessageInput(draft, ctx, messageLabels, config.brand) : null;
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * -32 }),
  };
  const estimateText = estimate
    ? formatINRRange(estimate.low, estimate.high)
    : b.summaryCard.estimatePending;

  const contact = (
    <div className="builder-contact">
      <p>{b.questions}</p>
      <div className="flex gap-2">
        <a href={`tel:${config.phone}`} className="btn btn-outline btn-sm">
          <Icon name="phone" size={16} />
          {labels.cta.call}
        </a>
        <a
          href={waLink(config.whatsapp)}
          className="btn btn-outline btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="whatsapp" size={16} />
          {labels.cta.whatsapp}
        </a>
      </div>
    </div>
  );

  return (
    <div className="builder" ref={rootRef}>
      <div className="builder-main">
        {store.restored && !noticeDismissed && draft.step > 0 && (
          <p className="builder-notice">
            <Icon name="rotate-ccw" size={16} />
            <span>{b.draftRestored}</span>
            <button type="button" onClick={startOver}>
              {b.startOver}
            </button>
          </p>
        )}

        <nav
          className="builder-progress"
          aria-label={fmt(b.progress, { n: draft.step + 1, total })}
        >
          <ol>
            {stepLabels.map((label, i) => (
              <li key={stepIds[i]}>
                <button
                  type="button"
                  className="progress-seg"
                  data-state={i < draft.step ? 'done' : i === draft.step ? 'current' : 'todo'}
                  disabled={i > draft.maxStep || i === draft.step}
                  aria-current={i === draft.step ? 'step' : undefined}
                  onClick={() => goto(i)}
                >
                  <span className="sr-only">
                    {i + 1}. {label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <LazyMotion features={loadFeatures} strict>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <m.section
              key={stepId}
              className="builder-step"
              aria-labelledby="builder-step-title"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className="step-head">
                <p className="step-count tabular" aria-hidden="true">
                  {String(draft.step + 1).padStart(2, '0')}
                  <span>/ {String(total).padStart(2, '0')}</span>
                </p>
                <h2
                  id="builder-step-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-display-md step-title"
                >
                  <span className="sr-only">{fmt(b.progress, { n: draft.step + 1, total })}: </span>
                  {b.steps[stepId].title}
                </h2>
                {'help' in b.steps[stepId] && (
                  <p className="step-help">
                    {fmt((b.steps[stepId] as { help: string }).help, {
                      perKg: ctx.servingsPerKg,
                      standard: ctx.lead.leadTimeHours.standard,
                      extended: ctx.lead.leadTimeHours.extended,
                    })}
                  </p>
                )}
              </header>

              <div className="step-body">
                {stepId === 'occasion' && <OccasionStep {...stepProps} />}
                {stepId === 'flavour' && <FlavourStep {...stepProps} flavours={flavours} />}
                {stepId === 'size' && <SizeStep {...stepProps} />}
                {stepId === 'design' && <DesignStep {...stepProps} />}
                {stepId === 'options' && <OptionsStep {...stepProps} />}
                {stepId === 'date' && <DateStep {...stepProps} />}
                {stepId === 'fulfilment' && <FulfilmentStep {...stepProps} />}
                {stepId === 'details' && <DetailsStep {...stepProps} />}
                {stepId === 'summary' && (
                  <div className="summary">
                    <Ticket
                      draft={draft}
                      ctx={ctx}
                      labels={labels}
                      config={config}
                      onEdit={goto}
                      className="summary-ticket"
                    />
                    {messageInput && (
                      <WhatsAppPreview
                        text={cakeMessage(messageInput)}
                        title={b.steps.summary.preview}
                        brand={config.brand}
                      />
                    )}
                    <p className="step-note">
                      <Icon name="camera" size={16} />
                      {b.steps.summary.attach}
                    </p>
                  </div>
                )}
              </div>

              <div className="step-nav">
                {draft.step > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => goto(draft.step - 1)}
                  >
                    <Icon name="arrow-left" size={18} />
                    {b.back}
                  </button>
                )}
                {stepId === 'summary' ? (
                  <button type="button" className="btn step-send" onClick={send}>
                    <Icon name="whatsapp" size={20} />
                    {b.steps.summary.send}
                  </button>
                ) : (
                  <button type="button" className="btn step-next" onClick={next}>
                    {stepId === 'details' ? b.review : b.next}
                    <Icon name="arrow-right" size={18} />
                  </button>
                )}
              </div>
              {sent && (
                <p className="builder-sent" role="status">
                  <Icon name="check" size={18} />
                  {b.steps.summary.sent}
                </p>
              )}
              {stepId === 'summary' && (
                <button type="button" className="builder-restart" onClick={startOver}>
                  {sent ? b.steps.summary.newDesign : b.startOver}
                </button>
              )}
            </m.section>
          </AnimatePresence>
        </LazyMotion>
      </div>

      <aside className="builder-aside" aria-label={b.summaryCard.title}>
        <div className="builder-sticky">
          <Ticket draft={draft} ctx={ctx} labels={labels} config={config} />
          {contact}
        </div>
      </aside>

      {stepId !== 'summary' && (
        <div className="builder-bar">
          <div className="builder-bar-estimate">
            <span className="builder-bar-label">{b.summaryCard.estimate}</span>
            <span className={estimate ? 'builder-bar-value tabular' : 'builder-bar-pending'}>
              {estimate
                ? `${formatINR(estimate.low)} – ${formatINR(estimate.high)}`
                : b.summaryCard.estimatePendingShort}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ink btn-sm builder-bar-btn"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-label={b.summaryCard.open}
          >
            <Icon name="receipt-text" size={16} />
            {b.summaryCard.ticket}
            <Icon name="chevron-up" size={16} />
          </button>
        </div>
      )}

      <dialog
        ref={sheetRef}
        className="builder-sheet"
        aria-label={b.summaryCard.title}
        onClose={() => setSheetOpen(false)}
      >
        <div className="builder-sheet-inner">
          <button
            type="button"
            className="builder-sheet-close btn btn-outline btn-icon"
            onClick={() => setSheetOpen(false)}
            aria-label={b.summaryCard.close}
          >
            <Icon name="x" size={20} />
          </button>
          <Ticket draft={draft} ctx={ctx} labels={labels} config={config} />
          {contact}
        </div>
      </dialog>

      <p className="sr-only" aria-live="polite">
        {estimate ? `${b.summaryCard.estimate}: ${estimateText}` : ''}
      </p>
    </div>
  );
}

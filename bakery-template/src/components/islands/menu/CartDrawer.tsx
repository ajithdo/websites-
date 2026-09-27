import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import type { CartAction, PricedLine } from '~/lib/cart';
import { fmt, formatINR, formatIndianMobile, normalizeIndianMobile } from '~/lib/format';
import { readJSON, storageKeys, writeJSON } from '~/lib/storage';
import { formatDateKey, zonedParts } from '~/lib/time';
import { cartMessage, waLink } from '~/lib/whatsapp';
import { Icon } from '../shared/Icon';
import { ResponsivePicture } from '../shared/ResponsivePicture';
import { useTween } from '../shared/useTween';
import type { MenuConfig, MenuItemView, MenuLabels } from './types';

interface Details {
  name: string;
  phone: string;
  fulfilment: 'pickup' | 'delivery';
  area: string;
  date: string;
  notes: string;
}

type Errors = Partial<Record<'name' | 'phone' | 'area' | 'date' | 'items', string>>;

interface Props {
  open: boolean;
  onClose: () => void;
  rows: PricedLine[];
  total: number;
  count: number;
  dispatch: (a: CartAction) => void;
  labels: MenuLabels;
  config: MenuConfig;
  items: ReadonlyMap<string, MenuItemView>;
}

const emptyDetails: Details = {
  name: '',
  phone: '',
  fulfilment: 'pickup',
  area: '',
  date: '',
  notes: '',
};

export function CartDrawer({
  open,
  onClose,
  rows,
  total,
  count,
  dispatch,
  labels,
  config,
  items,
}: Props) {
  const { cart, common } = labels;
  const ref = useRef<HTMLDialogElement>(null);
  const formId = useId();
  // The details form only renders once the cart has items (after hydration),
  // so restoring this session's details up front cannot cause a mismatch.
  const [details, setDetails] = useState<Details>(() => ({
    ...emptyDetails,
    ...(readJSON<Partial<Details>>(storageKeys.cartDetails, 'session') ?? {}),
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const shownTotal = useTween(total);
  const today = zonedParts(new Date(), config.timezone).dateKey;

  useEffect(() => {
    writeJSON(storageKeys.cartDetails, details, 'session');
  }, [details]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const set = <K extends keyof Details>(key: K, value: Details[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!rows.length) e.items = cart.errors.empty;
    if (!details.name.trim()) e.name = cart.errors.name;
    if (!normalizeIndianMobile(details.phone)) e.phone = cart.errors.phone;
    if (details.fulfilment === 'delivery' && details.area.trim().length < 3)
      e.area = cart.errors.area;
    if (!details.date) e.date = cart.errors.date;
    else if (details.date < today) e.date = cart.errors.pastDate;
    return e;
  };

  const send = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    const firstInvalid = (['name', 'phone', 'area', 'date'] as const).find((k) => found[k]);
    if (firstInvalid) {
      ref.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (found.items) return;
    const brand = document.documentElement.dataset.brandPreview ?? config.brand;
    const text = cartMessage({
      brand,
      lines: rows.map((r) => ({
        name: r.item.name,
        variant: r.line.variant,
        qty: r.line.qty,
        total: r.total,
        eggless: r.line.eggless,
      })),
      total,
      customer: {
        name: details.name,
        phone: formatIndianMobile(normalizeIndianMobile(details.phone)!),
        fulfilment: details.fulfilment,
        area: details.area,
        date: formatDateKey(details.date, 'en'),
        notes: details.notes,
      },
    });
    const url = waLink(config.whatsapp, text);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
    setSent(true);
  };

  const clear = () => {
    if (window.confirm(cart.clearConfirm)) dispatch({ type: 'clear' });
  };

  const errorId = (k: keyof Errors) => `${formId}-${k}-error`;
  const fieldProps = (k: 'name' | 'phone' | 'area' | 'date') => ({
    name: k,
    id: `${formId}-${k}`,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? errorId(k) : undefined,
  });
  const fieldError = (k: keyof Errors) =>
    errors[k] ? (
      <p className="field-error" id={errorId(k)}>
        <Icon name="info" size={16} />
        {errors[k]}
      </p>
    ) : null;

  return (
    // Clicking the backdrop closes the drawer; keyboard users have Esc and the close button.
    // eslint-disable-next-line jsx-a11y-x/click-events-have-key-events, jsx-a11y-x/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className="cart-drawer"
      aria-labelledby={`${formId}-title`}
      onClose={() => {
        setSent(false);
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <form className="cart-panel" onSubmit={send} noValidate>
        <header className="cart-head">
          <div>
            <h2 id={`${formId}-title`} className="font-display text-display-sm">
              {cart.title}
            </h2>
            <p className="text-ink-muted text-sm">
              {count === 1 ? cart.itemsOne : fmt(cart.items, { count })}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-icon"
            onClick={onClose}
            aria-label={cart.close}
          >
            <Icon name="x" size={20} />
          </button>
        </header>

        <div className="cart-body">
          {rows.length === 0 ? (
            <div className="cart-empty">
              <Icon name="shopping-bag" size={36} strokeWidth={1.2} />
              <p>{cart.empty}</p>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                {cart.browse}
              </button>
            </div>
          ) : (
            <>
              <ul className="cart-lines">
                {rows.map((r) => {
                  const view = items.get(r.item.id);
                  return (
                    <li key={r.key} className="cart-line">
                      {view && (
                        <div className="cart-thumb">
                          <ResponsivePicture image={view.image} alt="" />
                        </div>
                      )}
                      <div className="cart-line-main">
                        <p className="cart-line-name">
                          {r.item.name}
                          {r.line.variant && (
                            <span className="text-ink-muted">
                              {' '}
                              · {r.line.variant.replace('kg', common.kg)}
                            </span>
                          )}
                        </p>
                        {r.item.egglessAvailable && (
                          <label className="cart-eggless">
                            <input
                              type="checkbox"
                              checked={r.line.eggless}
                              onChange={(e) =>
                                dispatch({ type: 'eggless', key: r.key, value: e.target.checked })
                              }
                            />
                            <span>{fmt(cart.eggless, { price: config.egglessSurcharge })}</span>
                          </label>
                        )}
                        <div className="cart-line-controls">
                          <div className="stepper stepper-sm" role="group" aria-label={r.item.name}>
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => dispatch({ type: 'dec', key: r.key })}
                              aria-label={fmt(labels.menu.decrease, { item: r.item.name })}
                            >
                              <Icon name="minus" size={14} />
                            </button>
                            <span className="stepper-value tabular">{r.line.qty}</span>
                            <button
                              type="button"
                              className="stepper-btn"
                              onClick={() => dispatch({ type: 'inc', key: r.key })}
                              aria-label={fmt(labels.menu.increase, { item: r.item.name })}
                            >
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                          <span className="tabular font-semibold">{formatINR(r.total)}</span>
                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => dispatch({ type: 'remove', key: r.key })}
                            aria-label={fmt(cart.remove, { item: r.item.name })}
                          >
                            <Icon name="trash-2" size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="cart-total" aria-live="polite">
                <span>{cart.total}</span>
                <strong className="tabular">{formatINR(shownTotal)}</strong>
              </div>
              <p className="text-ink-muted text-sm">{cart.totalNote}</p>

              <fieldset className="cart-details">
                <legend className="font-display text-display-sm">{cart.detailsTitle}</legend>
                <div>
                  <label className="field-label" htmlFor={`${formId}-name`}>
                    {cart.name}
                  </label>
                  <input
                    {...fieldProps('name')}
                    className="field"
                    autoComplete="name"
                    value={details.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                  {fieldError('name')}
                </div>
                <div>
                  <label className="field-label" htmlFor={`${formId}-phone`}>
                    {cart.phone}
                  </label>
                  <input
                    {...fieldProps('phone')}
                    className="field tabular"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    value={details.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                  {!errors.phone && <p className="field-hint">{cart.phoneHint}</p>}
                  {fieldError('phone')}
                </div>
                <fieldset>
                  <legend className="field-label">{cart.fulfilment}</legend>
                  <div className="seg seg-wide">
                    {(['pickup', 'delivery'] as const).map((f) => (
                      <label key={f} className="seg-option">
                        <input
                          type="radio"
                          name="fulfilment"
                          value={f}
                          checked={details.fulfilment === f}
                          onChange={() => set('fulfilment', f)}
                        />
                        <span>
                          <Icon name={f === 'pickup' ? 'store' : 'truck'} size={16} />
                          {cart[f]}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {details.fulfilment === 'delivery' && (
                  <div>
                    <label className="field-label" htmlFor={`${formId}-area`}>
                      {cart.area}
                    </label>
                    <input
                      {...fieldProps('area')}
                      className="field"
                      list={`${formId}-areas`}
                      autoComplete="address-level3"
                      placeholder={cart.areaHint}
                      value={details.area}
                      onChange={(e) => set('area', e.target.value)}
                    />
                    <datalist id={`${formId}-areas`}>
                      {config.areas.map((a) => (
                        <option key={a} value={a} />
                      ))}
                    </datalist>
                    {fieldError('area')}
                  </div>
                )}
                <div>
                  <label className="field-label" htmlFor={`${formId}-date`}>
                    {cart.date}
                  </label>
                  <input
                    {...fieldProps('date')}
                    className="field tabular"
                    type="date"
                    min={today}
                    value={details.date}
                    onChange={(e) => set('date', e.target.value)}
                  />
                  {fieldError('date')}
                </div>
                <div>
                  <label className="field-label" htmlFor={`${formId}-notes`}>
                    {cart.notes}
                  </label>
                  <textarea
                    id={`${formId}-notes`}
                    className="field"
                    rows={2}
                    value={details.notes}
                    onChange={(e) => set('notes', e.target.value)}
                  />
                </div>
              </fieldset>
            </>
          )}
        </div>

        {rows.length > 0 && (
          <footer className="cart-foot">
            {sent && (
              <p className="cart-sent" role="status">
                <Icon name="check" size={18} />
                {cart.sent}
              </p>
            )}
            <button type="submit" className="btn w-full">
              <Icon name="whatsapp" size={20} />
              {cart.send}
            </button>
            <button type="button" className="cart-clear" onClick={clear}>
              {cart.clear}
            </button>
          </footer>
        )}
      </form>
    </dialog>
  );
}

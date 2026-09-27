import { fmt, formatINR } from '~/lib/format';
import { DietMark } from '../shared/DietMark';
import { Icon } from '../shared/Icon';
import { ResponsivePicture } from '../shared/ResponsivePicture';
import type { MenuConfig, MenuItemView, MenuLabels } from './types';

interface Props {
  item: MenuItemView;
  labels: MenuLabels;
  config: MenuConfig;
  /** Selected size label for variant items. */
  variant: string | null;
  onVariant: (label: string) => void;
  /** Quantity of this item (and selected size) in the order. */
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}

export function MenuCard({
  item,
  labels,
  config,
  variant,
  onVariant,
  qty,
  onAdd,
  onInc,
  onDec,
}: Props) {
  const { menu, diet, badges, common } = labels;
  const price = item.variants
    ? (item.variants.find((v) => v.label === variant) ?? item.variants[0]!).price
    : (item.price ?? 0);
  const sizeText = (label: string) => label.replace('kg', common.kg);
  const displayName = item.name;

  return (
    <article className="menu-card" id={item.id} aria-labelledby={`${item.id}-name`}>
      <div className="menu-card-media">
        <ResponsivePicture image={item.image} alt={item.alt} />
      </div>
      <div className="menu-card-body">
        <h3 id={`${item.id}-name`} className="menu-card-name font-display">
          {displayName}
          {config.lang === 'te' && item.nameTe && (
            <span className="menu-card-name-te">{item.nameTe}</span>
          )}
        </h3>
        <p className="menu-card-desc">{item.description}</p>
        <div className="menu-card-meta">
          <DietMark diet={item.diet} label={diet[item.diet]} size={15} />
          {item.badges.map((b) => (
            <span key={b} className={b === 'bestseller' ? 'badge badge-accent' : 'badge'}>
              {badges[b]}
            </span>
          ))}
          {item.egglessAvailable && (
            <span className="menu-card-eggless">
              <Icon name="egg-off" size={14} />
              {diet.eggless}
            </span>
          )}
        </div>

        <div className="menu-card-actions">
          {item.variants && (
            <fieldset className="seg">
              <legend className="sr-only">{fmt(menu.sizeLabel, { item: displayName })}</legend>
              {item.variants.map((v) => (
                <label key={v.label} className="seg-option">
                  <input
                    type="radio"
                    name={`size-${item.id}`}
                    value={v.label}
                    checked={variant === v.label}
                    onChange={() => onVariant(v.label)}
                  />
                  <span>{sizeText(v.label)}</span>
                </label>
              ))}
            </fieldset>
          )}
          <div className="menu-card-buy">
            <span className="menu-card-price tabular">{formatINR(price)}</span>

            {config.cartEnabled &&
              (qty > 0 ? (
                <div
                  className="stepper"
                  role="group"
                  aria-label={fmt(menu.inOrder, { count: qty })}
                >
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={onDec}
                    aria-label={fmt(menu.decrease, { item: displayName })}
                  >
                    <Icon name="minus" size={16} />
                  </button>
                  <span className="stepper-value tabular" aria-hidden="true">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={onInc}
                    aria-label={fmt(menu.increase, { item: displayName })}
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline menu-add"
                  onClick={onAdd}
                  aria-label={fmt(menu.addItem, { item: displayName })}
                >
                  <Icon name="plus" size={16} />
                  {menu.add}
                </button>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}

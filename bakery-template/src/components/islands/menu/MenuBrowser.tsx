import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import './menu.css';
import { lineKey, priceCart, type CartMenuItem } from '~/lib/cart';
import { fmt, formatINR } from '~/lib/format';
import {
  emptyFilter,
  isFiltering,
  matchesFilter,
  type Diet,
  type MenuFilter,
} from '~/lib/menu-filter';
import { DietMark } from '../shared/DietMark';
import { Icon } from '../shared/Icon';
import { useTween } from '../shared/useTween';
import { CartDrawer } from './CartDrawer';
import { MenuCard } from './MenuCard';
import type { CategoryView, MenuConfig, MenuItemView, MenuLabels } from './types';
import { useCart } from './useCart';

interface Props {
  categories: CategoryView[];
  labels: MenuLabels;
  config: MenuConfig;
}

const diets: Diet[] = ['veg', 'egg', 'nonveg'];

export default function MenuBrowser({ categories, labels, config }: Props) {
  const { menu, cart, diet } = labels;
  const items = useMemo(() => {
    const map = new Map<string, MenuItemView>();
    categories.forEach((c) => c.items.forEach((i) => map.set(i.id, i)));
    return map;
  }, [categories]);
  const cartItems = items as ReadonlyMap<string, CartMenuItem>;

  const { lines, dispatch, ready } = useCart(cartItems);
  const [filter, setFilter] = useState<MenuFilter>(emptyFilter);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState(categories[0]?.slug ?? '');
  const tabsRef = useRef<HTMLUListElement>(null);

  const visible = useMemo(
    () =>
      categories
        .map((c) => ({ ...c, items: c.items.filter((i) => matchesFilter(i, filter)) }))
        .filter((c) => c.items.length > 0),
    [categories, filter],
  );
  const resultCount = visible.reduce((n, c) => n + c.items.length, 0);
  const priced = useMemo(
    () => priceCart(lines, cartItems, config.egglessSurcharge),
    [lines, cartItems, config.egglessSurcharge],
  );
  const pillTotal = useTween(priced.total);

  // Scroll-spy: highlight the category in the middle band of the screen.
  useEffect(() => {
    const sections = visible
      .map((c) => document.getElementById(`cat-${c.slug}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id.replace('cat-', ''));
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [visible]);

  // Keep the active tab in view inside the horizontal tab strip.
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!strip || !tab) return;
    const left = tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2;
    strip.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  // Deep links (/menu/#item-id) arrive before hydration; re-apply the highlight.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && items.has(id)) document.getElementById(id)?.classList.add('is-target');
  }, [items]);

  const toggleDiet = (d: Diet) =>
    setFilter((f) => ({
      ...f,
      diets: f.diets.includes(d) ? f.diets.filter((x) => x !== d) : [...f.diets, d],
    }));
  const toggleFlag = (k: 'eggless' | 'bestseller' | 'fresh') =>
    setFilter((f) => ({ ...f, [k]: !f[k] }));

  const chip = (key: string, pressed: boolean, onClick: () => void, children: ReactNode) => (
    <button key={key} type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="menu-browser">
      <div className="container-x menu-tools">
        <div className="menu-search">
          <label htmlFor="menu-search" className="sr-only">
            {menu.searchLabel}
          </label>
          <Icon name="search" size={18} className="menu-search-icon" />
          <input
            id="menu-search"
            type="search"
            className="field"
            placeholder={menu.searchPlaceholder}
            value={filter.query}
            onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
        <div className="menu-chips no-scrollbar" role="group" aria-label={menu.filtersLabel}>
          {diets.map((d) =>
            chip(
              d,
              filter.diets.includes(d),
              () => toggleDiet(d),
              <DietMark diet={d} label={diet[d]} size={14} showLabel />,
            ),
          )}
          {chip(
            'eggless',
            filter.eggless,
            () => toggleFlag('eggless'),
            <>
              <Icon name="egg-off" size={16} />
              {diet.eggless}
            </>,
          )}
          {chip(
            'bestseller',
            filter.bestseller,
            () => toggleFlag('bestseller'),
            labels.badges.bestseller,
          )}
          {chip('new', filter.fresh, () => toggleFlag('fresh'), labels.badges.new)}
        </div>
        <p className="menu-results" aria-live="polite">
          {isFiltering(filter) && (
            <>
              <span>
                {resultCount === 1 ? menu.resultsOne : fmt(menu.results, { count: resultCount })}
              </span>
              <button type="button" className="menu-clear" onClick={() => setFilter(emptyFilter)}>
                {menu.clearFilters}
              </button>
            </>
          )}
        </p>
      </div>

      <nav className="menu-tabs" aria-label={menu.categoriesLabel}>
        <ul ref={tabsRef} className="menu-tabs-list no-scrollbar container-x">
          {visible.map((c) => (
            <li key={c.slug}>
              <a
                href={`#cat-${c.slug}`}
                data-slug={c.slug}
                className="menu-tab"
                aria-current={active === c.slug ? 'true' : undefined}
              >
                {config.lang === 'te' && c.nameTe ? c.nameTe : c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-x menu-sections">
        {visible.length === 0 && (
          <div className="menu-empty">
            <Icon name="search" size={32} strokeWidth={1.2} />
            <p>{menu.noResults}</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setFilter(emptyFilter)}
            >
              {menu.clearFilters}
            </button>
          </div>
        )}
        {visible.map((c) => (
          <section
            key={c.slug}
            id={`cat-${c.slug}`}
            className="menu-section"
            aria-labelledby={`cat-${c.slug}-title`}
          >
            <header className="menu-section-head">
              <h2 id={`cat-${c.slug}-title`} className="text-display-md">
                {config.lang === 'te' && c.nameTe ? c.nameTe : c.name}
              </h2>
              {c.note && <p className="text-ink-muted text-sm">{c.note}</p>}
            </header>
            <div className="menu-grid">
              {c.items.map((item) => {
                const size = item.variants ? (sizes[item.id] ?? item.variants[0]!.label) : null;
                const key = lineKey(item.id, size);
                const qty = lines.find((l) => lineKey(l.id, l.variant) === key)?.qty ?? 0;
                return (
                  <MenuCard
                    key={item.id}
                    item={item}
                    labels={labels}
                    config={config}
                    variant={size}
                    onVariant={(label) => setSizes((s) => ({ ...s, [item.id]: label }))}
                    qty={qty}
                    onAdd={() => dispatch({ type: 'add', id: item.id, variant: size })}
                    onInc={() => dispatch({ type: 'inc', key })}
                    onDec={() => dispatch({ type: 'dec', key })}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {config.cartEnabled && (
        <>
          <p className="sr-only" aria-live="polite">
            {ready && priced.count > 0
              ? fmt(cart.summaryAnnounce, { count: priced.count, total: formatINR(priced.total) })
              : ''}
          </p>
          <div className={priced.count > 0 ? 'cart-pill-wrap is-visible' : 'cart-pill-wrap'}>
            <button
              type="button"
              className="cart-pill"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              tabIndex={priced.count > 0 ? 0 : -1}
              aria-hidden={priced.count > 0 ? undefined : true}
            >
              <span className="cart-pill-count tabular">{priced.count}</span>
              <span>{cart.pill}</span>
              <span className="cart-pill-total tabular">{formatINR(pillTotal)}</span>
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
          <CartDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            rows={priced.rows}
            total={priced.total}
            count={priced.count}
            dispatch={dispatch}
            labels={labels}
            config={config}
            items={items}
          />
        </>
      )}
    </div>
  );
}

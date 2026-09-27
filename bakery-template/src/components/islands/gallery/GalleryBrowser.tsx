import { AnimatePresence, LazyMotion, m, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react';
import { fmt } from '~/lib/format';
import { Icon } from '../shared/Icon';
import { ResponsivePicture } from '../shared/ResponsivePicture';
import './gallery.css';
import type { GalleryItemView, GalleryProps } from './types';

const loadFeatures = () => import('../shared/motion-features').then((mod) => mod.default);

// ?occasion= deep links pre-filter the grid (read after hydration, never on the server).
const subscribeUrl = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const urlOccasion = () => new URLSearchParams(window.location.search).get('occasion');
const noOccasion = () => null;

function writeUrlOccasion(occasion: string) {
  const url = new URL(window.location.href);
  if (occasion === 'all') url.searchParams.delete('occasion');
  else url.searchParams.set('occasion', occasion);
  window.history.replaceState(window.history.state, '', url);
}

export default function GalleryBrowser({ items, labels, config }: GalleryProps) {
  const g = labels.gallery;
  const fromUrl = useSyncExternalStore(subscribeUrl, urlOccasion, noOccasion);
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const urlFilter = fromUrl && config.occasions.includes(fromUrl) ? fromUrl : 'all';
  const filter = picked ?? urlFilter;
  const visible = filter === 'all' ? items : items.filter((i) => i.occasion === filter);
  const current: GalleryItemView | undefined = open === null ? undefined : visible[open];
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.occasion, (counts.get(item.occasion) ?? 0) + 1);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  // Warm the neighbouring photos so swiping feels instant.
  useEffect(() => {
    if (open === null) return;
    for (const offset of [-1, 1]) {
      const next = visible[(open + offset + visible.length) % visible.length];
      if (!next) continue;
      const source = next.full.sources[0];
      const preload = new Image();
      if (source) {
        preload.sizes = next.full.sizes;
        preload.srcset = source.srcset;
      } else {
        preload.src = next.full.src;
      }
    }
  }, [open, visible]);

  const choose = (occasion: string) => {
    setPicked(occasion);
    setOpen(null);
    writeUrlOccasion(occasion);
  };

  const step = (delta: number) => {
    if (open === null || visible.length < 2) return;
    setDirection(delta);
    setOpen((open + delta + visible.length) % visible.length);
  };

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  };

  const chips = ['all', ...config.occasions];
  const occasionLabel = (id: string) =>
    labels.occasions[id as keyof typeof labels.occasions]?.label ?? id;

  return (
    <div className="gallery">
      <div className="gallery-filters" role="group" aria-label={g.filterLabel}>
        {chips.map((id) => (
          <button
            key={id}
            type="button"
            className="chip gallery-chip"
            aria-pressed={filter === id}
            onClick={() => choose(id)}
          >
            {id === 'all' ? g.all : occasionLabel(id)}
            <span className="gallery-chip-count tabular" aria-hidden="true">
              {id === 'all' ? items.length : (counts.get(id) ?? 0)}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {fmt(g.count, { n: visible.length })}
      </p>

      <ul className="gallery-grid">
        {visible.map((item, index) => (
          <li key={item.id} className="gallery-item">
            <a
              href={item.full.src}
              className="gallery-tile"
              aria-haspopup="dialog"
              onClick={(e) => {
                e.preventDefault();
                setDirection(1);
                setOpen(index);
              }}
            >
              <span className="gallery-photo">
                <ResponsivePicture
                  image={item.thumb}
                  alt={item.alt}
                  eager={index < 4}
                  priority={index === 0}
                />
              </span>
              <span className="gallery-caption">{item.caption}</span>
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current?.caption ?? g.eyebrow}
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {current && (
          <div className="lightbox-inner">
            <div className="lightbox-bar">
              <p className="lightbox-count tabular" aria-live="polite">
                {fmt(g.counter, { n: (open ?? 0) + 1, total: visible.length })}
              </p>
              <button
                type="button"
                className="lightbox-btn"
                onClick={() => setOpen(null)}
                aria-label={g.close}
              >
                <Icon name="x" size={22} />
              </button>
            </div>

            <figure
              className="lightbox-figure"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                swipe.current = null;
              }}
            >
              <LazyMotion features={loadFeatures} strict>
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                  <m.div
                    key={current.id}
                    className="lightbox-frame"
                    custom={direction}
                    initial={{ opacity: 0, x: reduced ? 0 : direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: reduced ? 0 : direction * -40 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ResponsivePicture
                      image={current.full}
                      alt={current.alt}
                      eager
                      className="lightbox-picture"
                    />
                  </m.div>
                </AnimatePresence>
              </LazyMotion>
              <figcaption className="lightbox-caption">
                <span className="lightbox-occasion">{occasionLabel(current.occasion)}</span>
                <span className="lightbox-title">{current.caption}</span>
              </figcaption>
            </figure>

            <div className="lightbox-foot">
              <button
                type="button"
                className="lightbox-btn"
                onClick={() => step(-1)}
                aria-label={g.prev}
                disabled={visible.length < 2}
              >
                <Icon name="arrow-left" size={22} />
              </button>
              {config.builderPath && (
                <p className="lightbox-cta">
                  <span>{g.cta}</span>
                  <a
                    href={`${config.builderPath}?occasion=${encodeURIComponent(current.occasion)}`}
                    className="btn btn-sm"
                  >
                    {labels.cta.designCake}
                    <Icon name="arrow-right" size={16} />
                  </a>
                </p>
              )}
              <button
                type="button"
                className="lightbox-btn"
                onClick={() => step(1)}
                aria-label={g.next}
                disabled={visible.length < 2}
              >
                <Icon name="arrow-right" size={22} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

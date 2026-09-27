import { useEffect, useId, useRef, useState } from 'react';
import type { Dictionary } from '~/i18n/en';
import { openExternal } from '~/lib/browser';
import { fmt } from '~/lib/format';
import { writeString } from '~/lib/storage';
import { applyBrandPreview, carryParams } from '~/scripts/preview';
import { Icon } from '../shared/Icon';
import './theme-switcher.css';

export interface ThemeOption {
  id: string;
  name: string;
  /** CSS variable of the theme's display font, to set its name in its own face. */
  headingFont: string;
  fonts: string;
  swatches: string[];
  bg: string;
}

interface Props {
  themes: ThemeOption[];
  labels: Dictionary['demo']['theme'];
  storageKey: string;
}

/**
 * Demo-only panel: switch between the three looks (crossfade), preview a
 * bakery's name across the site, and copy or WhatsApp a link to that preview.
 */
export default function ThemeSwitcher({ themes, labels, storageKey }: Props) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('');
  const [name, setName] = useState('');
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const panelId = useId();
  const nameId = useId();

  // Read the live state only when opening (the server knows neither).
  const show = () => {
    const root = document.documentElement;
    setTheme(root.dataset.theme ?? themes[0]?.id ?? '');
    setName(root.dataset.brandPreview ?? '');
    setCopied('idle');
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('input:checked, input')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const choose = (option: ThemeOption) => {
    setTheme(option.id);
    setCopied('idle');
    const apply = () => {
      document.documentElement.dataset.theme = option.id;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', option.bg);
    };
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm && document.startViewTransition) document.startViewTransition(apply);
    else apply();
    writeString(storageKey, option.id, 'session');
    carryParams({ theme: option.id });
  };

  const rename = (value: string) => {
    setName(value);
    setCopied('idle');
    applyBrandPreview(value);
    carryParams({ name: value.trim() ? value.trim().slice(0, 60) : null });
  };

  const shareUrl = () => {
    const url = new URL(location.pathname, location.origin);
    if (theme) url.searchParams.set('theme', theme);
    if (name.trim()) url.searchParams.set('name', name.trim().slice(0, 60));
    return url.toString();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied('done');
    } catch {
      setCopied('failed');
    }
  };

  return (
    <div className="theme-switcher">
      <button
        ref={triggerRef}
        type="button"
        className="theme-trigger"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? hide() : show())}
      >
        <Icon name="palette" size={20} />
        <span className="theme-trigger-label">{labels.open}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="theme-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <div className="theme-panel-head">
            <h2 id={titleId} className="theme-panel-title">
              {labels.title}
            </h2>
            <button type="button" className="theme-close" onClick={hide} aria-label={labels.close}>
              <Icon name="x" size={18} />
            </button>
          </div>
          <p className="theme-panel-body">{labels.body}</p>

          <fieldset className="theme-options">
            <legend className="sr-only">{labels.title}</legend>
            {themes.map((option) => (
              <label key={option.id} className="theme-option">
                <input
                  type="radio"
                  name="bb-theme"
                  value={option.id}
                  checked={theme === option.id}
                  onChange={() => choose(option)}
                />
                <span className="theme-swatches" aria-hidden="true">
                  {option.swatches.map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </span>
                <span className="theme-option-text">
                  <span
                    className="theme-option-name"
                    style={{ fontFamily: `var(${option.headingFont})` }}
                  >
                    {option.name}
                  </span>
                  <span className="theme-option-fonts">{option.fonts}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="theme-name">
            <label htmlFor={nameId} className="theme-name-label">
              {labels.nameLabel}
            </label>
            <input
              id={nameId}
              className="field"
              value={name}
              maxLength={60}
              placeholder={labels.namePlaceholder}
              autoComplete="off"
              aria-describedby={`${nameId}-hint`}
              onChange={(e) => rename(e.target.value)}
            />
            <p id={`${nameId}-hint`} className="theme-name-hint">
              {labels.nameHint}
            </p>
          </div>

          <div className="theme-actions">
            <button type="button" className="btn btn-ink btn-sm" onClick={copy}>
              <Icon name={copied === 'done' ? 'check' : 'link'} size={16} />
              {copied === 'done' ? labels.copied : labels.copyLink}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                openExternal(
                  `https://wa.me/?text=${encodeURIComponent(fmt(labels.shareMessage, { url: shareUrl() }))}`,
                )
              }
            >
              <Icon name="whatsapp" size={16} />
              {labels.share}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied === 'done' ? labels.copied : ''}
          </p>
          {copied === 'failed' && (
            <p className="theme-copy-fallback">
              <span>{labels.copyFailed}</span>
              <input
                className="field"
                readOnly
                value={shareUrl()}
                onFocus={(e) => e.currentTarget.select()}
                aria-label={labels.copyLink}
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import type { ClientDirective } from 'astro';

/**
 * `client:interaction` hydrates an island on the first hover, press, touch,
 * focus or key press inside it. Pages that only *offer* an island (like the
 * demo theme switcher) then ship no framework JavaScript until someone
 * actually reaches for it. A tap that lands while the code is still loading
 * is replayed once the island is live, so the first tap is never lost.
 */
const EVENTS = ['pointerover', 'pointerdown', 'touchstart', 'focusin', 'keydown'] as const;

const interaction: ClientDirective = (load, _options, el) => {
  let started = false;
  let pending: HTMLElement | null = null;
  const remember = (event: Event) => {
    // Taps often land on an icon's <svg>; replay on the nearest HTML element (the button).
    let node = event.target instanceof Node ? event.target : null;
    while (node && !(node instanceof HTMLElement)) node = node.parentNode;
    pending = node;
    event.preventDefault();
    event.stopPropagation();
  };
  const start = async () => {
    if (started) return;
    started = true;
    for (const type of EVENTS) el.removeEventListener(type, start);
    el.addEventListener('click', remember, true);
    const hydrate = await load();
    await hydrate();
    el.removeEventListener('click', remember, true);
    const target: HTMLElement | null = pending;
    if (target?.isConnected) target.click();
  };
  for (const type of EVENTS) el.addEventListener(type, start, { passive: true });
};

export default interaction;

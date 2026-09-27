import type { ClientDirective } from 'astro';

/**
 * `client:interaction` hydrates an island on the first hover, press, touch,
 * focus or key press inside it. Pages that only *offer* an island (like the
 * demo theme switcher) then ship no framework JavaScript until someone
 * actually reaches for it.
 */
const EVENTS = ['pointerover', 'pointerdown', 'touchstart', 'focusin', 'keydown'] as const;

const interaction: ClientDirective = (load, _options, el) => {
  let started = false;
  const start = async () => {
    if (started) return;
    started = true;
    for (const type of EVENTS) el.removeEventListener(type, start);
    const hydrate = await load();
    await hydrate();
  };
  for (const type of EVENTS) el.addEventListener(type, start, { passive: true });
};

export default interaction;

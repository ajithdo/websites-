/** Finishes (or skips) the first-visit intro and remembers it for the session. */
import { storageKeys, writeString } from '~/lib/storage';

export function initIntro(root: HTMLElement): void {
  if (!root.classList.contains('intro')) return;
  writeString(storageKeys.intro, '1', 'session');
  const end = () => {
    root.classList.remove('intro');
    window.removeEventListener('pointerdown', end);
    window.removeEventListener('keydown', end);
  };
  window.addEventListener('pointerdown', end, { once: true });
  window.addEventListener('keydown', end, { once: true });
  window.setTimeout(end, 1250);
}

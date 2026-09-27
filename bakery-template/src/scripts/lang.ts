/** Remember the visitor's language when they switch. */
import { storageKeys, writeString } from '~/lib/storage';

export function initLangSwitch(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((link) =>
    link.addEventListener('click', () => {
      writeString(storageKeys.lang, link.dataset.langSwitch ?? 'en');
    }),
  );
}

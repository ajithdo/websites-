/** Full-screen mobile menu built on <dialog> (focus trap, Esc and inert page for free). */
export function initMobileMenu(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-mobile-menu]');
  if (!dialog) return;
  const openers = document.querySelectorAll<HTMLElement>('[data-menu-open]');
  const close = () => dialog.close();
  openers.forEach((btn) =>
    btn.addEventListener('click', () => {
      dialog.showModal();
      btn.setAttribute('aria-expanded', 'true');
    }),
  );
  dialog.addEventListener('close', () =>
    openers.forEach((btn) => btn.setAttribute('aria-expanded', 'false')),
  );
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', close);
  dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  matchMedia('(min-width: 64rem)').addEventListener('change', (e) => e.matches && close());
}

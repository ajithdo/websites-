/** Lenis smooth scrolling on desktop only; never with reduced motion or touch. */
export function initSmoothScroll(root: HTMLElement): void {
  if (root.dataset.smoothScroll === undefined) return;
  const ok = matchMedia(
    '(pointer: fine) and (min-width: 64rem) and (prefers-reduced-motion: no-preference)',
  );
  if (!ok.matches) return;
  const start = () =>
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({ anchors: { offset: -80 }, autoRaf: true, lerp: 0.12 });
      // Pause while any modal, sheet or drawer is open.
      new MutationObserver(() => {
        const locked = document.querySelector('dialog[open], [data-scroll-lock]');
        if (locked) lenis.stop();
        else lenis.start();
      }).observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['open', 'data-scroll-lock'],
      });
    });
  if ('requestIdleCallback' in window)
    window.requestIdleCallback(() => void start(), { timeout: 3000 });
  else setTimeout(() => void start(), 1500);
}

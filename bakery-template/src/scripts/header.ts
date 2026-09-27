/** Marks the header as scrolled once the page moves past the top. */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector('[data-scroll-sentinel]');
  if (!header || !sentinel || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => {
    header.toggleAttribute('data-scrolled', !entry?.isIntersecting);
  }).observe(sentinel);
}

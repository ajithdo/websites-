/** Prev / next buttons for scroll-snap tracks ([data-carousel] > [data-carousel-track]). */
export function initCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
    if (!track) return;
    const step = () => {
      const first = track.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: smooth }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: smooth }));
    track.addEventListener('scroll', sync, { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: step(), behavior: smooth });
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -step(), behavior: smooth });
    });
    sync();
  });
}

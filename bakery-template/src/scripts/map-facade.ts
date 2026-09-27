/** Mounts the Google Maps iframe when the placeholder nears the viewport or is tapped. */
export function initMapFacades(): void {
  document.querySelectorAll<HTMLElement>('[data-map-facade]').forEach((box) => {
    let done = false;
    const mount = () => {
      if (done) return;
      done = true;
      const iframe = document.createElement('iframe');
      iframe.src = box.dataset.src ?? '';
      iframe.title = box.dataset.title ?? 'Map';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      box.append(iframe);
      box.querySelector('[data-map-load]')?.remove();
    };
    box.querySelector('[data-map-load]')?.addEventListener('click', mount);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            mount();
          }
        },
        { rootMargin: '200px 0px' },
      );
      io.observe(box);
    }
  });
}

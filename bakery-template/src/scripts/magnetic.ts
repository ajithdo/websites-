/** Primary buttons lean gently toward the pointer (fine pointers, motion allowed). */
export function initMagnetic(): void {
  if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.18;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

import { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animates a number towards `target` with an exponential ease-out.
 * Returns the target directly when the visitor prefers reduced motion.
 */
export function useTween(target: number, duration = 650): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const reduced = prefersReduced();

  useEffect(() => {
    const start = from.current;
    if (reduced || start === target) {
      from.current = target;
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const next = p === 1 ? target : start + (target - start) * (1 - Math.pow(2, -10 * p));
      from.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return reduced ? target : value;
}

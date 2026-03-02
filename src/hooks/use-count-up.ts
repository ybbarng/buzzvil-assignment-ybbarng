import { useEffect, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

const DURATION_MS = 1200;

/** 0에서 target까지 카운트업 애니메이션. reduced-motion 시 즉시 표시. */
export function useCountUp(target: number, delay = 0): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || target === 0) {
      setValue(target);
      return;
    }

    let rafId = 0;
    const timerId = window.setTimeout(() => {
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION_MS, 1);
        setValue(Math.round(easeOutCubic(progress) * target));

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        }
      }

      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [target, delay]);

  return value;
}

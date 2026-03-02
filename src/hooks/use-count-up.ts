import { useEffect, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

const DURATION_MS = 1200;

/** 0→1 진행률을 반환. 숫자 표시와 바 너비에 모두 사용. */
export function useCountUpProgress(delay = 0): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setProgress(1);
      return;
    }

    let rafId = 0;
    const timerId = window.setTimeout(() => {
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const raw = Math.min(elapsed / DURATION_MS, 1);
        setProgress(easeOutCubic(raw));

        if (raw < 1) {
          rafId = requestAnimationFrame(tick);
        }
      }

      rafId = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [delay]);

  return progress;
}

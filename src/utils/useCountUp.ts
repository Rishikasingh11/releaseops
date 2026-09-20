import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value counting up from its previous value to `target`
 * whenever `target` changes. Non-numeric targets (e.g. "73%", "5d") are
 * detected and returned as-is — only pure integers animate.
 */
export function useCountUp(target: number, durationMs = 600): number {
  const [value, setValue] = useState(target);
  const frameRef = useRef<number>(0);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(from + (target - from) * eased);
      setValue(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = target;
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, durationMs]);

  return value;
}

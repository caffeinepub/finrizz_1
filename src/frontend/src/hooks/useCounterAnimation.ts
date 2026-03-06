import { useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface UseCounterAnimationOptions {
  /** Target numeric value */
  target: number;
  /** Decimal places to display (default 0) */
  decimals?: number;
  /** Prefix string (e.g. "₹") */
  prefix?: string;
  /** Locale for number formatting (default "en-IN") */
  locale?: string;
}

/**
 * Animates a number from its previous value to `target` using a spring.
 * Returns a reactive display string that re-renders on each frame.
 */
export function useAnimatedCounter({
  target,
  decimals = 0,
  prefix = "",
  locale = "en-IN",
}: UseCounterAnimationOptions): string {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 55,
    damping: 20,
    mass: 1,
  });

  const fmt = useCallback(
    (v: number) =>
      `${prefix}${v.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
    [prefix, decimals, locale],
  );

  const [display, setDisplay] = useState<string>(() => fmt(0));

  useEffect(() => {
    motionValue.set(target);
  }, [target, motionValue]);

  useEffect(() => {
    return spring.on("change", (v) => {
      setDisplay(fmt(v));
    });
  }, [spring, fmt]);

  return display;
}

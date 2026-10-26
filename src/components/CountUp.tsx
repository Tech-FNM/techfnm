import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Animates the number inside a CMS string ("250+", "95%", "5.0/5", "50+") when it scrolls into view.
// Non-numeric values and reduced-motion users get the final text straight away.
export default function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const text = String(value ?? '');
  const match = text.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const zero = match ? `${match[1]}${(0).toFixed(match[2].includes('.') ? match[2].split('.')[1].length : 0)}${match[3]}` : text;
  const [display, setDisplay] = useState(() => (match && !reducedMotion() ? zero : text));

  useEffect(() => {
    if (!match || reducedMotion()) {
      setDisplay(text);
      return;
    }
    if (!inView) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num);
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, inView]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

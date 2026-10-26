import { useEffect, useRef } from 'react';

const INTERACTIVE = 'button, a, input, select, textarea, [role="button"], .cursor-pointer';

// Decorative cursor dot. Moves via a direct style write per animation frame instead of React state,
// which used to re-render the component (and re-attach its listeners) on every mouse move.
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = dot.current;
    if (!el) return;

    let x = -100;
    let y = -100;
    let frame = 0;

    const paint = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMouseMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = '1';
      const hovering = !!(e.target as HTMLElement)?.closest?.(INTERACTIVE);
      el.style.width = el.style.height = hovering ? '10px' : '7px';
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const hide = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', hide);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-[width,height,opacity] duration-150 ease-out"
      style={{
        width: '7px',
        height: '7px',
        opacity: 0,
        backgroundColor: '#e5432e',
        boxShadow: '0 0 10px rgba(229, 67, 46, 0.75)',
        transform: 'translate3d(-100px, -100px, 0)'
      }}
    />
  );
}

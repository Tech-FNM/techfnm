import { ReactNode, useEffect, useRef, useState } from 'react';

// Renders below-the-fold sections only when they approach the viewport, so the
// homepage's first paint and main-thread work stay small on mobile.
// (Crawlers still get the full content from the server-rendered HTML.)
export default function LazySection({ children, minHeight = 600, id }: { children: ReactNode; minHeight?: number; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Arriving via a deep link (/#contact, /#pricing…) renders everything up front, otherwise the
  // placeholders above the target change height after the jump and the page lands in the wrong place.
  const [show, setShow] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window) || !!window.location.hash);

  useEffect(() => {
    if (show || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show]);

  return show ? <>{children}</> : <div ref={ref} id={id} style={{ minHeight }} aria-hidden="true" />;
}

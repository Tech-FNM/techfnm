import { ReactNode, useEffect, useRef, useState } from 'react';

// Renders below-the-fold sections only when they approach the viewport, so the
// homepage's first paint and main-thread work stay small on mobile.
// (Crawlers still get the full content from the server-rendered HTML.)
export default function LazySection({ children, minHeight = 600, id }: { children: ReactNode; minHeight?: number; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window) || !!(id && window.location.hash === `#${id}`));

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

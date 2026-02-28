import { useEffect, useRef, useState } from 'react';

interface UseHasEnteredViewportOptions {
  rootMargin?: string;
}

export const useHasEnteredViewport = <T extends HTMLElement>({
  rootMargin = '200px',
}: UseHasEnteredViewportOptions = {}) => {
  const containerRef = useRef<T | null>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    if (hasEnteredViewport) {
      return;
    }

    const node = containerRef.current;

    if (!node) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasEnteredViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasEnteredViewport, rootMargin]);

  return { containerRef, hasEnteredViewport };
};

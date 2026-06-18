import { useEffect, useState } from 'react';

const DESKTOP_QUERY = '(min-width: 1024px)';

function readVariant() {
  if (typeof window === 'undefined') return 'desktop';
  return window.matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile';
}

export function useViewport() {
  const [variant, setVariant] = useState(readVariant);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const handler = (e) => setVariant(e.matches ? 'desktop' : 'mobile');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return { variant, isMobile: variant === 'mobile', isDesktop: variant === 'desktop' };
}

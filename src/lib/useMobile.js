import { useEffect, useState } from 'react';

// Same breakpoint as the .stack-grid media query in index.css.
export const MOBILE_QUERY = '(max-width: 760px)';

export function useMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
}

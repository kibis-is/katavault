import { useCallback, useEffect, useState } from 'preact/hooks';

export default function useMediaQuery(query: string): boolean {
  // states
  const [matches, setMatches] = useState<boolean>(false);
  // handlers
  const handleOnMediaChange = useCallback(({ matches }: MediaQueryListEvent) => setMatches(matches), []);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    media.addEventListener('change', handleOnMediaChange);

    return () => media.removeEventListener('change', handleOnMediaChange);
  }, [query]);

  return matches;
}

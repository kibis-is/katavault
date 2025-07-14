import type { ChainWithNetworkParameters } from '@kibisis/chains';
import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { ChainsContext } from '@/ui/contexts';

export default function useChains(): ChainWithNetworkParameters[] {
  const { state, timestamp } = useContext(ChainsContext);
  const [chains, setChains] = useState<ChainWithNetworkParameters[]>(state ?? []);

  useEffect(() => {
    if (!state) {
      return;
    }

    (async () => {
      setChains(state);
    })();
  }, [timestamp]);

  return chains;
}

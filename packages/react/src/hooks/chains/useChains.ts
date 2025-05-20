import type { ChainWithNetworkParameters } from '@kibisis/chains';
import { useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the supported chains.
 * @returns {ChainWithNetworkParameters[]} The list of supported chains stored in the wallet.
 */
export default function useChains(): ChainWithNetworkParameters[] {
  const { katavault, timestamp } = useContext(KatavaultContext);
  const [chains, setChains] = useState<ChainWithNetworkParameters[]>([]);

  // on update, get the chains
  useEffect(() => {
    if (!katavault) {
      return;
    }

    setChains(katavault.chains());
  }, [timestamp]);

  return chains;
}

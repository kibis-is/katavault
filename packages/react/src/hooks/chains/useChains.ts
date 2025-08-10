import type { Chain } from '@kibisis/chains';
import { useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the supported chains.
 * @returns {Chain[]} The list of supported chains stored in the vault.
 */
export default function useChains(): Chain[] {
  const { katavault, timestamp } = useContext(KatavaultContext);
  const [chains, setChains] = useState<Chain[]>([]);

  // on update, get the chains
  useEffect(() => {
    if (!katavault) {
      return;
    }

    setChains(katavault.chains());
  }, [timestamp]);

  return chains;
}

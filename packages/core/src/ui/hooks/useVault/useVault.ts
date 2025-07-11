import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// types
import type { Vault } from '@/types';

export default function useVault(): Vault | null {
  const { state, timestamp } = useContext(AppContext);
  const [vault, setVault] = useState<Vault | null>(state?.vault ?? null);

  useEffect(() => {
    if (!state) {
      return;
    }

    setVault(state.vault);
  }, [timestamp]);

  return vault;
}

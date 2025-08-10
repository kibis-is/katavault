import type { Chain } from '@kibisis/chains';
import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { ChainsContext } from '@/ui/contexts';

// types
import type { Props } from './types';

const ChainsProvider: FunctionComponent<PropsWithChildren<Props>> = ({ chains, children }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<Chain[]>(chains);
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    setState(chains);
    onUpdate();
  }, [chains]);

  return (
    <ChainsContext.Provider
      value={{
        onUpdate,
        state,
        timestamp,
      }}
    >
      {children}
    </ChainsContext.Provider>
  );
};

export default ChainsProvider;

import { createKatavault, Katavault } from '@kibisis/katavault-core';
import { createElement, type FC, useCallback, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// types
import type { KatavaultProviderProps } from '@/types';

const KatavaultProvider: FC<KatavaultProviderProps> = ({ config, children }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [katavault, setKatavault] = useState<Katavault | null>(null);
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    (async () => {
      setKatavault(await createKatavault(config));
      setTimestamp(Date.now());
    })();
  }, [config]);

  return createElement(KatavaultContext.Provider, {
    value: {
      timestamp,
      onUpdate,
      katavault,
    },
  }, children);
};

export default KatavaultProvider;

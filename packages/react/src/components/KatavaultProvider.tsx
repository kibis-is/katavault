import { createWallet, Wallet } from '@kibisis/katavault-core';
import { createElement, type FC, useCallback, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// types
import type { KatavaultProviderProps } from '@/types';

const KatavaultProvider: FC<KatavaultProviderProps> = ({ config, children }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    (async () => {
      setWallet(await createWallet(config));
      setTimestamp(Date.now());
    })();
  }, [config]);

  return createElement(KatavaultContext.Provider, {
    value: {
      timestamp,
      onUpdate,
      wallet,
    },
  }, children);
};

export default KatavaultProvider;

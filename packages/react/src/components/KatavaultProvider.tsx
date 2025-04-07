import { createWallet, Wallet } from '@kibisis/katavault-core';
import { createElement, type FC, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// types
import type { KatavaultProviderProps } from '@/types';

const KatavaultProvider: FC<KatavaultProviderProps> = ({ config, children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    (async () => {
      setWallet(await createWallet(config));
    })();
  }, [config]);

  return createElement(KatavaultContext.Provider, {
    value: wallet,
  }, children);
};

export default KatavaultProvider;

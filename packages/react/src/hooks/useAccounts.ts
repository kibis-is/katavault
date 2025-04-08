import type { Account } from '@kibisis/katavault-core';
import { useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

export default function useAccounts(): Account[] {
  const wallet = useContext(KatavaultContext);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    (async () => {
      setAccounts(await wallet.accounts());
    })();
  }, [wallet]);

  return accounts;
}

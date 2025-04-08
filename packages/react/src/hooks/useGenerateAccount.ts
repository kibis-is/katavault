import { type Account, BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { WalletNotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

export default function useGenerateAccount(): HookFunction<string | undefined, Account, BaseError> {
  // contexts
  const wallet = useContext(KatavaultContext);

  return (params?, options?) => {
    if (!wallet) {
      return options?.onError?.(new WalletNotInitializedError('wallet not initialized'), params);
    }

    (async () => {
      try {
        const result = await wallet.generateAccount(params);

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

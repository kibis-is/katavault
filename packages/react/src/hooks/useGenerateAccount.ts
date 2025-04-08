import { type Account, BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { WalletNotInitializedError } from '@/errors';

// types
import type { HookFunctionWithOptionalParams } from '@/types';

/**
 * Hook to generate an account.
 * @returns {HookFunction<string, undefined, BaseError>} A function that can be used to generate a new account.
 */
export default function useGenerateAccount(): HookFunctionWithOptionalParams<string | undefined, Account, BaseError> {
  // contexts
  const { onUpdate, wallet } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!wallet) {
        return options?.onError?.(new WalletNotInitializedError('wallet not initialized'), params);
      }

      try {
        const result = await wallet.generateAccount(params);

        if (onUpdate) {
          onUpdate();
        }

        options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

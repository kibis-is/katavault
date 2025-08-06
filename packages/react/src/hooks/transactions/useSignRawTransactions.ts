import { BaseError, type SignRawTransactionParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import { HookFunction } from '@/types';

/**
 * Hook to sign an array of raw transactions using the appropriate account and chain.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunction<SignRawTransactionParameters[], (Uint8Array | null)[], BaseError>} A function that can be
 * used to sign an array of raw transactions using the appropriate account and chain.
 */
export default function useSendRawTransactions(): HookFunction<
  SignRawTransactionParameters[],
  (Uint8Array | null)[],
  BaseError
> {
  // contexts
  const { katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        const result = await katavault.signRawTransactions(params);

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

import { BaseError, type SendRawTransactionResult, type SignRawTransactionParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import { HookFunction } from '@/types';

/**
 * Hook to sign and send an array of raw transactions using the appropriate account and chain.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunction<SignRawTransactionParameters[], SendRawTransactionResult[], BaseError>} A function that can be
 * used to sign and send an array of raw transactions using the appropriate account and chain.
 */
export default function useSignAndSendRawTransactions(): HookFunction<
  SignRawTransactionParameters[],
  SendRawTransactionResult[],
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
        const result = await katavault.signAndSendRawTransactions(params);

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

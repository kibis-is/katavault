import { BaseError, type SendRawTransactionParameters, type SendRawTransactionResult } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import { HookFunction } from '@/types';

/**
 * Hook to send a list of raw transactions, and their signatures, to the specified chains.
 *
 * @returns {HookFunction<SendRawTransactionParameters[], SendRawTransactionResult[], BaseError>} A function that can be
 * used to send a list of raw transactions, and their signatures, to the specified chains.
 */
export default function useSendRawTransactions(): HookFunction<
  SendRawTransactionParameters[],
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
        const result = await katavault.sendRawTransactions(params);

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

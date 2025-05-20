import type { Chain, ChainWithNetworkParameters } from '@kibisis/chains';
import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to add a chain.
 * @returns {HookFunction<Chain, ChainWithNetworkParameters, BaseError>} A function that can be used to add a new chain.
 */
export default function useAddChain(): HookFunction<Chain, ChainWithNetworkParameters, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        const result = await katavault.addChain(params);

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

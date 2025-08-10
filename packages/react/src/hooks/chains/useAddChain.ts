import type { ChainConstructor } from '@kibisis/chains';
import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to add a chain to the vault.
 * @returns {HookFunction<ChainConstructor, undefined, BaseError>} A function that can be used to add a new chain.
 */
export default function useAddChain(): HookFunction<ChainConstructor, undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        await katavault.addChain(params);

        onUpdate?.();

        return options?.onSuccess?.(undefined, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to remove a chain by a genesis hash.
 * @returns {HookFunction<string, undefined, BaseError>} A function that can be used to remove a chain by its genesis hash.
 */
export default function useRemoveChainByGenesisHash(): HookFunction<string, undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        katavault.removeChainByGenesisHash(params);

        if (onUpdate) {
          onUpdate();
        }

        options?.onSuccess?.(undefined, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

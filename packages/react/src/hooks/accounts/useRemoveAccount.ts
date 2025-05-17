import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to remove an account.
 * @returns {HookFunction<string, undefined, BaseError>} A function that can be used to remove an account.
 */
export default function useRemoveAccount(): HookFunction<string, undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        await katavault.removeAccount(params);

        if (onUpdate) {
          onUpdate();
        }

        return options?.onSuccess?.(undefined, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

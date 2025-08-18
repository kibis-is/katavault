import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunctionWithoutParams } from '@/types';

/**
 * Hook to log the user out and close the vault.
 *
 * @returns {HookFunctionWithoutParams<undefined, BaseError>} A function that can be used to logout.
 */
export default function useLogout(): HookFunctionWithoutParams<undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), undefined);
      }

      try {
        katavault.logout();

        onUpdate?.();

        return options?.onSuccess?.(undefined, undefined);
      } catch (error) {
        return options?.onError?.(error, undefined);
      }
    })();
  };
}

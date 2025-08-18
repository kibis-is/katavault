import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunctionWithoutParams } from '@/types';

/**
 * Hook to open the vault application.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunctionWithoutParams<undefined, BaseError>} A function that can be used to open the vault UI.
 */
export default function useOpenVault(): HookFunctionWithoutParams<undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (options?) => {
    if (!katavault) {
      return options?.onError?.(new NotInitializedError('katavault not initialized'), undefined);
    }

    try {
      katavault.openVault();

      onUpdate?.();

      return options?.onSuccess?.(undefined, undefined);
    } catch (error) {
      return options?.onError?.(error, undefined);
    }
  };
}

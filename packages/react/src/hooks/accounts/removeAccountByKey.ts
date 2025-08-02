import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to remove an account by the account key.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunction<string, undefined, BaseError>} A function that can be used to remove an account by the account
 * key.
 */
export default function removeAccountByKey(): HookFunction<string, undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        await katavault.removeAccountByKey(params);

        onUpdate?.();

        return options?.onSuccess?.(undefined, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunctionWithoutParams } from '@/types';

/**
 * Hook to perform a "factory reset". This will remove the authentication credentials and all account data.
 *
 * 🚨 **WARNING:** Use with extreme caution. This is action is irreversible.
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunctionWithoutParams<undefined, BaseError>} A function that can be used to reset Katavault.
 */
export default function useClearVault(): HookFunctionWithoutParams<undefined, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), undefined);
      }

      try {
        await katavault.clear();

        onUpdate?.();

        return options?.onSuccess?.(undefined, undefined);
      } catch (error) {
        return options?.onError?.(error, undefined);
      }
    })();
  };
}

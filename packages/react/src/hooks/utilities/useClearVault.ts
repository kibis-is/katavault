import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunctionWithoutParams } from '@/types';

/**
 * Hook to perform a "factory reset". This will remove authentication credentials, settings and all account data.
 *
 * ⚠️ **NOTE:** Requires authentication.
 *
 * 🚨 **WARNING:** Use with extreme caution. This is action is irreversible.
 *
 * @returns {HookFunctionWithoutParams<undefined, BaseError>} A function that can be used to clear Katavault.
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
        await katavault.clearVault();

        onUpdate?.();

        return options?.onSuccess?.(undefined, undefined);
      } catch (error) {
        return options?.onError?.(error, undefined);
      }
    })();
  };
}

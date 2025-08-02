import { BaseError, type SignMessageParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to sign a message or some arbitrary bytes using the appropriate account and chain.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunction<SignMessageParameters, string | Uint8Array, BaseError>} A function that can be used to sign a
 * message or some arbitrary bytes using the appropriate account and chain.
 */
export default function useSignMessage(): HookFunction<SignMessageParameters, string | Uint8Array, BaseError> {
  // contexts
  const { katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        const result = await katavault.signMessage(params);

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

import { BaseError, type SignMessageParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { WalletNotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to sign a message.
 * @returns {HookFunction<SignMessageParameters, string | Uint8Array, BaseError>} A function that can be used to remove an account.
 */
export default function useSignMessage(): HookFunction<SignMessageParameters, string | Uint8Array, BaseError> {
  // contexts
  const { katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new WalletNotInitializedError('wallet not initialized'), params);
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

import { type Account, BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunctionWithOptionalParams } from '@/types';

/**
 * Hook to generate a credential account.
 * @returns {HookFunctionWithOptionalParams<string | undefined, Account, BaseError>} A function that can be used to
 * generate the credential account.
 */
export default function useGenerateCredentialAccount(): HookFunctionWithOptionalParams<
  string | undefined,
  Account,
  BaseError
> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        const result = await katavault.generateCredentialAccount(params);

        if (onUpdate) {
          onUpdate();
        }

        options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

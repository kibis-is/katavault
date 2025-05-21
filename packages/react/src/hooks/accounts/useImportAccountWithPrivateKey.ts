import { type Account, BaseError, type ImportAccountWithPrivateKeyParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to import an account with a private key.
 * @returns {HookFunction<ImportAccountWithPrivateKeyParameters, Account, BaseError>} A function that can be used to
 * import the new account.
 */
export default function useImportAccountWithPrivateKey(): HookFunction<
  ImportAccountWithPrivateKeyParameters,
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
        const result = await katavault.importAccountFromPrivateKey(params);

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

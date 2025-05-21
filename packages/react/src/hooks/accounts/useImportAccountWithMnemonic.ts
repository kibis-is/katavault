import { type Account, BaseError, type ImportAccountWithMnemonicParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to import an account with a 25-word mnemonic seed phrase.
 * @returns {HookFunction<ImportAccountWithMnemonicParameters, Account, BaseError>} A function that can be used to
 * import the new account.
 */
export default function useImportAccountWithMnemonic(): HookFunction<
  ImportAccountWithMnemonicParameters,
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
        const result = await katavault.importAccountFromMnemonic(params);

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

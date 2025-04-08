import { BaseError } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { WalletNotInitializedError } from '@/errors';

// types
import type { HookFunctionWithoutParams } from '@/types';

/**
 * Hook to perform a "factory reset". This will remove the passkey credentials and all accounts.
 *
 * 🚨 **WARNING:** Use with extreme caution. This is action is irreversible.
 * @returns {HookFunction<string, undefined, BaseError>} A function that can be used to reset Katavault.
 */
export default function useClear(): HookFunctionWithoutParams<undefined, BaseError> {
  // contexts
  const { onUpdate, wallet } = useContext(KatavaultContext);

  return (options?) => {
    (async () => {
      if (!wallet) {
        return options?.onError?.(new WalletNotInitializedError('wallet not initialized'), undefined);
      }

      try {
        await wallet.clear();

        if (onUpdate) {
          onUpdate();
        }

        return options?.onSuccess?.(undefined, undefined);
      } catch (error) {
        return options?.onError?.(error, undefined);
      }
    })();
  };
}

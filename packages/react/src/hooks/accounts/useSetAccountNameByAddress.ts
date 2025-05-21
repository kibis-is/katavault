import { type Account, BaseError, type SetAccountNameByAddressParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to set the name for an account by its address.
 * @returns {HookFunction<SetAccountNameByAddressParameters, Account, BaseError>} A function that can be used to set
 * the name for an account by its address.
 */
export default function useSetAccountNameByAddress(): HookFunction<
  SetAccountNameByAddressParameters,
  Account,
  BaseError
> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      let result: Account;

      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        result = await katavault.setAccountNameByAddress(params);

        if (onUpdate) {
          onUpdate();
        }

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

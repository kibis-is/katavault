import { type Account, BaseError, type SetAccountNameByKeyParameters } from '@kibisis/katavault-core';
import { useContext } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction } from '@/types';

/**
 * Hook to set the name for an account by its key.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {HookFunction<SetAccountNameByKeyParameters, Account, BaseError>} A function that can be used to set the
 * name for an account by its key.
 */
export default function setAccountNameByKey(): HookFunction<SetAccountNameByKeyParameters, Account, BaseError> {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);

  return (params, options?) => {
    (async () => {
      let result: Account;

      if (!katavault) {
        return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
      }

      try {
        result = await katavault.setAccountNameByKey(params);

        onUpdate?.();

        return options?.onSuccess?.(result, params);
      } catch (error) {
        return options?.onError?.(error, params);
      }
    })();
  };
}

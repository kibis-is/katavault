import { type ListenerTypes } from '@kibisis/katavault-core';
import { createLogger } from '@kibisis/utilities';
import { useContext, useMemo } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

/**
 * Hook that returns a function that can be used to add a listener.
 *
 * @returns {(type: ListenerTypes, callback: (() => Promise<void> | void)) => string} A function that can be used to
 * add a listener.
 */
export default function useAddListener(): (type: ListenerTypes, callback: () => Promise<void> | void) => string {
  // contexts
  const { katavault } = useContext(KatavaultContext);
  const logger = useMemo(() => createLogger('error'), []);

  return (
    katavault?.addListener ??
    (() => {
      const _error = 'katavault not initialized';

      logger.error(`useAddListener - ${_error}`);

      throw new NotInitializedError(_error);
    })
  );
}

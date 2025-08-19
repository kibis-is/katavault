import { createLogger } from '@kibisis/utilities';
import { useContext, useMemo } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

/**
 * Hook that returns a function that can be used to remove all listeners.
 *
 * @returns {() => void} A function that can be used to remove all listeners.
 */
export default function useRemoveListener(): () => void {
  // contexts
  const { katavault } = useContext(KatavaultContext);
  const logger = useMemo(() => createLogger('error'), []);

  return (
    katavault?.removeAllListeners ??
    (() => {
      const _error = 'katavault not initialized';

      logger.error(`useAddListener - ${_error}`);

      throw new NotInitializedError(_error);
    })
  );
}

import { createLogger } from '@kibisis/utilities';
import { useContext, useMemo } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

/**
 * Hook that returns a function that can be used to remove a listener by the supplied ID.
 *
 * @returns {(id: string) => boolean} A function that can be used to remove a listener by the supplied ID.
 */
export default function useRemoveListener(): (id: string) => boolean {
  // contexts
  const { katavault } = useContext(KatavaultContext);
  const logger = useMemo(() => createLogger('error'), []);

  return (
    katavault?.removeListener ??
    (() => {
      const _error = 'katavault not initialized';

      logger.error(`useAddListener - ${_error}`);

      throw new NotInitializedError(_error);
    })
  );
}

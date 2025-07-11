import type { ILogger } from '@kibisis/utilities';
import { Katavault } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onResetButtonClick(katavault: Katavault, logger: ILogger) {
  const __logPrefix = 'onResetButtonClick';

  return async () => {
    try {
      await katavault.clear();
      await updateAccountsTable(katavault, logger);
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
    }
  };
}

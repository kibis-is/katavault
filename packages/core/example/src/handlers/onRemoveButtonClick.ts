import type { ILogger } from '@kibisis/utilities';
import { Katavault } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onRemoveButtonClick(address: string, katavault: Katavault, logger: ILogger) {
  return async () => {
    const __logPrefix = 'onRemoveButtonClick';

    try {
      await katavault.removeAccount(address);
      await updateAccountsTable(katavault, logger);
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
    }
  };
}

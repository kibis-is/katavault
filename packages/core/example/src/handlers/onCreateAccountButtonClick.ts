import type { ILogger } from '@kibisis/utilities';
import { Katavault } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onCreateAccountButtonClick(katavault: Katavault, logger: ILogger) {
  return async () => {
    const __logPrefix = 'onCreateAccountButtonClick';

    try {
      const account = await katavault.generateAccount();

      logger.debug(`${__logPrefix}: created new account "${account.address}"`);

      await updateAccountsTable(katavault, logger);
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
    }
  };
}

import { Katavault, type Logger } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onResetButtonClick(katavault: Katavault, logger: Logger) {
  return async () => {
    await katavault.clear();
    await updateAccountsTable(katavault, logger);
  };
}

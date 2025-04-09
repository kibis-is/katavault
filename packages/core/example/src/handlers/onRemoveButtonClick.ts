import { Katavault, type Logger } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onRemoveButtonClick(address: string, katavault: Katavault, logger: Logger) {
  return async () => {
    await katavault.removeAccount(address);
    await updateAccountsTable(katavault, logger);
  };
}

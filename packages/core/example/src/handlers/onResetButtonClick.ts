import { type Logger, Wallet } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onResetButtonClick(wallet: Wallet, logger: Logger) {
  return async () => {
    await wallet.clear();
    await updateAccountsTable(wallet, logger);
  };
}

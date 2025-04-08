import { type Logger, Wallet } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onRemoveButtonClick(address: string, wallet: Wallet, logger: Logger) {
  return async () => {
    await wallet.removeAccount(address);
    await updateAccountsTable(wallet, logger);
  };
}

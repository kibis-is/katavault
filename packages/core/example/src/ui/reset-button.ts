import { EmbeddedWallet, type Logger } from '@kibisis/embedded-wallet-sdk';

// components
import { updateAccountsTable } from './accounts-table';

export function onResetButtonClick(wallet: EmbeddedWallet, logger: Logger) {
  return async () => {
    await wallet.clear();
    await updateAccountsTable(wallet, logger);
  };
}

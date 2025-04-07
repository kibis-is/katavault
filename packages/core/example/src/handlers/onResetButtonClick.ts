import { EmbeddedWallet, type Logger } from '@kibisis/embedded-wallet-sdk';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onResetButtonClick(wallet: EmbeddedWallet, logger: Logger) {
  return async () => {
    await wallet.clear();
    await updateAccountsTable(wallet, logger);
  };
}

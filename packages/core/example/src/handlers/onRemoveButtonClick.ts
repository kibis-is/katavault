import { EmbeddedWallet, type Logger } from '@kibisis/embedded-wallet-sdk';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onRemoveButtonClick(address: string, wallet: EmbeddedWallet, logger: Logger) {
  return async () => {
    await wallet.removeAccount(address);
    await updateAccountsTable(wallet, logger);
  };
}

import { EmbeddedWallet, type Logger } from '@kibisis/embedded-wallet-sdk';

// components
import { updateAccountsTable } from './accounts-table';

export function onCreateAccountButtonClick(wallet: EmbeddedWallet, logger: Logger) {
  return async () => {
    const __logPrefix = 'onCreateAccountButtonClick';
    const account = await wallet.generateAccount();

    logger.debug(`${__logPrefix}: created new account "${account.address}"`);

    await updateAccountsTable(wallet, logger);
  };
}

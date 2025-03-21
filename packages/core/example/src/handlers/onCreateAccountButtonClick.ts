import { EmbeddedWallet, type Logger } from '@kibisis/embedded-wallet-sdk';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onCreateAccountButtonClick(wallet: EmbeddedWallet, logger: Logger) {
  return async () => {
    const __logPrefix = 'onCreateAccountButtonClick';
    const account = await wallet.generateAccount();

    logger.debug(`${__logPrefix}: created new account "${account.address}"`);

    await updateAccountsTable(wallet, logger);
  };
}

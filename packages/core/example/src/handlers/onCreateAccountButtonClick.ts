import {
  BaseError,
  EmbeddedWallet,
  type Logger,
  USER_CANCELED_PASSKEY_REQUEST_ERROR,
} from '@kibisis/embedded-wallet-sdk';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onCreateAccountButtonClick(wallet: EmbeddedWallet, logger: Logger) {
  return async () => {
    const __logPrefix = 'onCreateAccountButtonClick';
    try {
      const account = await wallet.generateAccount();

      logger.debug(`${__logPrefix}: created new account "${account.address}"`);

      await updateAccountsTable(wallet, logger);
    } catch (error) {
      if ((error as BaseError).isEmbeddedWalletError) {
        switch ((error as BaseError).type) {
          case USER_CANCELED_PASSKEY_REQUEST_ERROR:
            logger.debug(`${__logPrefix}: user canceled passkey request`);
            break;
          default:
            break;
        }
      }
    }
  };
}

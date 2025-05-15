import { BaseError, Katavault, type Logger, USER_CANCELED_PASSKEY_REQUEST_ERROR } from '@kibisis/katavault-core';

// utilities
import { updateAccountsTable } from '../utilities';

export default function onAuthenticateWithPasskeyButtonClick(katavault: Katavault, logger: Logger) {
  return async () => {
    const __logPrefix = 'onAuthenticateWithPasskeyButtonClick';

    try {
      await katavault.authenticateWithPasskey({
        user: {
          displayName: `Kieran O'Neill`,
          username: `magnetartare`,
        },
      });

      await updateAccountsTable(katavault, logger);
    } catch (error) {
      if ((error as BaseError).isKatavaultError) {
        switch ((error as BaseError).type) {
          case USER_CANCELED_PASSKEY_REQUEST_ERROR:
            logger.debug(`${__logPrefix}: user canceled passkey request`);

            return;
          default:
            break;
        }
      }

      logger.error(`${__logPrefix}:`, error);
    }
  };
}

import type { ILogger } from '@kibisis/utilities';
import { BaseError, Katavault, USER_CANCELED_UI_REQUEST_ERROR } from '@kibisis/katavault-core';

// handlers
import onOpenWalletButtonClick from './onOpenWalletButtonClick';

export default function onAuthenticateViaUIButtonClick(katavault: Katavault, logger: ILogger) {
  return async () => {
    const __logPrefix = 'onAuthenticateViaUIButtonClick';
    let activateButtonElement: HTMLElement | null;

    try {
      await katavault.authenticate();

      activateButtonElement = document.getElementById('activateButton');

      if (activateButtonElement) {
        activateButtonElement.onclick = onOpenWalletButtonClick(katavault, logger);
        activateButtonElement.replaceChildren('Open Wallet');
      }
    } catch (error) {
      if ((error as BaseError).isKatavaultError) {
        switch ((error as BaseError).type) {
          case USER_CANCELED_UI_REQUEST_ERROR:
            logger.debug(`${__logPrefix}: user canceled ui request`);

            return;
          default:
            break;
        }
      }

      logger.error(`${__logPrefix}:`, error);
    }
  };
}

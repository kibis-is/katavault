import type { ILogger } from '@kibisis/utilities';
import { Katavault } from '@kibisis/katavault-core';

// handlers
import onAuthenticateViaUIButtonClick from './onAuthenticateViaUIButtonClick';

export default function onClearButtonClick(katavault: Katavault, logger: ILogger) {
  const __logPrefix = 'onClearButtonClick';
  let activateButtonElement: HTMLElement | null;

  return async () => {
    try {
      await katavault.clear();

      activateButtonElement = document.getElementById('activateButton');

      if (activateButtonElement) {
        activateButtonElement.onclick = onAuthenticateViaUIButtonClick(katavault, logger);
        activateButtonElement.replaceChildren('Authenticate');
      }
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
    }
  };
}

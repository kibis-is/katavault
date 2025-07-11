import { createLogger } from '@kibisis/utilities';
import { createKatavault, Katavault } from '@kibisis/katavault-core';

// config
import config from './config';

// handlers
import {
  onAuthenticateViaUIButtonClick,
  onAuthenticateWithPasskeyButtonClick,
  onCreateAccountButtonClick,
  onResetButtonClick,
} from './handlers';

async function onDOMContentLoaded() {
  const authenticateViaUIButtonElement = document.getElementById('authenticateViaUIButton');
  const authenticateWithPasskeyButtonElement = document.getElementById('authenticateWithPasskeyButton');
  const createAccountButtonElement = document.getElementById('createAccountButton');
  const resetButtonElement = document.getElementById('resetButton');
  const logger = createLogger('debug');
  let katavault: Katavault;

  try {
    katavault = await createKatavault(config);

    if (authenticateViaUIButtonElement) {
      authenticateViaUIButtonElement.addEventListener('click', onAuthenticateViaUIButtonClick(katavault, logger));
    }

    if (authenticateWithPasskeyButtonElement) {
      authenticateWithPasskeyButtonElement.addEventListener(
        'click',
        onAuthenticateWithPasskeyButtonClick(katavault, logger)
      );
    }

    if (createAccountButtonElement) {
      createAccountButtonElement.addEventListener('click', onCreateAccountButtonClick(katavault, logger));
    }

    if (resetButtonElement) {
      resetButtonElement.addEventListener('click', onResetButtonClick(katavault, logger));
    }
  } catch (error) {
    logger.error(error);
  }
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

import { createKatavault, createLogger, Katavault } from '@kibisis/katavault-core';

// config
import config from './config';

// handlers
import { onAuthenticateWithPasskeyButtonClick, onCreateAccountButtonClick, onResetButtonClick } from './handlers';

async function onDOMContentLoaded() {
  const authenticateWithPasskeyButtonElement = document.getElementById('authenticateWithPasskeyButton');
  const createAccountButtonElement = document.getElementById('createAccountButton');
  const resetButtonElement = document.getElementById('resetButton');
  const logger = createLogger('debug');
  let katavault: Katavault;

  try {
    katavault = await createKatavault(config);

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

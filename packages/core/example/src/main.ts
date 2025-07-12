import { createLogger } from '@kibisis/utilities';
import { createKatavault, Katavault } from '@kibisis/katavault-core';

// config
import config from './config';

// handlers
import { onAuthenticateViaUIButtonClick, onClearButtonClick } from './handlers';

async function onDOMContentLoaded() {
  const activateButtonElement = document.getElementById('activateButton');
  const clearButtonElement = document.getElementById('clearButton');
  const logger = createLogger('debug');
  let katavault: Katavault;

  try {
    katavault = await createKatavault(config);

    if (activateButtonElement) {
      activateButtonElement.onclick = onAuthenticateViaUIButtonClick(katavault, logger);
    }

    if (clearButtonElement) {
      clearButtonElement.addEventListener('click', onClearButtonClick(katavault, logger));
    }
  } catch (error) {
    logger.error(error);
  }
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

import { createKatavault, createLogger, Katavault } from '@kibisis/katavault-core';

// config
import config from './config';

// handlers
import { onCreateAccountButtonClick, onResetButtonClick } from './handlers';

// utilities
import { updateAccountsTable } from './utilities';

async function onDOMContentLoaded() {
  const createAccountButtonElement = document.getElementById('createAccountButton');
  const resetButtonElement = document.getElementById('resetButton');
  const logger = createLogger('debug');
  let katavault: Katavault;

  try {
    katavault = await createKatavault(config);

    if (createAccountButtonElement) {
      createAccountButtonElement.addEventListener('click', onCreateAccountButtonClick(katavault, logger));
    }

    if (resetButtonElement) {
      resetButtonElement.addEventListener('click', onResetButtonClick(katavault, logger));
    }

    // fetch the accounts and update the table
    await updateAccountsTable(katavault, logger);
  } catch (error) {
    logger.error(error);
  }
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

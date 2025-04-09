import { createKatavault, createLogger } from '@kibisis/katavault-core';

// handlers
import { onCreateAccountButtonClick, onResetButtonClick } from './handlers';

// utilities
import { updateAccountsTable } from './utilities';

async function onDOMContentLoaded() {
  const createAccountButtonElement = document.getElementById('createAccountButton');
  const logger = createLogger('debug');
  const katavault = await createKatavault({
    debug: true,
    user: {
      displayName: `Kieran O'Neill`,
      username: `magnetartare`,
    },
  });
  const resetButtonElement = document.getElementById('resetButton');

  if (createAccountButtonElement) {
    createAccountButtonElement.addEventListener('click', onCreateAccountButtonClick(katavault, logger));
  }

  if (resetButtonElement) {
    resetButtonElement.addEventListener('click', onResetButtonClick(katavault, logger));
  }

  // fetch the accounts and update the table
  await updateAccountsTable(katavault, logger);
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

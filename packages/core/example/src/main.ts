import { createLogger, createEmbeddedWallet } from '@kibisis/embedded-wallet-sdk';

// handlers
import { onCreateAccountButtonClick, onResetButtonClick } from './handlers';

// utilities
import { updateAccountsTable } from './utilities';

async function onDOMContentLoaded() {
  const createAccountButtonElement = document.getElementById('createAccountButton');
  const logger = createLogger('debug');
  const wallet = await createEmbeddedWallet({
    debug: true,
    user: {
      displayName: `Kieran O'Neill`,
      username: `magnetartare`,
    },
  });
  const removeButtonElement = document.getElementById('removeButton');
  const resetButtonElement = document.getElementById('resetButton');

  if (createAccountButtonElement) {
    createAccountButtonElement.addEventListener('click', onCreateAccountButtonClick(wallet, logger));
  }

  if (resetButtonElement) {
    resetButtonElement.addEventListener('click', onResetButtonClick(wallet, logger));
  }

  // fetch the accounts and update the table
  await updateAccountsTable(wallet, logger);
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

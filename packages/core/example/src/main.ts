import { createLogger, createEmbeddedWallet } from '@kibisis/embedded-wallet-sdk';

// components
import { updateAccountsTable } from './ui/accounts-table';
import { onCreateAccountButtonClick } from './ui/create-account-button';
import { onResetButtonClick } from './ui/reset-button';

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
  const resetButtonElement = document.getElementById('resetButton');

  if (!createAccountButtonElement) {
    throw new Error('create account button is missing');
  }

  if (!resetButtonElement) {
    throw new Error('reset button is missing');
  }

  // add button handlers
  createAccountButtonElement.onclick = onCreateAccountButtonClick(wallet, logger);
  resetButtonElement.onclick = onResetButtonClick(wallet, logger);

  // fetch the accounts and update the table
  await updateAccountsTable(wallet, logger);
}

window.addEventListener('DOMContentLoaded', onDOMContentLoaded);

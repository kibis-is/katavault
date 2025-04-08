import { type Account, Wallet, type Logger } from '@kibisis/katavault-core';

// handlers
import { onRemoveButtonClick } from '../handlers';

export default async function updateAccountsTable(wallet: Wallet, logger: Logger) {
  const __logPrefix = 'updateAccountsTable';
  const containerElement = document.getElementById('accountsTable');
  let accounts: Account[];

  if (!containerElement) {
    logger.debug(`${__logPrefix}: no accounts table container element found`);

    return;
  }

  accounts = await wallet.accounts();

  containerElement.innerHTML = `
<table>
  <thead>
    <tr>
      <th>Account</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    ${accounts.map(
      ({ address }: Account) => `
    <tr>
      <td>${address}</td>
      <td>
        <button class="remove-button button--sm">Remove</button>
      </td>
    </tr>
    `
    )}
  </tbody>
</table>
  `;

  // add click listeners to the buttons
  Array.from(document.getElementsByClassName('remove-button')).forEach((element, index) =>
    element.addEventListener('click', onRemoveButtonClick(accounts[index].address, wallet, logger))
  );
}

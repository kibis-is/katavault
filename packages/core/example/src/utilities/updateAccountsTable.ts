import { type Account, AccountTypeEnum, Katavault } from '@kibisis/katavault-core';
import type { ILogger } from '@kibisis/utilities';

// handlers
// import { onRemoveButtonClick } from '../handlers';

export default async function updateAccountsTable(katavault: Katavault, logger: ILogger) {
  const __logPrefix = 'updateAccountsTable';
  const containerElement = document.getElementById('accountsTable');
  let accounts: Account[];

  if (!containerElement) {
    logger.debug(`${__logPrefix}: no accounts table container element found`);

    return;
  }

  accounts = await katavault.accounts();

  containerElement.innerHTML = `
<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Public key (base58)</th>
      <th>Name</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    ${accounts.map(
      ({ __type, key, name }: Account) => `
    <tr>
      <td>${__type}</td>
      <td>${key}</td>
      <td>${name ? name : '-'}</td>
      <td>
        ${__type === AccountTypeEnum.Connected ? '<button class="remove-button button--sm">Remove</button>' : '-'}
      </td>
    </tr>
    `
    )}
  </tbody>
</table>
  `;

  // add click listeners to the buttons
  // Array.from(document.getElementsByClassName('remove-button')).forEach((element, index) =>
  //   element.addEventListener('click', onRemoveButtonClick(accounts[index].address, katavault, logger))
  // );
}

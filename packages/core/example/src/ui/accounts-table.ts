import { type Account, EmbeddedWallet, type Logger } from '@kibisis/embedded-wallet-sdk';

export async function updateAccountsTable(wallet: EmbeddedWallet, logger: Logger) {
  const __logPrefix = 'onCreateAccountButtonClick';
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
      <th>Name</th>
    </tr>
  </thead>

  <tbody>
    ${accounts.map(
      ({ address, name }: Account) => `
    <tr>
      <td>${address}</td>
      <td>${name ? name : '-'}</td>
    </tr>
    `
    )}
  </tbody>
</table>
  `;
}

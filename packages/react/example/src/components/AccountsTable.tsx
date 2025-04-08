import { type Account } from '@kibisis/katavault-core';
import { useAccounts, useClear, useGenerateAccount, useRemoveAccount } from '@kibisis/katavault-react';
import { type FC } from 'react';

const AccountsTable: FC = () => {
  // hooks
  const accounts = useAccounts();
  const clear = useClear();
  const generateAccount = useGenerateAccount();
  const removeAccount = useRemoveAccount();
  // handlers
  const handleCreateAccountClick = () => {
    generateAccount();
  };
  const handleRemoveClick = (address: string) => () => {
    removeAccount(address);
  };
  const handleResetClick = () => {
    clear();
  };

  return (
    <>
      <div className="actions-container">
        <button onClick={handleCreateAccountClick}>Create Account</button>
        <button onClick={handleResetClick}>Reset</button>
      </div>

      <div className="accounts-table-container">
        <table>
          <thead>
          <tr>
            <th>Account</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
            {accounts.map(
              ({ address }: Account) => (
                <tr key={`account__${address}`}>
                  <td>{address}</td>
                  <td>
                    <button className="remove-button button--sm" onClick={handleRemoveClick(address)}>Remove</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AccountsTable;

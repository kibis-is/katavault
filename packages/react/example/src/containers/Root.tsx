import { type Account } from '@kibisis/katavault-core';
import { useAccounts, useClear, useGenerateAccount, useRemoveAccount } from '@kibisis/katavault-react';
import { type FC, useState } from 'react';

// components
import SignMessageModal from '../components/SignMessageModal';

const Root: FC = () => {
  // hooks
  const accounts = useAccounts();
  const clear = useClear();
  const generateAccount = useGenerateAccount();
  const removeAccount = useRemoveAccount();
  // states
  const [isSignMessageModalOpen, setIsSignMessageModalOpen] = useState<boolean>(false);
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
      {/*sign message modal*/}
      <SignMessageModal isOpen={isSignMessageModalOpen} onClose={() => setIsSignMessageModalOpen(false)} />

      {/*header*/}
      <header>
        <div className="title__container">
          <h2>Katavault</h2>
          <h3>React Example</h3>
        </div>
      </header>

      <main>
        {/*actions*/}
        <div className="actions__container">
          <button onClick={handleCreateAccountClick}>Create Account</button>
          <button onClick={() => setIsSignMessageModalOpen(true)}>Sign Message</button>
          <button onClick={handleResetClick}>Reset</button>
        </div>

        {/*accounts table*/}
        <div className="accounts-table__container">
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
                    <button className="button--sm" onClick={handleRemoveClick(address)}>Remove</button>
                  </td>
                </tr>
              )
            )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Root;

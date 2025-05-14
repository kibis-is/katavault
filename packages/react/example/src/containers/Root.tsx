import { type Account, createLogger, type Logger, type UserInformation } from '@kibisis/katavault-core';
import { useAccounts, useAuthenticate, useClear, useGenerateAccount, useRemoveAccount } from '@kibisis/katavault-react';
import { type FC, useCallback, useMemo, useState } from 'react';

// components
import SignMessageModal from '../components/SignMessageModal';

const Root: FC = () => {
  // hooks
  const accounts = useAccounts();
  const {
    authenticateWithPasskey,
    authenticateWithPassword,
    isAuthenticated,
  } = useAuthenticate();
  const clear = useClear();
  const generateAccount = useGenerateAccount();
  const removeAccount = useRemoveAccount();
  // memos
  const logger = useMemo<Logger>(() => createLogger('debug'), []);
  const user = useMemo<UserInformation>(() => ({
    displayName: `Kieran O'Neill`,
    username: `magnetartare`,
  }), []);
  // states
  const [isSignMessageModalOpen, setIsSignMessageModalOpen] = useState<boolean>(false);
  // callbacks
  const handleOnAuthenticateWithPasskeyClick = useCallback(() => authenticateWithPasskey({
    user,
  }, {
    onError: (error) => logger.error(`${Root.displayName}#handleAuthenticateWithPasskeyClick:`, error),
    onSuccess: () => logger.success(`${Root.displayName}#handleAuthenticateWithPasskeyClick: successfully logged in using passkey!`),
  }), [authenticateWithPasskey, logger, user]);
  const handleOnAuthenticateWithPasswordClick = useCallback(() => logger.info('password auth!'), [authenticateWithPassword, logger, user]);
  const handleOnGenerateAccountClick = useCallback(() => generateAccount(undefined, {
    onError: (error) => logger.error(`${Root.displayName}#handleCreateAccountClick:`, error),
  }), [generateAccount]);
  const handleOnRemoveClick = useCallback((address: string) => () => removeAccount(address, {
    onError: (error) => logger.error(`${Root.displayName}#handleRemoveClick:`, error),
  }), [removeAccount]);
  const handleOnResetClick = useCallback(() => clear({
    onError: (error) => logger.error(`${Root.displayName}#handleResetClick:`, error),
  }), [clear]);
  const handleOnSignMessageClick = useCallback(() => setIsSignMessageModalOpen(true), [setIsSignMessageModalOpen]);
  const handleOnSignMessageModalClose = useCallback(() => setIsSignMessageModalOpen(false), [setIsSignMessageModalOpen]);

  return (
    <>
      {/*sign message modal*/}
      <SignMessageModal
        isOpen={isSignMessageModalOpen}
        logger={logger}
        onClose={handleOnSignMessageModalClose}
      />

      {/*header*/}
      <header>
        <div className="title__container">
          <h2>Katavault</h2>
          <h3>React Example</h3>
        </div>
      </header>

      <main>
        <div className="actions__container">
          <button onClick={handleOnAuthenticateWithPasskeyClick}>Passkey Authentication</button>
          <button onClick={handleOnAuthenticateWithPasswordClick}>Password Authentication</button>
        </div>

        {/*actions*/}
        <div className="actions__container">
          <button disabled={!isAuthenticated} onClick={handleOnGenerateAccountClick}>Generate Account</button>
          <button disabled={!isAuthenticated} onClick={handleOnSignMessageClick}>Sign Message</button>
          <button disabled={!isAuthenticated} onClick={handleOnResetClick}>Reset</button>
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
                    <button className="button--sm" onClick={handleOnRemoveClick(address)}>Remove</button>
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

Root.displayName = 'Root';

export default Root;

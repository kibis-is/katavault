import { CreateWalletParameters } from '@kibisis/katavault-core';
import { KatavaultProvider } from '@kibisis/katavault-react';
import { type FC } from 'react';

// components
import AccountsTable from '../../components/AccountsTable';

const App: FC = () => {
  const config: CreateWalletParameters = {
    debug: true,
    user: {
      displayName: `Kieran O'Neill`,
      username: `magnetartare`,
    },
  };

  return (
    <KatavaultProvider config={config}>
      <header>
        <div className="title-container">
          <h2>Katavault</h2>
          <h3>React Example</h3>
        </div>
      </header>


      <main>
        <AccountsTable />
      </main>
    </KatavaultProvider>
  );
};

export default App;

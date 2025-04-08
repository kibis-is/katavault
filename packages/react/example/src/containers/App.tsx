import { CreateWalletParameters } from '@kibisis/katavault-core';
import { KatavaultProvider } from '@kibisis/katavault-react';
import { type FC } from 'react';

// containers
import Root from './Root';

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
      <Root />
    </KatavaultProvider>
  );
};

export default App;

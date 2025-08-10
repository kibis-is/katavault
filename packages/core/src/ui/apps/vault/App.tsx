import type { FunctionComponent } from 'preact';

// containers
import Root from './Root';

// decorators
import { AccountStore, SettingsStore } from '@/decorators';

// providers
import AccountsProvider from '@/ui/providers/AccountsProvider';
import AppProvider from '@/ui/providers/AppProvider';
import ChainsProvider from '@/ui/providers/ChainsProvider';
import ConnectorsProvider from '@/ui/providers/ConnectorsProvider';
import SettingsProvider from '@/ui/providers/SettingsProvider';

// types
import type { BaseAppProps } from '@/ui/types';
import type { AppProps } from './types';

const App: FunctionComponent<BaseAppProps & AppProps> = ({ chains, clientInformation, debug, i18n, logger, ...rootProps }) => {
  return (
    <AppProvider
      clientInformation={clientInformation}
      i18n={i18n}
      logger={logger}
    >
      <SettingsProvider
        settingsStore={new SettingsStore({
          logger,
          vault: rootProps.vault,
        })}
      >
        <AccountsProvider accountsStore={new AccountStore({
          logger,
          vault: rootProps.vault,
        })}>
          <ChainsProvider chains={chains}>
            <ConnectorsProvider chains={chains} debug={debug}>
              <Root {...rootProps} />
            </ConnectorsProvider>
          </ChainsProvider>
        </AccountsProvider>
      </SettingsProvider>
    </AppProvider>
  );
};

export default App;

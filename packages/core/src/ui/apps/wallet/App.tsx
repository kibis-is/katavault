import type { FunctionComponent } from 'preact';

// containers
import Root from './Root';

// decorators
import { SettingsStore } from '@/decorators';

// providers
import AppProvider from '@/ui/providers/AppProvider';
import SettingsProvider from '@/ui/providers/SettingsProvider';

// types
import type { BaseAppProps } from '@/ui/types';
import type { AppProps } from './types';

const App: FunctionComponent<BaseAppProps & AppProps> = ({ clientInformation, i18n, logger, ...rootProps }) => {
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
        <Root {...rootProps} />
      </SettingsProvider>
    </AppProvider>
  );
};

export default App;

import type { FunctionComponent } from 'preact';

// containers
import Root from './Root';

// providers
import AppProvider from '@/ui/providers/AppProvider';

// types
import type { BaseAppProps } from '@/ui/types';
import type { AppProps } from './types';

const App: FunctionComponent<BaseAppProps & AppProps> = ({ clientInformation, i18n, logger, vault, ...otherProps }) => {
  return (
    <AppProvider
      clientInformation={clientInformation}
      i18n={i18n}
      logger={logger}
      vault={vault}
    >
      <Root {...otherProps} />
    </AppProvider>
  );
};

export default App;

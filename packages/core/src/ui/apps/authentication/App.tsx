import type { FunctionComponent } from 'preact';

// containers
import Root from './Root';

// providers
import AppProvider from '@/ui/providers/AppProvider';

// types
import type { BaseAppProps } from '@/ui/types';
import type { AppProps } from './types';

const App: FunctionComponent<BaseAppProps & AppProps> = ({ il8n, logger, vault, ...otherProps }) => {
  return (
    <AppProvider
      il8n={il8n}
      logger={logger}
      vault={vault}
    >
      <Root {...otherProps} />
    </AppProvider>
  );
};

export default App;

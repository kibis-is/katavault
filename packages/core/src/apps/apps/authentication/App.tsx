import type { FunctionComponent } from 'preact';

// containers
import Root from './Root';

// providers
import AppProvider from '@/apps/providers/AppProvider';

// types
import type { BaseAppProps } from '@/apps/types';
import type { AppProps } from './types';

const App: FunctionComponent<BaseAppProps & AppProps> = ({ logger, vault, ...otherProps }) => {
  return (
    <AppProvider logger={logger} vault={vault} >
      <Root {...otherProps} />
    </AppProvider>
  );
};

export default App;

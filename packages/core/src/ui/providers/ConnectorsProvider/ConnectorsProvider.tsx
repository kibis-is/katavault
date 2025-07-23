import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';

// contexts
import { ConnectorsContext } from '@/ui/contexts';

// decorators
import { AVMWebProviderConnector } from '@/decorators/connectors';

// types
import type { Props } from './types';

const ConnectorsProvider: FunctionComponent<PropsWithChildren<Props>> = ({ chains, children, debug }) => {
  return (
    <ConnectorsContext.Provider value={[
      new AVMWebProviderConnector({
        debug,
        supportedChains: chains,
      })
    ]}>
      {children}
    </ConnectorsContext.Provider>
  );
};

export default ConnectorsProvider;

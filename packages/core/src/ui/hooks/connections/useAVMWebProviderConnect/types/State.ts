import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';

// types
import type ConnectParameters from './ConnectParameters';

interface State {
  connect: (params: ConnectParameters) => void;
  connection: IDiscoverResult | null;
}

export default State;

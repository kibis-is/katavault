import type { IDiscoverResult } from '@agoralabs-sh/avm-web-provider';

interface State {
  connectors: IDiscoverResult[];
  discover: () => void;
}

export default State;

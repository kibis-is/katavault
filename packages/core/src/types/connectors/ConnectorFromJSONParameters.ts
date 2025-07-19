import { Chain } from '@kibisis/chains';

// types
import type SerializedConnector from './SerializedConnector';

interface ConnectorFromJSONParameters {
  connector: SerializedConnector;
  debug?: boolean;
  supportedChains: Chain[];
}

export default ConnectorFromJSONParameters;

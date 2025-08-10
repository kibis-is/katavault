import { Chain } from '@kibisis/chains';

interface ConnectorParameters {
  debug?: boolean;
  supportedChains: Chain[];
}

export default ConnectorParameters;

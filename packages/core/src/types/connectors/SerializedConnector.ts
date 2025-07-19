// enums
import { ConnectorIDEnum } from '@/enums';

// types
import type WalletConnection from './WalletConnection';

/**
 * @propertu {WalletConnection[]} connections - A list of wallets this connector has connected.
 * @propertu {ConnectorIDEnum} id - A unique identifier for this connector.
 */
interface SerializedConnector {
  connections: WalletConnection[];
  id: ConnectorIDEnum;
}

export default SerializedConnector;

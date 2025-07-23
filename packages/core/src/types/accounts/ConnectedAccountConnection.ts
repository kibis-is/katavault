import { ConnectorIDEnum } from '@/enums';

// types
import type { WalletConnection } from '@/types';

/**
 * @property {ConnectorIDEnum} connectorID - The ID of the connector.
 * @property {number} createdAt - A Unix timestamp in seconds when this connection was created.
 * @property {number} lastUsedAt - A Unix timestamp in seconds when this connection was last used.
 * @property {string} [sessionID] - An optional session id for this connection.
 * @property {WalletConnection} wallet - The wallet connection.
 */
interface ConnectedAccountConnection {
  connectorID: ConnectorIDEnum;
  createdAt: number;
  lastUsedAt: number;
  sessionID?: string;
  wallet: WalletConnection;
}

export default ConnectedAccountConnection;

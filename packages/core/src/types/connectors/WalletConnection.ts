/**
 * @property {string[]} chainIDs - A list of CAIP-002 chain IDs this connector supports.
 * @property {number} createdAt - A Unix timestamp in seconds when this connection was created.
 * @property {string} [host] - The hostname of the client i.e., example.com.
 * @property {string} [iconURI] - A data URI of the chain that conforms to RFC-2397 or a URL that points to an image.
 * @property {string} id - A unique identifier for this connection.
 * @property {number} lastUsedAt - A Unix timestamp in seconds when this connection was last used.
 * @property {string} name - A human-readable canonical name for this connection.
 * @property {string} [sessionID] - An optional session id for this connection.
 */
interface WalletConnection {
  chainIDs: string[];
  createdAt: number;
  host?: string;
  iconURI?: string;
  id: string;
  lastUsedAt: number;
  name: string;
  sessionID?: string;
}

export default WalletConnection;

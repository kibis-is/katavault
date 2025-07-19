/**
 * @property {string[]} chainIDs - A list of CAIP-002 chain IDs this connector supports.
 * @property {string} [host] - The hostname of the client i.e., example.com.
 * @property {string} [iconURI] - A data URI of the chain that conforms to RFC-2397 or a URL that points to an image.
 * @property {string} id - A unique identifier for this connection.
 * @property {string} name - A human-readable canonical name for this connection.
 */
interface AvailableWalletConnection {
  chainIDs: string[];
  host?: string;
  iconURI?: string;
  id: string;
  name: string;
}

export default AvailableWalletConnection;

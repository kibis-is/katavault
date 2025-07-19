import { Chain } from '@kibisis/chains';
import { createLogger, ILogger, upsertItemsByKey } from '@kibisis/utilities';

// enums
import { ConnectorIDEnum } from '@/enums';

// errors
import { InvalidConnectorError } from '@/errors';

// types
import type {
  AvailableWalletConnection,
  ConnectedAccount,
  ConnectorFromJSONParameters,
  ConnectorParameters,
  SerializedConnector,
  WalletConnection,
} from '@/types';

export default abstract class AbstractConnector {
  /**
   * public static variables
   */
  public static readonly canonicalName: string;
  public static readonly displayName: string;
  public static readonly host: string | null;
  public static readonly id: ConnectorIDEnum;
  /**
   * protected variables
   */
  protected readonly _debug: boolean;
  protected readonly _logger: ILogger;
  protected readonly _supportedChains: Chain[];

  public constructor({ debug = false, supportedChains }: ConnectorParameters) {
    this._debug = debug;
    this._logger = createLogger(debug ? 'debug' : 'error');
    this._supportedChains = supportedChains;
  }

  /**
   * public static methods
   */

  /**
   * Creates an instance of connector from a serialized connector JSON object.
   *
   * @params {ConnectorFromJSONParameters} params - The serialized connector and supported chains.
   * @return {AbstractConnector} A new instance of connector initialized with the provided JSON data.
   * @throws {InvalidConnectorError} Throws an error if the connector id of the serialized connector does not match the
   * expected id for this connector.
   */
  public static fromJSON<T extends AbstractConnector>(
    this: {
      new (params: ConnectorParameters): T;
      readonly id: ConnectorIDEnum;
    },
    { connector, ...otherParams }: ConnectorFromJSONParameters
  ): T {
    if (connector.id !== this.id) {
      throw new InvalidConnectorError(
        `connector id "${connector.id}" does not match the requesting connector "${this.id}"`
      );
    }

    return new this({
      ...otherParams,
      connections: connector.connections,
    });
  }

  /**
   * public abstract methods
   */

  public abstract availableConnections(): Promise<AvailableWalletConnection[]>;
  public abstract connect(id: string): Promise<ConnectedAccount[]>;

  /**
   * public methods
   */

  /**
   * Retrieves the list of wallet connections.
   *
   * @return {WalletConnection[]} An array of connections representing the current connections.
   * @public
   */
  public connections(): WalletConnection[] {
    return this._connections;
  }

  /**
   * Retrieves the hostname of the connector i.e., example.com.
   *
   * @return {string | null} The host as a string if defined, otherwise null.
   * @public
   */
  public host(): string | null {
    return (this.constructor as typeof AbstractConnector).host;
  }

  /**
   * Retrieves the unique identifier for the current connector.
   *
   * @return {ConnectorIDEnum} The unique identifier of the connector.
   * @public
   */
  public id(): ConnectorIDEnum {
    return (this.constructor as typeof AbstractConnector).id;
  }

  /**
   * Retrieves the human-readable canonical name of the connector.
   *
   * @return {string} The human-readable canonical name.
   * @public
   */
  public name(): string {
    return (this.constructor as typeof AbstractConnector).canonicalName;
  }

  /**
   * Removes a connection from the list of connections based on the provided connection ID.
   *
   * @param {string} id - The unique identifier of the connection to be removed.
   * @return {WalletConnection[]} The updated list of wallet connections after the specified connection has been removed.
   * @public
   */
  public removeConnectionByID(id: string): WalletConnection[] {
    return this._connections.filter((c) => c.id !== id);
  }

  /**
   * Converts the current object instance into a serialized JSON representation.
   *
   * @return {SerializedConnector} The serialized representation of the connector, including its ID and connections.
   * @public
   */
  public toJSON(): SerializedConnector {
    return {
      id: (this.constructor as typeof AbstractConnector).id,
      connections: this._connections,
    };
  }

  /**
   * Adds or updates a connection based on the `id` key. If a connection with the same `id` exists, it is updated;
   * otherwise, a new connection is added.
   *
   * @param {WalletConnection} connection - The WalletConnection object to be added or updated.
   * @return {WalletConnection[]} The updated list of WalletConnection objects.
   * @public
   */
  public upsertConnection(connection: WalletConnection): WalletConnection[] {
    return upsertItemsByKey<WalletConnection>(this._connections, [connection], 'id');
  }
}

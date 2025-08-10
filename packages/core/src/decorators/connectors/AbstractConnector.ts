import { Chain } from '@kibisis/chains';
import { createLogger, type ILogger } from '@kibisis/utilities';

// enums
import { ConnectorIDEnum } from '@/enums';

// types
import type { ConnectedAccount, ConnectorParameters, WalletConnection } from '@/types';

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
   * public abstract methods
   */

  public abstract availableConnections(): Promise<WalletConnection[]>;
  public abstract connect(id: string): Promise<ConnectedAccount[]>;

  /**
   * public methods
   */

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
}

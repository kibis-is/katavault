import { AVMWebClient, IDiscoverResult } from '@agoralabs-sh/avm-web-provider';
import { type AVMNetworkInformation } from '@kibisis/chains';
import { base58 } from '@kibisis/encoding';

// decorators
import AbstractConnector from './AbstractConnector';
import AVMAddress from '@/decorators/avm/AVMAddress';

// enums
import { AccountTypeEnum, ConnectorIDEnum } from '@/enums';

// types
import type { AvailableWalletConnection, ConnectedAccount, ConnectorParameters } from '@/types';

export default class AVMWebProviderConnector extends AbstractConnector {
  /**
   * public static variables
   */
  public static readonly canonicalName = 'AVM Web Provider';
  public static readonly displayName = 'AVMWebProviderConnector';
  public static readonly host = 'avm-web-provider.agoralabs.sh';
  public static readonly id = ConnectorIDEnum.AVMWebProvider;
  /**
   * private variables
   */
  private readonly _discoverTimeout = 300; // 0.3 seconds
  private readonly _client: AVMWebClient;

  public constructor(params: ConnectorParameters) {
    super(params);

    this._client = AVMWebClient.init();
  }

  /**
   * private methods
   */

  private _mapDiscoverResultToAvailableConnection({
    host,
    icon,
    name,
    networks,
    providerId,
  }: IDiscoverResult): AvailableWalletConnection {
    return {
      chainIDs: this._supportedChains.reduce((acc, currentValue) => {
        const network =
          networks.find(
            ({ genesisHash }) => genesisHash === (currentValue.networkInformation as AVMNetworkInformation).genesisHash
          ) ?? null;

        if (network) {
          return [...acc, currentValue.chainID()];
        }

        return acc;
      }, []),
      host,
      iconURI: icon,
      id: providerId,
      name,
    };
  }

  private _supportedGenesisHashes(): string[] {
    return this._supportedChains.reduce((acc, currentValue) => {
      if ('genesisHash' in currentValue.networkInformation) {
        return [...acc, (currentValue.networkInformation as AVMNetworkInformation).genesisHash];
      }

      return acc;
    }, []);
  }

  /**
   * public methods
   */

  public async availableConnections(): Promise<AvailableWalletConnection[]> {
    const __logPrefix = `${AVMWebProviderConnector.displayName}#availableConnections`;

    return new Promise((resolve) => {
      let connections: AvailableWalletConnection[] = [];
      let listenerID: string;

      listenerID = this._client.onDiscover(({ error, result }) => {
        let connectionIndex: number;

        if (error) {
          this._logger.error(`${__logPrefix}:`, error);

          return;
        }

        if (result) {
          this._logger.debug(
            `${__logPrefix}: found "${result.name}" connection with provider id "${result.providerId}" and networks [${result.networks.map(({ genesisHash }) => genesisHash).join(',')}]`
          );

          // check if the genesis hashes are supported
          if (!result.networks.some(({ genesisHash }) => this._supportedGenesisHashes().includes(genesisHash))) {
            this._logger.debug(
              `${__logPrefix}: "${result.name}" with networks [${result.networks.map(({ genesisHash }) => genesisHash).join(',')}] does not support any of the supported chains [${this._supportedGenesisHashes().join(',')}]`
            );

            return;
          }

          connectionIndex = connections.findIndex(({ id }) => id === result.providerId);

          // if the connection doesn't exist, add it
          if (connectionIndex < 0) {
            connections.push(this._mapDiscoverResultToAvailableConnection(result));

            return;
          }

          connections = connections.map((connection, index) =>
            index === connectionIndex ? this._mapDiscoverResultToAvailableConnection(result) : connection
          );

          return;
        }

        return;
      });

      window.setTimeout(() => {
        this._client.removeListener(listenerID);
        resolve(connections);
      }, this._discoverTimeout);

      // TODO: add chains
      this._client.discover();
    });
  }

  public async connect(id: string): Promise<ConnectedAccount[]> {
    const __logPrefix = `${AVMWebProviderConnector.displayName}#connect`;
    const connection = (await this.availableConnections()).find(({ id: connectionID }) => connectionID === id);

    if (!connection) {
      // TODO: throw specific error
      throw new Error(`connection "${id}" not available`);
    }

    return new Promise<ConnectedAccount[]>((resolve, reject) => {
      const listenerID = this._client.onEnable(({ error, result }) => {
        if (error) {
          this._logger.error(`${__logPrefix}:`, error);

          reject(error);
        }

        if (result) {
          resolve(
            result.accounts.map(({ address, name }) => ({
              __type: AccountTypeEnum.Connected,
              connectors: [
                {
                  id: AVMWebProviderConnector.id,
                  connections: [
                    {
                      ...connection,
                      createdAt: new Date().getTime() / 1000,
                      lastUsedAt: new Date().getTime() / 1000,
                      sessionID: result.sessionId,
                    },
                  ],
                },
              ],
              key: base58.encode(AVMAddress.fromAddress(address).publicKey()),
              name,
            }))
          );
        }

        this._client.removeListener(listenerID);
      });

      this._client.enable({
        providerId: id,
      });
    });
  }
}

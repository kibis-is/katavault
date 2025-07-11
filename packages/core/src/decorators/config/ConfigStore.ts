// constants
import { IDB_CONFIG_STORE_NAME } from '@/constants';

// decorators
import BaseStore from '@/decorators/_base/BaseStore';

// types
import type { ConfigStoreSchema, StoreParameters } from '@/types';

export default class ConfigStore extends BaseStore {
  // public static variables
  public static readonly displayName = 'ConfigStore';

  public constructor(params: StoreParameters) {
    super(params);
  }

  /**
   * public methods
   */

  /**
   * Gets the configuration.
   * @returns {Promise<ConfigStoreSchema | null>} A promise that resolves to the configuration or null if no
   * configuration exists.
   * @public
   */
  public async config(): Promise<ConfigStoreSchema | null> {
    const transaction = this._vault.transaction(IDB_CONFIG_STORE_NAME, 'readonly');
    const store: ConfigStoreSchema = {
      colorMode: await transaction.store.get('colorMode'),
    };

    if (typeof store.colorMode === 'undefined') {
      return null;
    }

    return store;
  }

  /**
   * Sets the configuration.
   * @param {ConfigStoreSchema} config - The configuration object to be saved or updated.
   * @return {Promise<ConfigStoreSchema>} A promise that resolves to the stored configuration.
   * @public
   */
  public async setConfig(config: ConfigStoreSchema): Promise<ConfigStoreSchema> {
    const transaction = this._vault.transaction(IDB_CONFIG_STORE_NAME, 'readwrite');
    const colorMode = (await transaction.store.get('colorMode')) || null;

    colorMode
      ? await transaction.store.put(config.colorMode, 'colorMode')
      : await transaction.store.add(config.colorMode, 'colorMode');

    return config;
  }
}

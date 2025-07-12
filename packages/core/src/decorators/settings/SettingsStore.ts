import { IDBPTransaction } from 'idb';

// constants
import { IDB_SETTINGS_STORE_NAME } from '@/constants';

// decorators
import BaseStore from '@/decorators/_base/BaseStore';

// types
import type { SettingsStoreSchema, StoreParameters, VaultSchema } from '@/types';

export default class SettingsStore extends BaseStore {
  // public static variables
  public static readonly displayName = 'ConfigStore';

  public constructor(params: StoreParameters) {
    super(params);
  }

  /**
   * private methods
   */

  private _defaultSettings(): SettingsStoreSchema {
    return {
      colorMode: 'light',
    };
  }

  private async _settings(
    transaction: IDBPTransaction<VaultSchema, ['settings'], 'readonly' | 'readwrite'>
  ): Promise<SettingsStoreSchema> {
    const defaultSettings = this._defaultSettings();

    return {
      ...defaultSettings,
      colorMode: (await transaction.store.get('colorMode')) ?? defaultSettings.colorMode,
    };
  }

  /**
   * public methods
   */

  /**
   * Sets the configuration.
   * @param {Partial<SettingsStoreSchema>} settings - Values of the settings to be saved or updated.
   * @return {Promise<SettingsStoreSchema>} A promise that resolves to the updated settings.
   * @public
   */
  public async setSettings(settings: Partial<SettingsStoreSchema>): Promise<SettingsStoreSchema> {
    const defaultSettings = this._defaultSettings();
    const transaction = this._vault.transaction(IDB_SETTINGS_STORE_NAME, 'readwrite');
    const keys = await transaction.store.getAllKeys();

    for (const key of Object.keys(defaultSettings) as (keyof SettingsStoreSchema)[]) {
      // if the key exists and the settings exist, update the value
      if (keys.includes(key) && settings[key]) {
        if (settings[key]) {
          await transaction.store.put(settings[key], key);

          continue;
        }

        continue;
      }

      // ... otherwise, add the new key/value or use the default one
      await transaction.store.add(settings[key] ?? defaultSettings[key], key);
    }

    return await this._settings(transaction);
  }

  /**
   * Gets the settings.
   * @returns {Promise<SettingsStoreSchema>} A promise that resolves to the settings.
   * @public
   */
  public async settings(): Promise<SettingsStoreSchema> {
    return await this._settings(this._vault.transaction(IDB_SETTINGS_STORE_NAME, 'readonly'));
  }
}

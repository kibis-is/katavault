import { openDB } from 'idb';

// constants
import {
  IDB_ACCOUNTS_STORE_NAME,
  IDB_PASSKEY_STORE_NAME,
  IDB_PASSWORD_STORE_NAME,
  IDB_SETTINGS_STORE_NAME,
} from '@/constants';

// types
import type { CommonParameters, InitializeVaultParameters, Vault, VaultSchema } from '@/types';

// utilities
import { default as generateVaultName } from './vaultName';

/**
 * Initializes the vault connection.
 * @param {CommonParameters & InitializeVaultParameters} params - A logging tool and the username that identifies the
 * vault.
 * @param {ILogger} params.logger - Logs debug and error messages.
 * @param {string} params.username - The username that identifies the vault.
 * @returns {Promise<Vault>} A promise that resolves to the initialized vault identified by the hexadecimal encoded
 * username.
 */
export default async function initializeVault({
  logger,
  username,
}: CommonParameters & InitializeVaultParameters): Promise<Vault> {
  const __logPrefix = `initializeVault`;
  const vaultName = generateVaultName(username);

  return await openDB<VaultSchema>(vaultName, undefined, {
    upgrade: (_db, oldVersion, newVersion) => {
      // we are creating a new database
      if (oldVersion <= 0 && newVersion && newVersion > 0) {
        // create the stores
        _db.createObjectStore(IDB_ACCOUNTS_STORE_NAME);
        _db.createObjectStore(IDB_PASSKEY_STORE_NAME);
        _db.createObjectStore(IDB_PASSWORD_STORE_NAME);
        _db.createObjectStore(IDB_SETTINGS_STORE_NAME);

        logger.debug(`${__logPrefix}: created new vault "${vaultName}"`);
      }
    },
  });
}

// constants
import { IDB_ACCOUNTS_STORE_NAME, IDB_PASSKEY_STORE_NAME, IDB_PASSWORD_STORE_NAME } from '@/constants';

// types
import type { UpdateVaultParameters } from '@/types';

export default function updateVault({ database, logger, newVersion, oldVersion }: UpdateVaultParameters): void {
  const __logPrefix = 'updateVault';

  // we are creating a new database
  if (oldVersion <= 0 && newVersion && newVersion > 0) {
    // create the stores
    database.createObjectStore(IDB_ACCOUNTS_STORE_NAME);
    database.createObjectStore(IDB_PASSKEY_STORE_NAME);
    database.createObjectStore(IDB_PASSWORD_STORE_NAME);

    logger.debug(`${__logPrefix}: created new vault`);
  }
}

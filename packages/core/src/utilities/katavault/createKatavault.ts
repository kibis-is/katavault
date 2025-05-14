import { openDB } from 'idb';

// constants
import { IDB_ACCOUNTS_STORE_NAME, IDB_PASSKEY_STORE_NAME, IDB_PASSWORD_STORE_NAME } from '@/constants';

// decorators
import { PasskeyStore, PasswordStore } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

// errors
import { FailedToInitializeError, PasskeyNotSupportedError } from '@/errors';

// facades
import { Katavault } from '@/facades';

// types
import type {
  AuthenticationStore,
  ClientInformation,
  CreateKatavaultParameters,
  CreateKatavaultParametersWithPassword,
  VaultSchema,
} from '@/types';

// utilities
import { createLogger, createVaultName, documentTitle, faviconURL } from '@/utilities';

/**
 * Creates an instance of Katavault.
 * @param {CreateKatavaultParameters | CreateKatavaultParametersWithPassword} params - client information, user
 * information and an optional password.
 * @throws {DecryptionError} If the stored challenge failed to be decrypted.
 * @throws {InvalidPasswordError} If supplied password does not match the stored password.
 * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
 * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
 * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
 * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
 */
export default async function createKatavault(
  params: CreateKatavaultParameters | CreateKatavaultParametersWithPassword
): Promise<Katavault> {
  const logger = createLogger(params.debug ? 'debug' : 'error');
  const client: ClientInformation = {
    host: window.location.hostname,
    icon: params.client?.icon || faviconURL() || undefined,
    name: params.client?.name ?? documentTitle(),
  };
  const vault = await openDB<VaultSchema>(createVaultName(params.user.username), undefined, {
    upgrade: (_db, oldVersion, newVersion) => {
      const __logPrefix = 'updateVault';

      // we are creating a new database
      if (oldVersion <= 0 && newVersion && newVersion > 0) {
        // create the stores
        _db.createObjectStore(IDB_ACCOUNTS_STORE_NAME);
        _db.createObjectStore(IDB_PASSKEY_STORE_NAME);
        _db.createObjectStore(IDB_PASSWORD_STORE_NAME);

        logger.debug(`${__logPrefix}: created new vault`);
      }
    },
  });
  let authenticationStore: AuthenticationStore | null = null;

  // if a password is supplied, use password authentication
  if ((params as CreateKatavaultParametersWithPassword).password) {
    authenticationStore = {
      __type: AuthenticationMethod.Password,
      store: await PasswordStore.initialize({
        logger,
        password: (params as CreateKatavaultParametersWithPassword).password,
        vault,
      }),
    };
  }

  if (!(params as CreateKatavaultParametersWithPassword).password) {
    if (!PasskeyStore.isSupported()) {
      throw new PasskeyNotSupportedError('passkey not supported');
    }

    authenticationStore = {
      __type: AuthenticationMethod.Passkey,
      store: await PasskeyStore.initialize({
        client,
        logger,
        user: params.user,
        vault,
      }),
    };
  }

  if (!authenticationStore) {
    throw new FailedToInitializeError('failed to initialize with an authentication method');
  }

  return await Katavault.initialize({
    authenticationStore,
    logger,
    user: params.user,
    vault,
  });
}

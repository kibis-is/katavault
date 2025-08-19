// decorators
import { PasskeyStore } from '@/decorators';

// types
import type { AuthenticateWithPasskeyParameters, CommonParameters, WithClientInformation, WithVault } from '@/types';

/**
 * Authenticates with a passkey.
 *
 * @param {CommonParameters & WithClientInformation<WithVault<AuthenticateWithPasskeyParameters>>} params - The input
 * parameters.
 * @param {ClientInformation} params.clientInformation - Information about the client.
 * @param {string} params.clientInformation.hostname - The hostname of the client i.e., example.com.
 * @param {string} [params.clientInformation.icon] - An icon URL for the client.
 * @param {string} params.clientInformation.name - A human-readable name for the client.
 * @param {ILogger} params.logger - A logger for logging.
 * @param {string} params.username - A globally unique identifier for the user. This could be, for example, an email
 * address.
 * @param {Vault} params.vault - An initialized vault.
 * @returns {Promise<PasskeyStore>} A promise that resolves to an initialized passkey store.
 * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
 * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
 * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
 * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
 * @public
 */
export default async function authenticateWithPasskey({
  clientInformation,
  logger,
  username,
  vault,
}: CommonParameters & WithClientInformation<WithVault<AuthenticateWithPasskeyParameters>>): Promise<PasskeyStore> {
  const __logPrefix = `utilities#authenticateWithPasskey`;
  const store = new PasskeyStore({
    hostname: clientInformation.hostname,
    logger,
    username,
    vault,
  });
  let keyMaterial: Uint8Array;
  let passkey = await store.passkey();

  // if there is no passkey register a new one
  if (!passkey) {
    logger.debug(`${__logPrefix}: no passkey exists, registering new credential`);

    passkey = await PasskeyStore.register({
      clientInformation: clientInformation,
      logger,
      username,
    });

    await store.setPasskey(passkey);
  }

  logger.debug(`${__logPrefix}: authenticating new credential "${passkey.credentialID}"`);

  keyMaterial = await PasskeyStore.authenticate({
    logger,
    ...passkey,
  });

  store.setKeyMaterial(keyMaterial);

  logger.debug(`${__logPrefix}: authenticated new credential "${passkey.credentialID}"`);

  return store;
}

import { base64, utf8 } from '@kibisis/encoding';

// errors
import { InvalidPasswordError } from '@/errors';

// decorators
import { PasswordStore } from '@/decorators';

// types
import type { AuthenticateWithPasswordParameters, CommonParameters, WithClientInformation, WithVault } from '@/types';

/**
 * Authenticates with the supplied password.
 * @param {CommonParameters & WithVault<AuthenticateWithPasswordParameters>} params - The password and vault.
 * @param {ILogger} params.logger - A logger for logging.
 * @param {string} params.password - The password.
 * @param {Vault} params.vault - An initialized vault.
 * @returns {Promise<PasswordStore>} A promise that resolves to an initialized password store.
 * @throws {DecryptionError} If the stored challenge failed to be decrypted.
 * @throws {InvalidPasswordError} If supplied password does not match the stored password.
 */
export default async function authenticateWithPassword({
  clientInformation,
  logger,
  password,
  user,
  vault,
}: CommonParameters & WithClientInformation<WithVault<AuthenticateWithPasswordParameters>>): Promise<PasswordStore> {
  const __logPrefix = `utilities#authenticateWithPassword`;
  const store = new PasswordStore({
    hostname: clientInformation.hostname,
    logger,
    username: user.username,
    vault,
  });
  let encryptedChallenge = await store.challenge();
  let isVerified: boolean;

  // set the password
  store.setPassword(password);

  // if the stored challenge exists, verify the supplied password
  if (encryptedChallenge) {
    logger.debug(`${__logPrefix}: password store exists`);

    isVerified = await store.verify();

    if (!isVerified) {
      throw new InvalidPasswordError('incorrect password');
    }

    logger.debug(`${__logPrefix}: signed in with password`);

    return store;
  }

  // ... otherwise, if there is no stored challenge, encrypt a new one into the store.

  logger.debug(`${__logPrefix}: initializing new password store`);

  encryptedChallenge = base64.encode(await store.encryptBytes(utf8.decode(PasswordStore.challenge)));

  await store.setChallenge(encryptedChallenge);
  await store.setLastUsedAt();

  logger.debug(`${__logPrefix}: created new credential with password`);

  return store;
}

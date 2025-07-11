import { encode as encodeUtf8 } from '@stablelib/utf8';

// errors
import { InvalidPasswordError } from '@/errors';

// decorators
import { PasswordStore } from '@/decorators';

// types
import type { AuthenticateWithPasswordParameters, CommonParameters, WithVault } from '@/types';

// utilities
import { bytesToHex } from '@/utilities';

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
  logger,
  password,
  vault,
}: CommonParameters & WithVault<AuthenticateWithPasswordParameters>): Promise<PasswordStore> {
  const __logPrefix = `utilities#authenticateWithPassword`;
  const store = new PasswordStore({
    logger,
    vault,
  });
  let encryptedChallenge = await store.challenge();
  let isVerified: boolean;

  // set the password
  store.setPassword(password);

  // if there is no stored challenge, encrypt a new one into the store.
  if (!encryptedChallenge) {
    logger.debug(`${__logPrefix}: initializing new password store`);

    encryptedChallenge = bytesToHex(await store.encryptBytes(encodeUtf8(PasswordStore.challenge)));

    await store.setChallenge(encryptedChallenge);
    await store.setLastUsedAt();
  }

  // if the stored challenge exists, verify the supplied password
  if (encryptedChallenge) {
    logger.debug(`${__logPrefix}: password store exists`);

    isVerified = await store.verify();

    if (!isVerified) {
      throw new InvalidPasswordError('incorrect password');
    }
  }

  logger.debug(`${__logPrefix}: authenticated with password`);

  return store;
}

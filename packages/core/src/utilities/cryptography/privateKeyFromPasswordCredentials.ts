import { concat } from '@agoralabs-sh/bytes';
import { encode as encodeUTF8 } from '@stablelib/utf8';

// constants
import { ED25519_PRIVATE_KEY_BYTE_LENGTH } from '@/constants';

// types
import type { PrivateKeyFromPasswordCredentialsParameters } from '@/types';

// utilities
import createDerivationKey from './createDerivationKey';

/**
 * Generates a private key derived from the provided password credentials.
 *
 * The key is derived using the scrypt key derivation function, and the salt is the concatenation of the hostname and
 * the username, while the secret is the concatenation of the username and the password.
 * @param {PrivateKeyFromPasswordCredentialsParameters} params - The password credentials.
 * @param {string} params.hostname - The hostname of the client i.e., example.com.
 * @param {string} params.password - A high-entropy password (ideally 128-bits - at least 7 random UTF-8 characters) used to derive the
 * private key.
 * @param {string} params.username - A globally unique identifier for the user. This could be, for example, an email
 * address.
 * @return {Promise<Uint8Array>} A promise that resolves to a private key derived from the password credentials.
 */
export default async function privateKeyFromPasswordCredentials({
  hostname,
  password,
  username,
}: PrivateKeyFromPasswordCredentialsParameters): Promise<Uint8Array> {
  return await createDerivationKey({
    keyLength: ED25519_PRIVATE_KEY_BYTE_LENGTH,
    salt: concat(encodeUTF8(hostname), encodeUTF8(username)),
    secret: concat(encodeUTF8(username), encodeUTF8(password)),
  });
}

// types
import type { BaseEphemeralAccountStoreItem } from '@/types';

/**
 * @property {string} key - The public key encoded with base58.
 * @property {string} keyData - The encrypted private key, encoded with base58, that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 * @property {string} passwordHash - A hexadecimal encoded SHA-512 hash of the password used for encryption.
 */
interface EphemeralAccountStoreItemWithPassword extends BaseEphemeralAccountStoreItem {
  passwordHash: string;
}

export default EphemeralAccountStoreItemWithPassword;

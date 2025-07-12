// types
import type { BaseEphemeralAccountStoreItem } from '@/types';

/**
 * @property {string} credentialID - the hexadecimal encoded ID of the passkey credential used for encryption.
 * @property {string} key - The public key encoded with base58.
 * @property {string} keyData - The encrypted private key, encoded with base58, that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 */
interface EphemeralAccountStoreItemWithPasskey extends BaseEphemeralAccountStoreItem {
  credentialID: string;
}

export default EphemeralAccountStoreItemWithPasskey;

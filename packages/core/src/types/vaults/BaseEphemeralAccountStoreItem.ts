// types
import type { WithKeyData } from '@/types';

/**
 * @property {string} key - The public key encoded with base58.
 * @property {string} keyData - The encrypted private key, encoded with base58, that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 */
interface BaseEphemeralAccountStoreItem extends Omit<WithKeyData, 'keyData'> {
  keyData: string;
}

export default BaseEphemeralAccountStoreItem;

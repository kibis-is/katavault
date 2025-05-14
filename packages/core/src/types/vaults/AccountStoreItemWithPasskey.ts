// types
import type { BaseAccountStoreItem } from '@/types';

/**
 * @property {string} _id - A unique UUID v4 identifier. For internal use only.
 * @property {string} address - The address of the account.
 * @property {string} credentialID - the hexadecimal encoded ID of the passkey credential used for encryption.
 * @property {string} keyData - The hexadecimal encoded encrypted private key that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 */
interface AccountStoreItemWithPasskey extends BaseAccountStoreItem {
  credentialID: string;
}

export default AccountStoreItemWithPasskey;

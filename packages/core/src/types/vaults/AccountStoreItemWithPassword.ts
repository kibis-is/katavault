// types
import type { BaseAccountStoreItem } from '@/types';

/**
 * @property {string} _id - A unique UUID v4 identifier. For internal use only.
 * @property {string} address - The address of the account.
 * @property {string} keyData - The hexadecimal encoded encrypted private key that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 * @property {string} passwordHash - A hexadecimal encoded SHA-512 hash of the password used for encryption.
 */
interface AccountStoreItemWithPassword extends BaseAccountStoreItem {
  passwordHash: string;
}

export default AccountStoreItemWithPassword;

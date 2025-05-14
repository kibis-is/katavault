// types
import type { AccountWithKeyData } from '@/types';

/**
 * @property {string} _id - A unique UUID v4 identifier. For internal use only.
 * @property {string} address - The address of the account.
 * @property {string} keyData - The hexadecimal encoded encrypted private key that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 */
interface BaseAccountStoreItem extends Omit<AccountWithKeyData, 'keyData'> {
  keyData: string;
}

export default BaseAccountStoreItem;

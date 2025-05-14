// types
import type { AccountWithKeyData } from '@/types';

/**
 * @property {string} address - The address of the account.
 * @property {string} keyData - The hexadecimal encoded encrypted private key that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 */
interface BaseAccountStoreItem extends Omit<AccountWithKeyData, 'keyData'> {
  keyData: string;
}

export default BaseAccountStoreItem;

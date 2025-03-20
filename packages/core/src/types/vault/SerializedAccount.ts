// types
import type { Account } from '@/types';

/**
 * @property {string} keyData - The hexadecimal encoded encrypted private key that can be safely serialized.
 */
interface SerializedAccount extends Omit<Account, 'keyData'> {
  keyData: string;
}

export default SerializedAccount;

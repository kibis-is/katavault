// types
import type { Account } from '@/types';

/**
 * @property {string} address - The address of the account.
 * @property {string} keyData - The encrypted private key.
 * @property {string} name - [optional] The name of the account.
 */
interface AccountWithKeyData extends Account {
  readonly keyData: Uint8Array;
}

export default AccountWithKeyData;

// enums
import { AccountTypeEnum } from '@/enums';

// types
import type Account from './Account';
import type WithKeyData from './WithKeyData';

/**
 * @property {AccountTypeEnum.Ephemeral} __type - The type of account: `ephemeral`.
 * @property {string} key - The public key encoded in base58.
 * @property {Uint8Array} keyData - The encrypted private key.
 * @property {string} name - [optional] The name of the account.
 */
interface EphemeralAccount extends WithKeyData<Account> {
  __type: AccountTypeEnum.Ephemeral;
}

export default EphemeralAccount;

// enums
import { AccountTypeEnum } from '@/enums';

/**
 * @property {AccountTypeEnum} __type - The type of account: `connected` or `ephemeral`.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 */
interface Account {
  __type: AccountTypeEnum;
  key: string;
  name?: string;
}

export default Account;

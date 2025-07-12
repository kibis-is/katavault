// enums
import { AccountTypeEnum } from '@/enums';

// types
import type Account from './Account';

/**
 * @property {AccountTypeEnum.Connected} __type - The type of account: `connected`.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 */
interface ConnectedAccount extends Account {
  __type: AccountTypeEnum.Connected;
}

export default ConnectedAccount;

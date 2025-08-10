// enums
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';

// types
import type Account from './Account';

/**
 * @property {AccountTypeEnum.Ephemeral} __type - The type of account: `ephemeral`.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 * @property {EphemeralAccountOriginEnum} origin - The origin that was used to create this account.
 */
interface EphemeralAccount extends Account {
  __type: AccountTypeEnum.Ephemeral;
  origin: EphemeralAccountOriginEnum;
}

export default EphemeralAccount;

// enums
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';

// types
import type Account from './Account';
import type Balance from './Balance';

/**
 * @property {AccountTypeEnum.Ephemeral} __type - The type of account: `ephemeral`.
 * @property {Record<string, Balance>} balance - A key/value pair where the key is the chain ID and the value is the
 * balance for this account for the specified chain.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 * @property {EphemeralAccountOriginEnum} origin - The origin that was used to create this account.
 */
interface EphemeralAccount extends Account {
  __type: AccountTypeEnum.Ephemeral;
  balances: Record<string, Balance>;
  origin: EphemeralAccountOriginEnum;
}

export default EphemeralAccount;

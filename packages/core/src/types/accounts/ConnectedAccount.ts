// enums
import { AccountTypeEnum } from '@/enums';

// types
import type Account from './Account';
import type AccountConnector from './AccountConnector';

/**
 * @property {AccountTypeEnum.Connected} __type - The type of account: `connected`.
 * @property {[AccountConnector, ...AccountConnector[]]} connectors - The connectors used to create this account.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 */
interface ConnectedAccount extends Account {
  __type: AccountTypeEnum.Connected;
  connectors: [AccountConnector, ...AccountConnector[]];
}

export default ConnectedAccount;

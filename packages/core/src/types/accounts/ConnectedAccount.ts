// enums
import { AccountTypeEnum } from '@/enums';

// types
import type Account from './Account';
import type ConnectedAccountConnection from './ConnectedAccountConnection';

/**
 * @property {AccountTypeEnum.Connected} __type - The type of account: `connected`.
 * @property {[ConnectedAccountConnection, ...ConnectedAccountConnection[]]} connections - The list of connectors used
 * to connect this account.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 */
interface ConnectedAccount extends Account {
  __type: AccountTypeEnum.Connected;
  connections: [ConnectedAccountConnection, ...ConnectedAccountConnection[]];
}

export default ConnectedAccount;

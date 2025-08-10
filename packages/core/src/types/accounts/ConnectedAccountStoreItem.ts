// types
import type ConnectedAccount from './ConnectedAccount';

/**
 * @property {AccountTypeEnum.Connected} __type - The type of account: `connected`.
 * @property {string} key - The public key encoded with base58.
 * @property {string} name - [optional] The name of the account.
 */
type ConnectedAccountStoreItem = ConnectedAccount;

export default ConnectedAccountStoreItem;

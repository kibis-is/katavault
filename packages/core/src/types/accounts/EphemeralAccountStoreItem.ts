// types
import type EphemeralAccount from './EphemeralAccount';

/**
 * @property {AccountTypeEnum.Ephemeral} __type - The type of account: `ephemeral`.
 * @property {string} credentialID - The credential ID this ephemeral account's keyData is encrypted with.
 * @property {string} key - The public key encoded with base58.
 * @property {string} keyData - The encrypted private key, encoded with base58, that can be safely serialized.
 * @property {string} name - [optional] The name of the account.
 */
interface EphemeralAccountStoreItem extends EphemeralAccount {
  credentialID: string;
  keyData: string;
}

export default EphemeralAccountStoreItem;

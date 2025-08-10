// types
import type EphemeralAccountStoreItem from './EphemeralAccountStoreItem';

/**
 * @property {AccountTypeEnum.Ephemeral} __type - The type of account: `ephemeral`.
 * @property {string} credentialID - The credential ID this ephemeral account's keyData is encrypted with.
 * @property {string} key - The public key encoded with base58.
 * @property {Uint8Array} keyData - The decrypted private key. This can be used for signing.
 * @property {string} name - [optional] The name of the account.
 */
interface EphemeralAccountStoreItemWithDecryptedKeyData extends Omit<EphemeralAccountStoreItem, 'keyData'> {
  keyData: Uint8Array;
}

export default EphemeralAccountStoreItemWithDecryptedKeyData;

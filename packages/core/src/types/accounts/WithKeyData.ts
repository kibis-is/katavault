// types
import type EphemeralAccount from './EphemeralAccount';

/**
 * @property {AccountTypeEnum.Ephemeral} __type - The type of account: `ephemeral`.
 * @property {string} key - The public key encoded with base58.
 * @property {Uint8Array} keyData - The encrypted private key.
 * @property {string} name - [optional] The name of the account.
 */
type WithKeyData<Value = EphemeralAccount> = Value & Readonly<Record<'keyData', Uint8Array>>;

export default WithKeyData;

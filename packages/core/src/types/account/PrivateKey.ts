/**
 * @property {string} keyData - The encrypted private key.
 * @property {string} name - [optional] The name of the account.
 */
interface PrivateKey {
  readonly keyData: Uint8Array;
  name?: string;
}

export default PrivateKey;

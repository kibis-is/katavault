import type ImportAccountParameters from './ImportAccountParameters';

/**
 * @property {string} name - [optional] The name of the account.
 * @property {Uint8Array} privateKey - The raw private key used to derive the Ed25519 key pair.
 */
interface ImportAccountWithPrivateKeyParameters extends ImportAccountParameters {
  privateKey: Uint8Array;
}

export default ImportAccountWithPrivateKeyParameters;

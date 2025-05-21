/**
 * @property {number} keyLength - The byte length of the derived key.
 * @property {Uint8Array} salt - The salt used to derive key.
 * @property {Uint8Array} secret - The secret used to derive the private key.
 *
 */
interface CreateDerivationKeyParameters {
  keyLength: number;
  salt: Uint8Array;
  secret: Uint8Array;
}

export default CreateDerivationKeyParameters;

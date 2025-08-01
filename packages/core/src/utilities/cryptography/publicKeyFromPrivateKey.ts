import { ed25519 } from '@noble/curves/ed25519';

// errors
import { InvalidPrivateKeyError } from '@/errors';

/**
 * Gets the public for a given private key.
 *
 * @param {Uint8Array} privateKey - The private key.
 * @returns {Uint8Array} The public key for the given private key.
 * @throws {InvalidPrivateKeyError} If the supplied private key is invalid.
 */
export default function publicKeyFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  try {
    return ed25519.getPublicKey(privateKey);
  } catch (error) {
    throw new InvalidPrivateKeyError(error.message);
  }
}

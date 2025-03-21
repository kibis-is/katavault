import { encodeAddress } from 'algosdk';

// errors
import { InvalidAccountError } from '@/errors';

/**
 * Gets an AVM address from a public key.
 * @param {Uint8Array} publicKey - The public key.
 * @returns {string} The AVM address.
 * @see {@link https://developer.algorand.org/docs/get-details/accounts/#keys-and-addresses}
 * @throws {InvalidAccountError} If the supplied public key is not a valid AVM account.
 */
export default function addressFromPublicKey(publicKey: Uint8Array): string {
  try {
    return encodeAddress(publicKey);
  } catch (error) {
    throw new InvalidAccountError(error.message);
  }
}

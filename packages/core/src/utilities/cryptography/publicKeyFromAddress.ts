import { decodeAddress } from 'algosdk';

// errors
import { InvalidAccountError } from '@/errors';

/**
 * Gets the public key for a given AVM address.
 * @param {string} address - The AVM address.
 * @returns {Uint8Array} The public key for the given AVM address.
 * @see {@link https://developer.algorand.org/docs/get-details/accounts/#keys-and-addresses}
 * @throws {InvalidAccountError} If the supplied address is not a valid AVM account.
 */
export default function publicKeyFromAddress(address: string): Uint8Array {
  try {
    return decodeAddress(address).publicKey;
  } catch (error) {
    throw new InvalidAccountError(error.message);
  }
}

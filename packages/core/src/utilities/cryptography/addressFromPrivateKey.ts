import { encodeAddress } from 'algosdk';

// errors
import { InvalidPrivateKeyError } from '@/errors';

// utilities
import publicKeyFromPrivateKey from './publicKeyFromPrivateKey';

/**
 * Gets an AVM address from a private key.
 * @param {Uint8Array} privateKey - The private key.
 * @returns {string} The AVM address.
 * @see {@link https://developer.algorand.org/docs/get-details/accounts/#keys-and-addresses}
 * @throws {InvalidPrivateKeyError} If the supplied private key is invalid.
 */
export default function addressFromPrivateKey(privateKey: Uint8Array): string {
  try {
    const publicKey = publicKeyFromPrivateKey(privateKey);

    return encodeAddress(publicKey);
  } catch (error) {
    throw new InvalidPrivateKeyError(error.message);
  }
}

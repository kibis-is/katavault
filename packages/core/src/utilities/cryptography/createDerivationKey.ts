import { sha512 } from '@noble/hashes/sha512';
import scrypt from 'scrypt-async';

// types
import type { CreateDerivationKeyParameters } from '@/types';

/**
 * Creates a derived key using the scrypt key derivation function.
 *
 * @param {CreateDerivationKeyParameters} params - The parameters for creating the derived key.
 * @param {number} params.keyLength - The byte length of the derived key.
 * @param {Uint8Array} params.salt - The salt used to derive key.
 * @param {Uint8Array} params.secret - The secret used to derive the private key. This is hashed using SHA-512.
 * @return {Promise<Uint8Array>} A promise that resolves to the derived key as a Uint8Array.
 */
export default async function createDerivationKey({
  keyLength,
  salt,
  secret,
}: CreateDerivationKeyParameters): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const hashedSecret = sha512(secret);

    scrypt(
      hashedSecret,
      salt,
      {
        N: 16384, // cpu/memory cost parameter (must be power of two; alternatively, you can specify logN where N = 2^logN).
        r: 8, // block size parameter
        p: 1, // parallelization parameter
        dkLen: keyLength, // derived key length
        encoding: 'binary',
      },
      (derivedKey: Uint8Array) => resolve(derivedKey)
    );
  });
}

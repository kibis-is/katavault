import { bytesToNumberBE, numberToBytesBE } from '@noble/curves/abstract/utils';
import { secp256k1 } from '@noble/curves/secp256k1';

// constants
import { PRIVATE_KEY_BYTE_LENGTH } from '@/constants';

/**
 * Checks the Secp256k1 validity of a derived key, if it is valid, it returns the key, otherwise, it converts it to a
 * valid key by reducing the modulo using:
 *
 * ```
 * x = <derivedKey> // the derived key input
 * n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141 // secp256k1 curve order
 *
 * validKey = int(x) mod (n − 1) + 1
 * ```
 *
 * @param {Uint8Array} derivedKey - The derived key to convert to a valid Secp256k1 key.
 * @returns {Uint8Array} The derived key if it is already valid, or the derived key with a reduced modulo.
 */
export default function toValidSecp256k1PrivateKey(derivedKey: Uint8Array): Uint8Array {
  let keyBE: bigint;

  if (secp256k1.utils.isValidPrivateKey(derivedKey)) {
    return derivedKey;
  }

  keyBE = bytesToNumberBE(derivedKey);
  keyBE = (keyBE % (secp256k1.CURVE.n - 1n)) + 1n;

  return numberToBytesBE(keyBE, PRIVATE_KEY_BYTE_LENGTH); // 32-bytes
}

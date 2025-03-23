import { encode } from '@stablelib/hex';

/**
 * Encodes some bytes to lowercase hexadecimal.
 * @param {Uint8Array} bytes - The bytes to encode.
 * @returns {string} The bytes encoded to lowercase hexadecimal.
 */
export default function bytesToHex(bytes: Uint8Array): string {
  return encode(bytes, true);
}

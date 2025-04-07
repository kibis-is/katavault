import { decode } from '@stablelib/utf8';

/**
 * Encodes some bytes to UTF-8.
 * @param {Uint8Array} bytes - The bytes to encode.
 * @returns {string} The bytes encoded to lUTF-8.
 */
export default function bytesToUTF8(bytes: Uint8Array): string {
  return decode(bytes);
}

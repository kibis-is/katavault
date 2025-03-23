import { encode } from '@stablelib/utf8';

/**
 * Decodes a UTF-8 string to bytes.
 * @param {string} value - The UTF-8 string to decode.
 * @returns {Uint8Array} The decoded UTF-8 string.
 */
export default function utf8ToBytes(value: string): Uint8Array {
  return encode(value);
}

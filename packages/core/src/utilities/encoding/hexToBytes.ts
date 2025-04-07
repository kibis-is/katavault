import { decode } from '@stablelib/hex';

/**
 * Decodes a hexadecimal string to bytes.
 * @param {string} value - The hexadecimal string to decode.
 * @returns {Uint8Array} The decoded hexadecimal string.
 */
export default function hexToBytes(value: string): Uint8Array {
  return decode(value);
}

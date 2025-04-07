import { decode } from '@stablelib/base64';

/**
 * Decodes a base64 string to bytes.
 * @param {string} value - The base64 string to decode.
 * @returns {Uint8Array} The decoded base64 string.
 */
export default function base64ToBytes(value: string): Uint8Array {
  return decode(value);
}

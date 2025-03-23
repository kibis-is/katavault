import { encode } from '@stablelib/base64';

/**
 * Encodes some bytes to base64.
 * @param {Uint8Array} bytes - The bytes to encode.
 * @returns {string} The bytes encoded to base64.
 */
export default function bytesToBase64(bytes: Uint8Array): string {
  return encode(bytes);
}

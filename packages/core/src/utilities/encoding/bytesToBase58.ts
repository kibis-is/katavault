import bs58 from 'bs58';

/**
 * Encodes some bytes to base58.
 * @param {Uint8Array} bytes - The bytes to encode.
 * @returns {string} The bytes encoded to base58.
 */
export default function bytesToBase58(bytes: Uint8Array): string {
  return bs58.encode(bytes);
}

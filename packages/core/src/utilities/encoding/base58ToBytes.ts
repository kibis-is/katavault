import bs58 from 'bs58';

/**
 * Decodes a base58 string to bytes.
 * @param {string} value - The base58 encoded string to decode.
 * @returns {Uint8Array} The decoded base58 string.
 */
export default function base58ToBytes(value: string): Uint8Array {
  return bs58.decode(value);
}

import { seedFromMnemonic } from 'algosdk';

/**
 * Wrapper for the algosdk function to convert a mnemonic to a private key.
 * @param {string} mnemonic - The 25-word mnemonic seed phrase.
 * @returns {Uint8Array} The private key derived from the mnemonic seed phrase.
 */
export default function privateKeyFromMnemonic(mnemonic: string): Uint8Array {
  return seedFromMnemonic(mnemonic);
}

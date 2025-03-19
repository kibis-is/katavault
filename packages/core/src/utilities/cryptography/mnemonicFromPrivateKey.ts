import { mnemonicFromSeed } from 'algosdk';

// errors
import { InvalidPrivateKeyError } from '@/errors';

/**
 * Convert a private key to a 25-word whitespace separated mnemonic seed phrase.
 * @param {Uint8Array} privateKey - The private key.
 * @returns {string} The 25-word mnemonic seed phrase from the given private key.
 * @throws {InvalidPrivateKeyError} If the private key is invalid.
 */
export default function mnemonicFromPrivateKey(privateKey: Uint8Array): string {
  try {
    return mnemonicFromSeed(privateKey);
  } catch (error) {
    throw new InvalidPrivateKeyError(error.message);
  }
}

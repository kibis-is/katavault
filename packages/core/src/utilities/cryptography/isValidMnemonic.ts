import { seedFromMnemonic } from 'algosdk';

/**
 * Checks if a mnemonic is valid.
 * @param {string} mnemonic - The whitespace separated 25-word mnemonic phrase.
 * @returns {boolean} True, if the mnemonic phrase is valid, false otherwise.
 */
export default function isValidMnemonic(mnemonic: string): boolean {
  try {
    seedFromMnemonic(mnemonic);

    return true;
  } catch (error) {
    return false;
  }
}

// constants
import {
  ARABIC_CHARACTER_POOL_SIZE,
  ASCII_CHARACTER_POOL_SIZE,
  CYRILLIC_CHARACTER_POOL_SIZE,
  EMOJI_CHARACTER_POOL_SIZE,
  GREEK_CHARACTER_POOL_SIZE,
  LATIN1_SUPPLEMENT_CHARACTER_POOL_SIZE,
} from '@/constants';

/**
 * Calculates the complexity score of a given password based on its entropy.
 *
 * The entropy is determined by the following formula:
 * ```
 * L = The length of the password
 * R = The size of the character pool (the number of unique characters from which the password is drawn)
 *
 * entropy = L x log2(R)
 * ```
 *
 * The character pool size is determined by whether the password contains a character from the following pools:
 * * 95 printable ASCII characters.
 * * 256 Arabic characters.
 * * 256 Cyrillic characters.
 * * 3,664 Unicode 15.0 emojis set.
 * * 135 Greek characters.
 * * 191 Latin-1 supplement characters.
 *
 * Score mapping based on entropy:
 * * `-1`: empty password (unscored)
 * * `0`: too low entropy (< 128 bits)
 * * `1`: acceptable entropy (>= 128 bits and < 256 bits)
 * * `2`: high entropy (>= 256 bits)
 *
 * @param {string} password - The password to score.
 * @returns {number} The score of the password.
 */
export default function passwordScore(password: string): number {
  let entropy: number;
  let graphemes: Intl.SegmentData[];
  let poolSize: number = ASCII_CHARACTER_POOL_SIZE; // use ascii characters as the base pool size
  let segmenter: Intl.Segmenter;

  if (password.length <= 0) {
    return -1;
  }

  // check for arabic characters
  if (/[\u0600-\u06FF]/.test(password)) {
    poolSize += ARABIC_CHARACTER_POOL_SIZE;
  }

  // check for cyrillic characters
  if (/[\u0400-\u04FF]/.test(password)) {
    poolSize += CYRILLIC_CHARACTER_POOL_SIZE;
  }

  // check for single codepoint emojis
  if (/\p{Emoji}/u.test(password)) {
    poolSize += EMOJI_CHARACTER_POOL_SIZE;
  }

  // check for greek characters
  if (/[\u0370-\u03FF]/.test(password)) {
    poolSize += GREEK_CHARACTER_POOL_SIZE;
  }

  // check for latin-1 supplement characters
  if (/[\xA0-\xFF]/.test(password)) {
    poolSize += LATIN1_SUPPLEMENT_CHARACTER_POOL_SIZE;
  }

  segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  graphemes = Array.from(segmenter.segment(password)); // get the grapheme clusters, i.e., the length of emoji characters, not the byte length which could be 1-4 bytes
  entropy = graphemes.length * Math.log2(poolSize); // L x log2(R)

  if (entropy > 256) {
    return 2;
  }

  if (entropy >= 128 && entropy < 256) {
    return 1;
  }

  return 0;
}

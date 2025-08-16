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
 * The character pool is drawn from ASCII characters (95 in size) and the Unicode 15.0 emoji set (3664 in size).
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
  let asciiPoolSize: number;
  let emojiPoolSize: number;
  let entropy: number;
  let graphemes: Intl.SegmentData[];
  let segmenter: Intl.Segmenter;

  if (password.length <= 0) {
    return -1;
  }

  segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  graphemes = Array.from(segmenter.segment(password)); // get the grapheme clusters, i.e., the length of emoji characters, not the byte length which could be 1-4 bytes
  asciiPoolSize = 95; // printable ascii
  emojiPoolSize = 3664; // unicode 15.0 official emojis
  entropy = graphemes.length * Math.log2(asciiPoolSize + emojiPoolSize); // L x log2(R)

  if (entropy > 256) {
    return 2;
  }

  if (entropy >= 128 && entropy < 256) {
    return 1;
  }

  return 0;
}

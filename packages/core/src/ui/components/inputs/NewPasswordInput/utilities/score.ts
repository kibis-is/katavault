import zxcvbn from 'zxcvbn';

/**
 * Calculates the complexity score a given password. The score uses the zxcvbn password score estimator, and the score
 * is as follows:
 * * -1 - indicates the value is "unscored", in other words, it is an empyt string.
 * * 0 - too guessable: risky password. (guesses < 10^3)
 * * 1 - very guessable: protection from throttled online attacks. (guesses < 10^6)
 * * 2 - somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
 * * 3 - safely unguessable: moderate protection from an offline slow-hash scenario. (guesses < 10^10)
 * * 4 - very unguessable: strong protection from an offline slow-hash scenario. (guesses >= 10^10)
 * @param {string} value - The password to score.
 * @returns {number} The score of the password.
 * @see {@link https://github.com/dropbox/zxcvbn}
 */
export default function score(value: string): number {
  return value.length <= 0 ? -1 : zxcvbn(value).score;
}
